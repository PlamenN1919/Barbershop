import { Appointment, Barber, Service, AnalyticsData, DateRangePeriod, RevenueMetrics, CustomerMetrics, ProductivityMetrics, ServiceMetrics } from './types';
import { SERVICES, getServiceIdsFromAppointment } from './constants';

/**
 * Генерира период от дати според избрания DateRange
 */
export function getDateRangePeriod(range: 'today' | 'week' | 'month' | 'year', customStart?: string, customEnd?: string): DateRangePeriod {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  if (range === 'today') {
    const dateStr = today.toISOString().split('T')[0];
    return { startDate: dateStr, endDate: dateStr };
  }
  
  if (range === 'week') {
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Понеделник
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    return {
      startDate: startOfWeek.toISOString().split('T')[0],
      endDate: endOfWeek.toISOString().split('T')[0]
    };
  }
  
  if (range === 'month') {
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    return {
      startDate: startOfMonth.toISOString().split('T')[0],
      endDate: endOfMonth.toISOString().split('T')[0]
    };
  }
  
  if (range === 'year') {
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    const endOfYear = new Date(today.getFullYear(), 11, 31);
    return {
      startDate: startOfYear.toISOString().split('T')[0],
      endDate: endOfYear.toISOString().split('T')[0]
    };
  }
  
  // Custom range
  return {
    startDate: customStart || today.toISOString().split('T')[0],
    endDate: customEnd || today.toISOString().split('T')[0]
  };
}

/**
 * Филтрира резервации според период
 */
export function filterAppointmentsByPeriod(appointments: Appointment[], period: DateRangePeriod): Appointment[] {
  return appointments.filter(apt => {
    return apt.appointmentDate >= period.startDate && apt.appointmentDate <= period.endDate;
  });
}

/**
 * Намира услуга по ID
 */
function getService(serviceId: string): Service | undefined {
  return SERVICES.find(s => s.id === serviceId);
}

/**
 * Изчислява приходни метрики
 */
export function calculateRevenueMetrics(
  appointments: Appointment[],
  period: DateRangePeriod,
  previousPeriodAppointments?: Appointment[]
): RevenueMetrics {
  const filteredAppointments = filterAppointmentsByPeriod(appointments, period).filter(
    apt => apt.status === 'completed'
  );
  
  let total = 0;
  const byService: Record<string, number> = {};
  const byBarber: Record<string, number> = {};
  
  filteredAppointments.forEach(apt => {
    const svcIds = getServiceIdsFromAppointment(apt.serviceId);
    let aptPrice = 0;

    svcIds.forEach(svcId => {
      const service = getService(svcId);
      const price = service?.price || 0;
      aptPrice += price;

      // По услуга
      if (!byService[svcId]) {
        byService[svcId] = 0;
      }
      byService[svcId] += price;
    });

    total += aptPrice;
    
    // По бръснар
    if (!byBarber[apt.barberId]) {
      byBarber[apt.barberId] = 0;
    }
    byBarber[apt.barberId] += aptPrice;
  });
  
  const average = filteredAppointments.length > 0 ? total / filteredAppointments.length : 0;
  
  // Изчисляваме тренд спрямо предишен период
  let trend = 0;
  if (previousPeriodAppointments) {
    const prevCompleted = previousPeriodAppointments.filter(apt => apt.status === 'completed');
    let prevTotal = 0;
    prevCompleted.forEach(apt => {
      const svcIds = getServiceIdsFromAppointment(apt.serviceId);
      svcIds.forEach(svcId => {
        const service = getService(svcId);
        prevTotal += service?.price || 0;
      });
    });
    
    if (prevTotal > 0) {
      trend = ((total - prevTotal) / prevTotal) * 100;
    } else if (total > 0) {
      trend = 100;
    }
  }
  
  return {
    total,
    average: Math.round(average * 100) / 100,
    byService,
    byBarber,
    trend: Math.round(trend * 10) / 10
  };
}

/**
 * Нормализира име и телефон за идентификация на клиент
 */
function normalizeCustomer(name: string, phone: string): string {
  return `${name.toLowerCase().trim()}|${phone.replace(/\s/g, '')}`;
}

/**
 * Изчислява клиентски метрики
 */
