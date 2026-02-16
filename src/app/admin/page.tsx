'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Scissors, LogOut, CalendarDays, BarChart3, Clock, Users, RefreshCw, UserCog, Search, X, TrendingUp, DollarSign, Loader2 } from 'lucide-react';
import { Appointment, Barber, BlockedSlot, BookingFormData } from '@/lib/types';
import {
  apiGetAppointments,
  apiUpdateAppointmentStatus,
  apiCreateAppointment,
  apiRescheduleAppointment,
  apiDeleteAppointment,
  apiGetBarbers,
  apiAddBarber,
  apiRemoveBarber,
  apiResetBarbers,
  apiGetBlockedSlots,
  apiAddBlockedSlot,
  apiRemoveBlockedSlot,
  apiGetAnalytics,
  apiSeedTestData,
  apiLogin,
  apiLogout,
  apiVerifyAuth,
  AnalyticsResponse,
} from '@/lib/api';
import { formatCurrency } from '@/lib/analytics';
import { SERVICES } from '@/lib/constants';
import LoginForm from '@/components/admin/LoginForm';
import CalendarView from '@/components/admin/CalendarView';
import BarberFilter from '@/components/admin/BarberFilter';
import BarberManager from '@/components/admin/BarberManager';
import TodayOverview from '@/components/admin/TodayOverview';
import AvailabilityManager from '@/components/admin/AvailabilityManager';
import DateRangeSelector from '@/components/admin/DateRangeSelector';
import MetricCard from '@/components/admin/MetricCard';
import RevenueChart from '@/components/admin/RevenueChart';
import BarberPerformance from '@/components/admin/BarberPerformance';
import PopularServicesTable from '@/components/admin/PopularServicesTable';
import BusyHoursChart from '@/components/admin/BusyHoursChart';
import TopCustomersTable from '@/components/admin/TopCustomersTable';
import CustomerInsights from '@/components/admin/CustomerInsights';
import Button from '@/components/ui/Button';

