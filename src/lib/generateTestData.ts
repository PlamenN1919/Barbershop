import { Appointment } from './types';
import { SERVICES } from './constants';

/**
 * Генерира тестови данни за аналитика
 */
export function generateTestAppointments(): Appointment[] {
  const barberIds = ['barber-1', 'barber-2', 'barber-3'];
  const serviceIds = SERVICES.map(s => s.id);
  const statuses: ('upcoming' | 'completed' | 'cancelled')[] = ['upcoming', 'completed', 'cancelled'];
  
  const appointments: Appointment[] = [];
  const today = new Date();
  
  // Генерираме 50 резервации за последните 3 месеца
  for (let i = 0; i < 50; i++) {
    // Дата между преди 90 дни и след 14 дни
    const daysOffset = Math.floor(Math.random() * 104) - 90;
    const aptDate = new Date(today);
    aptDate.setDate(today.getDate() + daysOffset);
    
    // Час между 9 и 19
    const hour = 9 + Math.floor(Math.random() * 11);
    const minute = Math.random() > 0.5 ? '00' : '30';
    
    // Статус - 70% completed, 25% upcoming, 5% cancelled
    let status: 'upcoming' | 'completed' | 'cancelled';
    const statusRand = Math.random();
    if (daysOffset > 0) {
      status = 'upcoming';
    } else if (statusRand < 0.7) {
      status = 'completed';
    } else if (statusRand < 0.95) {
      status = 'upcoming';
    } else {
      status = 'cancelled';
    }
    
    const barberId = barberIds[Math.floor(Math.random() * barberIds.length)];
    const serviceId = serviceIds[Math.floor(Math.random() * serviceIds.length)];
    
    const customerNames = [
      'Иван Петров',
      'Георги Димитров',
      'Николай Стоянов',
      'Петър Иванов',
      'Стефан Георгиев',
      'Димитър Николов',
      'Александър Петков',
      'Христо Тодоров',
      'Мартин Кирилов',
      'Илиян Василев',
      'Борис Маринов',
      'Красимир Атанасов',
      'Васил Йорданов',
      'Тодор Христов',
      'Любомир Ангелов'
    ];
    
    const customerName = customerNames[Math.floor(Math.random() * customerNames.length)];
    const phoneNumber = `+359 88${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)} ${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}`;
    
    appointments.push({
      id: `apt-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 7)}`,
      serviceId,
      barberId,
      customerName,
      customerPhone: phoneNumber,
      customerEmail: `${customerName.toLowerCase().replace(/\s/g, '.')}@example.com`,
      appointmentDate: aptDate.toISOString().split('T')[0],
      appointmentTime: `${hour.toString().padStart(2, '0')}:${minute}`,
      status,
      createdAt: new Date(aptDate.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      isFlagged: Math.random() < 0.05, // 5% flagged
      flagReason: Math.random() < 0.05 ? 'Дублирана резервация' : undefined
    });
  }
  
  return appointments.sort((a, b) => a.appointmentDate.localeCompare(b.appointmentDate));
}

// Експортираме функция за добавяне в localStorage
export function seedTestData() {
  if (typeof window === 'undefined') return;
  
  const testData = generateTestAppointments();
  localStorage.setItem('barbershop_appointments', JSON.stringify(testData));
  console.log(`✅ Генерирани ${testData.length} тестови резервации`);
  window.dispatchEvent(new CustomEvent('appointments-updated'));
}
