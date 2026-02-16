'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, Plus, Trash2, X } from 'lucide-react';
import { Barber, BlockedSlot } from '@/lib/types';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

interface AvailabilityManagerProps {
  barbers: Barber[];
  blockedSlots: BlockedSlot[];
  onAddBlock: (slot: Omit<BlockedSlot, 'id'>) => void;
  onRemoveBlock: (id: string) => void;
}

export default function AvailabilityManager({ barbers, blockedSlots, onAddBlock, onRemoveBlock }: AvailabilityManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [barberId, setBarberId] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [reason, setReason] = useState('');
  const [isFullDay, setIsFullDay] = useState(false);

  const handleAdd = () => {
    if (!barberId || !date) return;
    onAddBlock({
      barberId,
      blockedDate: date,
      startTime: isFullDay ? null : startTime || null,
      endTime: isFullDay ? null : endTime || null,
      reason: reason || 'Блокирано',
    });
    setBarberId('');
    setDate('');
    setStartTime('');
    setEndTime('');
    setReason('');
    setIsFullDay(false);
    setIsAdding(false);
  };

  const inputCls = "w-full px-4 py-3 rounded-xl bg-surface border border-white/[0.06] text-white focus:outline-none focus:ring-2 focus:ring-lime/40 text-sm";

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-heading font-bold text-lg uppercase">Управление на наличност</h3>
          <p className="text-white/30 text-sm">Блокирайте часове за почивки или отпуск</p>
        </div>
        <Button size="sm" onClick={() => setIsAdding(!isAdding)}>
          {isAdding ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {isAdding ? 'Отказ' : 'Блокирай час'}
        </Button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-6"
          >
            <div className="bg-surface-light rounded-xl p-5 space-y-4 border border-white/[0.06]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-white/40 font-heading font-bold uppercase tracking-wider mb-2 block">Бръснар</label>
                  <select value={barberId} onChange={(e) => setBarberId(e.target.value)} className={inputCls}>
                    <option value="">Изберете бръснар</option>
                    {barbers.map((b) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-white/40 font-heading font-bold uppercase tracking-wider mb-2 block">Дата</label>
                  <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputCls} />
                </div>
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFullDay}
                  onChange={(e) => setIsFullDay(e.target.checked)}
                  className="w-4 h-4 rounded border-white/20 bg-surface text-lime focus:ring-lime/50 accent-lime"
                />
                <span className="text-sm text-white/50">Блокирай целия ден</span>
              </label>

              {!isFullDay && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-white/40 font-heading font-bold uppercase tracking-wider mb-2 block">Начален час</label>
                    <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className={inputCls} />
                  </div>
                  <div>
                    <label className="text-xs text-white/40 font-heading font-bold uppercase tracking-wider mb-2 block">Краен час</label>
                    <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className={inputCls} />
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs text-white/40 font-heading font-bold uppercase tracking-wider mb-2 block">
                  Причина <span className="text-white/20">(по избор)</span>
                </label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="напр. Обедна почивка, Отпуск"
                  className={`${inputCls} placeholder-white/20`}
                />
              </div>

              <Button onClick={handleAdd} disabled={!barberId || !date}>
                <Plus className="w-4 h-4" />
                Добави блокиране
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-2">
        {blockedSlots.length === 0 ? (
          <p className="text-white/20 text-sm text-center py-6">
            Няма блокирани часове. Всички бръснари са налични.
          </p>
        ) : (
          blockedSlots.map((slot) => {
            const barber = barbers.find((b) => b.id === slot.barberId);
            return (
              <motion.div
                key={slot.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-between p-3 rounded-xl bg-surface-light border border-white/[0.06]"
              >
                <div className="flex items-center gap-4 text-sm flex-wrap">
                  <Badge variant="red">{barber?.name}</Badge>
                  <div className="flex items-center gap-2 text-white/50">
                    <Calendar className="w-4 h-4" />
                    <span>{slot.blockedDate}</span>
                  </div>
                  {slot.startTime && slot.endTime ? (
                    <div className="flex items-center gap-2 text-white/50">
                      <Clock className="w-4 h-4" />
                      <span>{slot.startTime} - {slot.endTime}</span>
                    </div>
                  ) : (
                    <Badge variant="gray">Цял ден</Badge>
                  )}
                  {slot.reason && <span className="text-white/30">{slot.reason}</span>}
                </div>
                <button
                  onClick={() => onRemoveBlock(slot.id)}
                  className="p-2 rounded-lg text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