export function calculateCustomerMetrics(
  appointments: Appointment[],
  period: DateRangePeriod,
  allAppointments: Appointment[]
): CustomerMetrics {
  const filteredAppointments = filterAppointmentsByPeriod(appointments, period).filter(
    apt => apt.status === 'completed' || apt.status === 'upcoming'
  );
  
  const customerSet = new Set<string>();
  const customerVisits: Record<string, { name: string; phone: string; count: number }> = {};
  
  filteredAppointments.forEach(apt => {
    const customerId = normalizeCustomer(apt.customerName, apt.customerPhone);
    customerSet.add(customerId);
    
    if (!customerVisits[customerId]) {
      customerVisits[customerId] = { name: apt.customerName, phone: apt.customerPhone, count: 0 };
    }
    customerVisits[customerId].count++;
  });
  
  // Определяме нови vs повтарящи се клиенти
  const appointmentsBeforePeriod = allAppointments.filter(
    apt => apt.appointmentDate < period.startDate && (apt.status === 'completed' || apt.status === 'upcoming')
  );
  
  const existingCustomers = new Set<string>();
  appointmentsBeforePeriod.forEach(apt => {
    existingCustomers.add(normalizeCustomer(apt.customerName, apt.customerPhone));
  });
  
  let newCustomers = 0;
  let returningCustomers = 0;
  
  customerSet.forEach(customerId => {
    if (existingCustomers.has(customerId)) {
      returningCustomers++;
    } else {
      newCustomers++;
    }
  });
  
  // Retention rate - процент клиенти, които са се върнали
  const totalUniqueCustomers = customerSet.size;
  const retentionRate = totalUniqueCustomers > 0 ? (returningCustomers / totalUniqueCustomers) * 100 : 0;
  
  // Топ лоялни клиенти (по брой посещения в целия период)
  const allCustomerVisits: Record<string, { name: string; phone: string; count: number }> = {};
  allAppointments
    .filter(apt => apt.status === 'completed')
    .forEach(apt => {
      const customerId = normalizeCustomer(apt.customerName, apt.customerPhone);
      if (!allCustomerVisits[customerId]) {
        allCustomerVisits[customerId] = { name: apt.customerName, phone: apt.customerPhone, count: 0 };
      }
      allCustomerVisits[customerId].count++;
    });
  
  const topLoyalCustomers = Object.values(allCustomerVisits)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
    .map(c => ({ name: c.name, phone: c.phone, visits: c.count }));
  
  return {
    total: totalUniqueCustomers,
    new: newCustomers,
    returning: returningCustomers,
    retentionRate: Math.round(retentionRate * 10) / 10,
    topLoyalCustomers
  };
}

/**
 * Изчислява продуктивност
 */
