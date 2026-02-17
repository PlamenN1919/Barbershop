'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, X, User, Camera, ImageIcon } from 'lucide-react';
import { Barber } from '@/lib/types';
import { fileToBase64, isValidPhotoUrl } from '@/lib/utils';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

interface BarberManagerProps {
  barbers: Barber[];
  onAdd: (data: Omit<Barber, 'id' | 'rating' | 'reviewCount'>) => void;
  onRemove: (id: string) => void;
}

const EMPTY_FORM = {
  name: '',
  specialty: '',
  photoUrl: '',
  isActive: true,
};

export default function BarberManager({ barbers, onAdd, onRemove }: BarberManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Проверка за тип
    if (!file.type.startsWith('image/')) {
      setFormError('Моля, изберете изображение (JPG, PNG, WEBP)');
      return;
    }

    // Проверка за размер (макс 5MB преди compress)
    if (file.size > 5 * 1024 * 1024) {
      setFormError('Снимката е твърде голяма (макс. 5MB)');
      return;
    }

    setIsUploading(true);
    setFormError('');

    try {
      const base64 = await fileToBase64(file, 300);
      setForm((f) => ({ ...f, photoUrl: base64 }));
    } catch {
      setFormError('Грешка при обработка на снимката');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = () => {
    if (!form.name.trim()) {
      setFormError('Въведете име на бръснаря');
      return;
    }

    onAdd({
      name: form.name.trim(),
      specialty: form.specialty.trim() || 'Бръснар',
      photoUrl: form.photoUrl || '',
      isActive: form.isActive,
    });

    setForm(EMPTY_FORM);
    setFormError('');
    setIsAdding(false);
    // Нулираме file input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemove = (id: string) => {
    onRemove(id);
    setConfirmDeleteId(null);
  };

  const inputCls =
    'w-full bg-surface-light border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-lime/40 transition-colors';

  return (
    <div className="space-y-6">
      {/* Хедър */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-heading font-bold text-lg uppercase text-white">Бръснари</h3>
          <p className="text-white/30 text-sm">
            {barbers.length} бръснар{barbers.length !== 1 ? 'и' : ''} в екипа
          </p>
        </div>
        <Button
          size="sm"
          variant={isAdding ? 'ghost' : 'primary'}
          onClick={() => {
            setIsAdding(!isAdding);
            setForm(EMPTY_FORM);
            setFormError('');
          }}
        >
          {isAdding ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {isAdding ? 'Отказ' : 'Добави бръснар'}
        </Button>
      </div>

      {/* Форма за добавяне */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="glass-card p-5 space-y-4">
              <h4 className="text-white font-heading font-bold text-sm uppercase tracking-wider">
                Нов бръснар
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Име */}
                <div>
                  <label className="text-white/30 text-[10px] font-heading uppercase tracking-wider mb-1 block">
                    Име
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="Иван Иванов"
                    className={inputCls}
                  />
                </div>
                {/* Специалност */}
                <div>
                  <label className="text-white/30 text-[10px] font-heading uppercase tracking-wider mb-1 block">
                    Специалност <span className="text-white/20">(по избор)</span>
                  </label>
                  <input
                    type="text"
                    value={form.specialty}
                    onChange={(e) => setForm((f) => ({ ...f, specialty: e.target.value }))}
                    placeholder="Фейдове и модерни прически"
                    className={inputCls}
                  />
                </div>
              </div>

              {/* Снимка */}
              <div>
                <label className="text-white/30 text-[10px] font-heading uppercase tracking-wider mb-2 block">
                  Снимка
                </label>
                <div className="flex items-center gap-4">
                  {/* Preview */}
                  <div className="w-16 h-16 rounded-full flex-shrink-0 overflow-hidden bg-surface-light border-2 border-dashed border-white/10 flex items-center justify-center">
                    {form.photoUrl ? (
                      <img
                        src={form.photoUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Camera className="w-6 h-6 text-white/15" />
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-light border border-white/[0.08] text-white/50 hover:text-white hover:border-lime/30 transition-colors text-sm"
                    >
                      <ImageIcon className="w-4 h-4" />
                      {isUploading ? 'Обработва се...' : form.photoUrl ? 'Смени снимката' : 'Качи снимка'}
                    </button>
                    {form.photoUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          setForm((f) => ({ ...f, photoUrl: '' }));
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        className="text-xs text-white/20 hover:text-red-400 transition-colors"
                      >
                        Премахни снимката
                      </button>
                    )}
                    <p className="text-white/15 text-[10px]">JPG, PNG или WEBP, макс. 5MB</p>
                  </div>
                </div>
              </div>

              {/* Активен */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                  className="w-4 h-4 rounded border-white/20 bg-surface text-lime focus:ring-lime/50 accent-lime"
                />
                <span className="text-sm text-white/50">Активен (видим при резервации)</span>
              </label>

              {/* Грешка */}
              {formError && <p className="text-red-400 text-xs font-heading">{formError}</p>}

              {/* Бутон */}
              <Button size="sm" variant="primary" onClick={handleSubmit}>
                <Plus className="w-3.5 h-3.5" />
                Добави
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Списък с бръснари */}
      <div className="space-y-3">
        <AnimatePresence>
          {barbers.map((barber) => (
            <motion.div
              key={barber.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass-card p-4"
            >
              <div className="flex items-center justify-between gap-4">
                {/* Инфо */}
                <div className="flex items-center gap-4 min-w-0">
                  <div
                    className={`w-12 h-12 rounded-full flex-shrink-0 overflow-hidden ${
                      barber.isActive ? 'ring-2 ring-lime/30' : 'ring-2 ring-white/10'
                    } ${!isValidPhotoUrl(barber.photoUrl) ? (barber.isActive ? 'bg-lime/10' : 'bg-surface-light') + ' flex items-center justify-center' : ''}`}
                  >
                    {isValidPhotoUrl(barber.photoUrl) ? (
                      <img
                        src={barber.photoUrl}
                        alt={barber.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User
                        className={`w-6 h-6 ${barber.isActive ? 'text-lime' : 'text-white/20'}`}
                      />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-white font-heading font-bold text-sm uppercase truncate">
                        {barber.name}
                      </span>
                      {barber.isActive ? (
                        <Badge variant="lime">Активен</Badge>
                      ) : (
                        <Badge variant="gray">Неактивен</Badge>
                      )}
                    </div>
                    <p className="text-white/40 text-xs mt-0.5">{barber.specialty}</p>
                  </div>
                </div>

                {/* Бутон за премахване */}
                <div className="flex-shrink-0">
                  {confirmDeleteId === barber.id ? (
                    <div className="flex items-center gap-2">
                      <span className="text-red-400 text-xs font-heading whitespace-nowrap">Сигурни ли сте?</span>
                      <Button size="sm" variant="danger" onClick={() => handleRemove(barber.id)}>
                        Да
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setConfirmDeleteId(null)}>
                        Не
                      </Button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDeleteId(barber.id)}
                      className="p-2.5 rounded-xl text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-all"
                      title="Премахни бръснар"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {barbers.length === 0 && (
          <div className="glass-card p-10 text-center">
            <User className="w-10 h-10 text-white/10 mx-auto mb-3" />
            <h4 className="text-white/30 font-heading font-bold uppercase text-sm mb-1">
              Няма бръснари
            </h4>
            <p className="text-white/15 text-xs">Добавете първия бръснар от бутона по-горе.</p>
          </div>
        )}
      </div>
    </div>
  );
}
