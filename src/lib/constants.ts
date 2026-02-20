import { Service, Barber, Testimonial } from './types';

// Фиксиран курс EUR/BGN
export const EUR_TO_BGN = 1.95583;

/** Конвертира евро в лева */
export function toLeva(eur: number): string {
  return (eur * EUR_TO_BGN).toFixed(2);
}

/** Извлича масив от serviceId-та от appointment (поддържа comma-separated) */
export function getServiceIdsFromAppointment(serviceId: string): string[] {
  return serviceId.split(',').map(s => s.trim()).filter(Boolean);
}

/** Намира услуга по ID */
export function getServiceById(id: string): Service | undefined {
  return SERVICES.find(s => s.id === id);
}

/** Изчислява обща цена за масив от serviceIds */
export function getTotalPrice(serviceIds: string[]): number {
  return serviceIds.reduce((sum, id) => {
    const service = SERVICES.find(s => s.id === id);
    return sum + (service?.price || 0);
  }, 0);
}

/** Изчислява обща продължителност за масив от serviceIds */
export function getTotalDuration(serviceIds: string[]): number {
  return serviceIds.reduce((sum, id) => {
    const service = SERVICES.find(s => s.id === id);
    return sum + (service?.durationMinutes || 0);
  }, 0);
}

export const SERVICES: Service[] = [
  {
    id: 'classic-haircut',
    name: 'Класическо Подстригване',
    price: 15,
    durationMinutes: 30,
    description: 'Прецизно подстригване, съобразено с вашия стил. Включва измиване и оформяне.',
    icon: 'Scissors',
  },
  {
    id: 'fade-haircut',
    name: 'Подстригване Фейд',
    price: 18,
    durationMinutes: 40,
    description: 'Модерен фейд с плавни преходи и перфектни линии. За тези, които искат стил.',
    icon: 'Zap',
  },
  {
    id: 'beard-trim',
    name: 'Оформяне на Брада',
    price: 8,
    durationMinutes: 20,
    description: 'Експертно оформяне на брада с гореща кърпа и прецизни линии.',
    icon: 'Sparkles',
  },
  {
    id: 'combo',
    name: 'Прическа + Брада',
    price: 25,
    durationMinutes: 45,
    description: 'Пълният пакет — подстригване и оформяне на брада. Излез като нов човек.',
    icon: 'Crown',
  },
  {
    id: 'eyebrow-threading',
    name: 'Вежди с Конец',
    price: 4,
    durationMinutes: 15,
    description: 'Прецизно оформяне на вежди с традиционна техника на конец.',
    icon: 'Eye',
  },
  {
    id: 'wax-treatment',
    name: 'Кола Маска — Нос и Уши',
    price: 4,
    durationMinutes: 15,
    description: 'Почистване с гореща кола маска за нос и уши. Цена на зона. Гладък завършек.',
    icon: 'Flame',
  },
  {
    id: 'face-mask',
    name: 'Маска за Лице',
    price: 3,
    durationMinutes: 25,
    description: 'Освежаваща маска за лице с премиум продукти. Релаксирай и освежи кожата си.',
    icon: 'Sparkle',
  },
];

export const BARBERS: Barber[] = [
  {
    id: 'barber-1',
    name: 'Алекс Димитров',
    photoUrl: '',
    specialty: 'Фейдове и модерни прически',
    isActive: true,
    rating: 4.9,
    reviewCount: 342,
  },
  {
    id: 'barber-2',
    name: 'Стефан Иванов',
    photoUrl: '',
    specialty: 'Класика и оформяне на брада',
    isActive: true,
    rating: 4.8,
    reviewCount: 287,
  },
  {
    id: 'barber-3',
    name: 'Мартин Петров',
    photoUrl: '',
    specialty: 'Бръснач арт и дизайни',
    isActive: true,
    rating: 4.9,
    reviewCount: 198,
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Николай К.',
    text: 'Най-доброто бръснарско студио в града. Алекс винаги прави перфектен фейд. Онлайн резервацията ми спестява толкова много време.',
    rating: 5,
    clientSince: '2022',
  },
  {
    id: '2',
    name: 'Георги М.',
    text: 'Идвам тук от 2 години. Атмосферата, уменията, вниманието към детайла — нямат равни. Горещо препоръчвам Пълното изживяване.',
    rating: 5,
    clientSince: '2023',
  },
  {
    id: '3',
    name: 'Иван П.',
    text: 'Най-после бръснарница, която уважава времето ти. Резервирах за 20 секунди, дойдох, получих най-доброто подстригване. Толкова просто.',
    rating: 5,
    clientSince: '2024',
  },
  {
    id: '4',
    name: 'Димитър С.',
    text: 'Стефан превърна брадата ми от хаос в произведение на изкуството. Премиум услуга на честна цена. Това е моето място вече.',
    rating: 5,
    clientSince: '2023',
  },
];

export const WORKING_HOURS = {
  start: 9, // 9:00
  end: 20, // 20:00
  slotDuration: 30, // минути
};

export const DAYS_AHEAD = 14; // Показва слотове за следващите 14 дни