export function calculateProductivityMetrics(
  appointments: Appointment[],
  period: DateRangePeriod,
  barbers: Barber[]
): ProductivityMetrics {
  const filteredAppointments = filterAppointmentsByPeriod(appointments, period);
  
  // Изчисляваме брой дни в периода
  const startDate = new Date(period.startDate);
  const endDate = new Date(period.endDate);
  const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  
  const appointmentsPerDay = filteredAppointments.length > 0 ? filteredAppointments.length / daysDiff : 0;
  
  // Резервации по бръснар
  const appointmentsPerBarber: Record<string, number> = {};
  barbers.forEach(barber => {
    appointmentsPerBarber[barber.id] = 0;
  });
  
  const hourlyCount: Record<string, number> = {};
  
  filteredAppointments.forEach(apt => {
    // По бръснар
    if (appointmentsPerBarber[apt.barberId] !== undefined) {
      appointmentsPerBarber[apt.barberId]++;
    }
    
    // По час
    const hour = apt.appointmentTime.split(':')[0];
    if (!hourlyCount[hour]) {
      hourlyCount[hour] = 0;
    }
    hourlyCount[hour]++;
  });
  
  // Най-натоварени часове
  const busiestHours = Object.entries(hourlyCount)
    .map(([hour, count]) => ({ hour: `${hour}:00`, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  
  // Процент отменени
  const cancelledCount = filteredAppointments.filter(apt => apt.status === 'cancelled').length;
  const cancelledRate = filteredAppointments.length > 0 
    ? (cancelledCount / filteredAppointments.length) * 100 
    : 0;
  
  // Утилизация (работни часове: 9-20, 11 часа на ден, 6 дни седмично)
  const workingHoursPerDay = 11;
  const workingDaysPerWeek = 6;
  const weeksInPeriod = daysDiff / 7;
  const totalWorkingHours = workingHoursPerDay * workingDaysPerWeek * weeksInPeriod * barbers.length;
  
  let totalServiceHours = 0;
  filteredAppointments
    .filter(apt => apt.status === 'completed' || apt.status === 'upcoming')
    .forEach(apt => {
      const svcIds = getServiceIdsFromAppointment(apt.serviceId);
      svcIds.forEach(svcId => {
        const service = getService(svcId);
        totalServiceHours += (service?.durationMinutes || 30) / 60;
      });
    });
  
  const utilizationRate = totalWorkingHours > 0 ? (totalServiceHours / totalWorkingHours) * 100 : 0;
  
  return {
    utilizationRate: Math.round(utilizationRate * 10) / 10,
    appointmentsPerDay: Math.round(appointmentsPerDay * 10) / 10,
    appointmentsPerBarber,
    busiestHours,
    cancelledRate: Math.round(cancelledRate * 10) / 10
  };
}

/**
 * Изчислява метрики за услуги
 */
export function calculateServiceMetrics(
  appointments: Appointment[],
  period: DateRangePeriod,
  barbers: Barber[]
): ServiceMetrics {
  const filteredAppointments = filterAppointmentsByPeriod(appointments, period).filter(
    apt => apt.status === 'completed' || apt.status === 'upcoming'
  );
  
  const serviceCount: Record<string, { count: number; revenue: number }> = {};
  const servicesByBarber: Record<string, Record<string, number>> = {};
  
  // Инициализираме за всеки бръснар
  barbers.forEach(barber => {
    servicesByBarber[barber.id] = {};
  });
  
  filteredAppointments.forEach(apt => {
    const svcIds = getServiceIdsFromAppointment(apt.serviceId);

    svcIds.forEach(svcId => {
      const service = getService(svcId);
      const price = service?.price || 0;

      // Общ брой и приход по услуга
      if (!serviceCount[svcId]) {
        serviceCount[svcId] = { count: 0, revenue: 0 };
      }
      serviceCount[svcId].count++;
      if (apt.status === 'completed') {
        serviceCount[svcId].revenue += price;
      }

      // По бръснар
      if (servicesByBarber[apt.barberId]) {
        if (!servicesByBarber[apt.barberId][svcId]) {
          servicesByBarber[apt.barberId][svcId] = 0;
        }
        servicesByBarber[apt.barberId][svcId]++;
      }
    });
  });
  
  // Топ услуги
  const topServices = Object.entries(serviceCount)
    .map(([serviceId, data]) => {
      const service = getService(serviceId);
      return {
        serviceId,
        serviceName: service?.name || 'Неизвестна услуга',
        count: data.count,
        revenue: data.revenue
      };
    })
    .sort((a, b) => b.count - a.count);
  
  return {
    topServices,
    servicesByBarber
  };
}

/**
 * Генерира пълни аналитични данни
 */
export function generateAnalytics(
  appointments: Appointment[],
  barbers: Barber[],
  period: DateRangePeriod,
  previousPeriodAppointments?: Appointment[]
): AnalyticsData {
  return {
    revenue: calculateRevenueMetrics(appointments, period, previousPeriodAppointments),
    customers: calculateCustomerMetrics(appointments, period, appointments),
    productivity: calculateProductivityMetrics(appointments, period, barbers),
    services: calculateServiceMetrics(appointments, period, barbers)
  };
}

/**
 * Генерира предишен период за сравнение
 */
export function getPreviousPeriod(period: DateRangePeriod): DateRangePeriod {
  const start = new Date(period.startDate);
  const end = new Date(period.endDate);
  const daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  
  const prevEnd = new Date(start);
  prevEnd.setDate(prevEnd.getDate() - 1);
  
  const prevStart = new Date(prevEnd);
  prevStart.setDate(prevStart.getDate() - daysDiff);
  
  return {
    startDate: prevStart.toISOString().split('T')[0],
    endDate: prevEnd.toISOString().split('T')[0]
  };
}

/**
 * Форматира валута
 */
export function formatCurrency(amount: number): string {
  return `${amount.toFixed(2)} €`;
}

/**
 * Форматира процент
 */
export function formatPercent(value: number): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
}

/**
 * Форматира дата
 */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('bg-BG', { day: 'numeric', month: 'short', year: 'numeric' });
}
