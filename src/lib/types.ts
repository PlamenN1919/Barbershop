export interface Service {
  id: string;
  name: string;
  price: number;
  durationMinutes: number;
  description: string;
  icon: string;
}

export interface Barber {
  id: string;
  name: string;
  photoUrl: string;
  specialty: string;
  isActive: boolean;
  rating: number;
  reviewCount: number;
}

export interface TimeSlot {
  time: string; // "HH:mm" format
  available: boolean;
}

export interface Appointment {
  id: string;
  serviceId: string;
  barberId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  appointmentDate: string; // "YYYY-MM-DD"
  appointmentTime: string; // "HH:mm"
  status: 'upcoming' | 'completed' | 'cancelled';
  createdAt: string;
  isFlagged?: boolean; // Флаг за съмнителна резервация
  flagReason?: string; // Причина за флаг
}

export interface BlockedSlot {
  id: string;
  barberId: string;
  blockedDate: string;
  startTime: string | null;
  endTime: string | null;
  reason: string;
}

export interface BookingFormData {
  serviceIds: string[];
  barberId: string;
  date: string;
  time: string;
  customerName: string;
  customerPhone: string;
}

export interface Testimonial {
  id: string;
  name: string;
  text: string;
  rating: number;
  clientSince: string;
}

export type BookingStep = 1 | 2 | 3 | 4 | 5;

// Аналитика типове
export type DateRange = 'today' | 'week' | 'month' | 'year' | 'custom';

export interface DateRangePeriod {
  startDate: string; // "YYYY-MM-DD"
  endDate: string;   // "YYYY-MM-DD"
}

export interface RevenueMetrics {
  total: number;
  average: number;
  byService: Record<string, number>;
  byBarber: Record<string, number>;
  trend: number; // процент промяна спрямо предишен период
}

export interface CustomerMetrics {
  total: number;
  new: number;
  returning: number;
  retentionRate: number;
  topLoyalCustomers: Array<{
    name: string;
    phone: string;
    visits: number;
  }>;
}

export interface ProductivityMetrics {
  utilizationRate: number; // процент използване на времето
  appointmentsPerDay: number;
  appointmentsPerBarber: Record<string, number>;
  busiestHours: Array<{
    hour: string;
    count: number;
  }>;
  cancelledRate: number;
}

export interface ServiceMetrics {
  topServices: Array<{
    serviceId: string;
    serviceName: string;
    count: number;
    revenue: number;
  }>;
  servicesByBarber: Record<string, Record<string, number>>;
}

export interface AnalyticsData {
  revenue: RevenueMetrics;
  customers: CustomerMetrics;
  productivity: ProductivityMetrics;
  services: ServiceMetrics;
}