type Tab = 'appointments' | 'availability' | 'barbers' | 'analytics';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('appointments');
  const [selectedBarberId, setSelectedBarberId] = useState('');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [blockedSlots, setBlockedSlots] = useState<BlockedSlot[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [analyticsRange, setAnalyticsRange] = useState<'today' | 'week' | 'month' | 'year'>('month');
  const [analyticsData, setAnalyticsData] = useState<AnalyticsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Check if already authenticated (session cookie)
  useEffect(() => {
    apiVerifyAuth().then((auth) => {
      setIsAuthenticated(auth);
      setIsCheckingAuth(false);
    });
  }, []);

  // Load data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      refreshData();
    }
  }, [isAuthenticated]);

  // Load analytics when range changes
  useEffect(() => {
    if (isAuthenticated && activeTab === 'analytics') {
      loadAnalytics();
    }
  }, [isAuthenticated, analyticsRange, activeTab]);

  // Load blocked slots when tab changes
  useEffect(() => {
    if (isAuthenticated && activeTab === 'availability') {
      loadBlockedSlots();
    }
  }, [isAuthenticated, activeTab]);

  const refreshData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [appts, brbrs] = await Promise.all([
        apiGetAppointments(),
        apiGetBarbers(),
      ]);
      setAppointments(appts);
      setBarbers(brbrs);
    } catch (err) {
      console.error('Грешка при зареждане на данни:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadAnalytics = useCallback(async () => {
    try {
      const data = await apiGetAnalytics(analyticsRange);
      setAnalyticsData(data);
    } catch (err) {
      console.error('Грешка при зареждане на аналитика:', err);
    }
  }, [analyticsRange]);

  const loadBlockedSlots = useCallback(async () => {
    try {
      const slots = await apiGetBlockedSlots();
      setBlockedSlots(slots);
    } catch (err) {
      console.error('Грешка при зареждане на блокирани слотове:', err);
    }
  }, []);

  const handleResetBarbers = useCallback(async () => {
    if (window.confirm('Това ще презареди бръснарите от началните данни. Сигурни ли сте?')) {
      try {
        const newBarbers = await apiResetBarbers();
        setBarbers(newBarbers);
      } catch (err) {
        console.error('Грешка:', err);
      }
    }
  }, []);

  const handleGenerateTestData = useCallback(async () => {
    if (window.confirm('Това ще генерира 50 тестови резервации за последните 3 месеца. Продължаваме?')) {
      try {
        await apiSeedTestData();
        await refreshData();
      } catch (err) {
        console.error('Грешка:', err);
      }
    }
  }, [refreshData]);

  const handleLogin = async (email: string, password: string) => {
    await apiLogin(email, password);
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    await apiLogout();
    setIsAuthenticated(false);
    setAppointments([]);
    setBarbers([]);
    setBlockedSlots([]);
  };

  const handleUpdateStatus = async (id: string, status: 'completed' | 'cancelled') => {
    try {
      await apiUpdateAppointmentStatus(id, status);
      setAppointments((prev) =>
        prev.map((apt) => (apt.id === id ? { ...apt, status } : apt))
      );
    } catch (err) {
      console.error('Грешка при обновяване на статус:', err);
    }
  };

  const handleAddAppointment = async (data: BookingFormData) => {
    try {
      const result = await apiCreateAppointment(data);
      setAppointments((prev) => [...prev, result.appointment]);
    } catch (err) {
      console.error('Грешка при добавяне на резервация:', err);
    }
  };

  const handleReschedule = async (id: string, newDate: string, newTime: string, newBarberId?: string): Promise<boolean> => {
    try {
      const updated = await apiRescheduleAppointment(id, newDate, newTime, newBarberId);
      setAppointments((prev) =>
        prev.map((apt) => (apt.id === id ? updated : apt))
      );
      return true;
    } catch (err) {
      console.error('Грешка при пренасрочване:', err);
      return false;
    }
  };

  const handleDeleteAppointment = async (id: string) => {
    try {
      await apiDeleteAppointment(id);
      setAppointments((prev) => prev.filter((apt) => apt.id !== id));
    } catch (err) {
      console.error('Грешка при изтриване:', err);
    }
  };

  const handleAddBarber = async (data: Omit<Barber, 'id' | 'rating' | 'reviewCount'>) => {
    try {
      const barber = await apiAddBarber(data);
      setBarbers((prev) => [...prev, barber]);
    } catch (err) {
      console.error('Грешка при добавяне на бръснар:', err);
    }
  };

  const handleRemoveBarber = async (id: string) => {
    try {
      await apiRemoveBarber(id);
      setBarbers((prev) => prev.filter((b) => b.id !== id));
      if (selectedBarberId === id) setSelectedBarberId('');
    } catch (err) {
      console.error('Грешка при премахване на бръснар:', err);
    }
  };

  const handleAddBlock = async (slot: Omit<BlockedSlot, 'id'>) => {
    try {
      const newSlot = await apiAddBlockedSlot(slot);
      setBlockedSlots((prev) => [...prev, newSlot]);
    } catch (err) {
      console.error('Грешка при блокиране на слот:', err);
    }
  };

  const handleRemoveBlock = async (id: string) => {
    try {
      await apiRemoveBlockedSlot(id);
      setBlockedSlots((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error('Грешка при премахване на блокиран слот:', err);
    }
  };

  const filteredAppointments = useMemo(() => {
    let filtered = appointments;
    if (selectedBarberId) {
      filtered = filtered.filter((apt) => apt.barberId === selectedBarberId);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      filtered = filtered.filter(
        (apt) =>
          apt.customerName.toLowerCase().includes(q) ||
          apt.customerPhone.toLowerCase().includes(q)
      );
    }
    return filtered.sort(
      (a, b) =>
        a.appointmentDate.localeCompare(b.appointmentDate) ||
        a.appointmentTime.localeCompare(b.appointmentTime)
    );
  }, [appointments, selectedBarberId, searchQuery]);

  const stats = useMemo(() => {
    const upcoming = appointments.filter((a) => a.status === 'upcoming').length;
    const completed = appointments.filter((a) => a.status === 'completed').length;
    const today = appointments.filter(
      (a) =>
        a.appointmentDate === new Date().toISOString().split('T')[0] &&
        a.status === 'upcoming'
    ).length;
    return { upcoming, completed, today, total: appointments.length };
  }, [appointments]);

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-lime animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) return <LoginForm onLogin={handleLogin} />;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-white/[0.06] bg-surface/50 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-lime flex items-center justify-center">
              <Scissors className="w-4 h-4 text-background" />
            </div>
            <div>
              <h1 className="font-heading font-bold text-sm uppercase tracking-wider">Админ панел</h1>
              <p className="text-white/30 text-xs">SNNAKE Barbershop</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={handleGenerateTestData}>
              <BarChart3 className="w-4 h-4" />
              Тест данни
            </Button>
            <Button variant="secondary" size="sm" onClick={refreshData} disabled={isLoading}>
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              Обнови
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
              Изход
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Днешен бърз преглед */}
        <TodayOverview appointments={appointments} barbers={barbers} />

        {/* Статистики */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: 'Днес', value: stats.today, icon: Clock, color: 'text-lime' },
            { label: 'Предстоящи', value: stats.upcoming, icon: CalendarDays, color: 'text-blue-400' },
            { label: 'Завършени', value: stats.completed, icon: BarChart3, color: 'text-green-400' },
            { label: 'Общо', value: stats.total, icon: Users, color: 'text-white/50' },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-4"
            >
              <div className="flex items-center gap-3">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                <div>
                  <p className="text-2xl font-heading font-bold text-white">{stat.value}</p>
                  <p className="text-white/30 text-xs uppercase tracking-wider font-heading">{stat.label}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Табове */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('appointments')}
            className={`px-5 py-2.5 rounded-xl text-sm font-heading font-bold uppercase tracking-wide transition-all whitespace-nowrap ${
              activeTab === 'appointments'
                ? 'bg-lime text-background'
                : 'bg-surface-light text-white/50 hover:text-white'
            }`}
          >
            <CalendarDays className="w-4 h-4 inline mr-2" />
            Резервации
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-5 py-2.5 rounded-xl text-sm font-heading font-bold uppercase tracking-wide transition-all whitespace-nowrap ${
              activeTab === 'analytics'
                ? 'bg-lime text-background'
                : 'bg-surface-light text-white/50 hover:text-white'
            }`}
          >
            <TrendingUp className="w-4 h-4 inline mr-2" />
            Аналитика
          </button>
          <button
            onClick={() => setActiveTab('availability')}
            className={`px-5 py-2.5 rounded-xl text-sm font-heading font-bold uppercase tracking-wide transition-all whitespace-nowrap ${
              activeTab === 'availability'
                ? 'bg-lime text-background'
                : 'bg-surface-light text-white/50 hover:text-white'
            }`}
          >
            <Clock className="w-4 h-4 inline mr-2" />
            Наличност
          </button>
          <button
            onClick={() => setActiveTab('barbers')}
            className={`px-5 py-2.5 rounded-xl text-sm font-heading font-bold uppercase tracking-wide transition-all whitespace-nowrap ${
              activeTab === 'barbers'
                ? 'bg-lime text-background'
                : 'bg-surface-light text-white/50 hover:text-white'
            }`}
          >
            <UserCog className="w-4 h-4 inline mr-2" />
            Бръснари
          </button>
        </div>

        {activeTab === 'appointments' && (
          <div className="space-y-6">
            {/* Търсене */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Търсене по име или телефон на клиент..."
                className="w-full pl-11 pr-10 py-3 rounded-xl bg-surface border border-white/[0.06] text-white placeholder-white/25 text-sm focus:outline-none focus:ring-2 focus:ring-lime/30 focus:border-lime/30 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg text-white/30 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <BarberFilter barbers={barbers} selectedBarberId={selectedBarberId} onSelect={setSelectedBarberId} />
            <CalendarView appointments={filteredAppointments} barbers={barbers} onUpdateStatus={handleUpdateStatus} onAddAppointment={handleAddAppointment} onReschedule={handleReschedule} onDelete={handleDeleteAppointment} />
          </div>
        )}

        {activeTab === 'analytics' && analyticsData && (
          <div className="space-y-6">
            <DateRangeSelector 
              range={analyticsRange} 
              onRangeChange={setAnalyticsRange}
              period={analyticsData.period}
            />

            {/* KPI Карти */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                label="Общ приход"
                value={formatCurrency(analyticsData.data.revenue.total)}
                icon={DollarSign}
                color="text-lime"
                trend={analyticsData.data.revenue.trend}
                delay={0}
              />
              <MetricCard
                label="Среден приход"
                value={formatCurrency(analyticsData.data.revenue.average)}
                icon={TrendingUp}
                color="text-blue-400"
                subtitle="на резервация"
                delay={0.1}
              />
              <MetricCard
                label="Общо клиенти"
                value={analyticsData.data.customers.total}
                icon={Users}
                color="text-green-400"
                subtitle={`${analyticsData.data.customers.new} нови`}
                delay={0.2}
              />
              <MetricCard
                label="Задържане"
                value={`${analyticsData.data.customers.retentionRate.toFixed(1)}%`}
                icon={BarChart3}
                color="text-amber-400"
                subtitle="повтарящи се клиенти"
                delay={0.3}
              />
            </div>

            {/* Графики и таблици */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RevenueChart 
                byService={analyticsData.data.revenue.byService}
                serviceNames={SERVICES.reduce((acc, s) => ({ ...acc, [s.id]: s.name }), {})}
              />
              <BarberPerformance
                barbers={barbers}
                revenueByBarber={analyticsData.data.revenue.byBarber}
                appointmentsByBarber={analyticsData.data.productivity.appointmentsPerBarber}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CustomerInsights metrics={analyticsData.data.customers} />
              <BusyHoursChart busiestHours={analyticsData.data.productivity.busiestHours} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PopularServicesTable services={analyticsData.data.services.topServices} />
              <TopCustomersTable customers={analyticsData.data.customers.topLoyalCustomers} />
            </div>

            {/* Допълнителни метрики */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <MetricCard
                label="Утилизация"
                value={`${analyticsData.data.productivity.utilizationRate.toFixed(1)}%`}
                icon={BarChart3}
                color="text-purple-400"
                subtitle="използване на времето"
              />
              <MetricCard
                label="Резервации/ден"
                value={analyticsData.data.productivity.appointmentsPerDay.toFixed(1)}
                icon={CalendarDays}
                color="text-blue-400"
                subtitle="среден брой"
              />
              <MetricCard
                label="Отменени"
                value={`${analyticsData.data.productivity.cancelledRate.toFixed(1)}%`}
                icon={X}
                color="text-red-400"
                subtitle="процент отмени"
              />
            </div>
          </div>
        )}

        {activeTab === 'analytics' && !analyticsData && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 text-lime animate-spin" />
            <span className="ml-3 text-white/40">Зареждане на аналитика...</span>
          </div>
        )}

        {activeTab === 'availability' && (
          <AvailabilityManager
            barbers={barbers}
            blockedSlots={blockedSlots}
            onAddBlock={handleAddBlock}
            onRemoveBlock={handleRemoveBlock}
          />
        )}

        {activeTab === 'barbers' && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button variant="ghost" size="sm" onClick={handleResetBarbers}>
                <RefreshCw className="w-4 h-4" />
                Презареди от началните данни
              </Button>
            </div>
            <BarberManager
              barbers={barbers}
              onAdd={handleAddBarber}
              onRemove={handleRemoveBarber}
            />
          </div>
        )}
      </div>
    </div>
  );
}
