'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Mail, LogIn, Scissors } from 'lucide-react';
import Button from '@/components/ui/Button';

interface LoginFormProps {
  onLogin: (email: string, password: string) => Promise<void>;
}

export default function LoginForm({ onLogin }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await onLogin(email, password);
    } catch {
      setError('Невалидни данни за вход. Моля, опитайте отново.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-lime/10 border border-lime/20 mb-4">
            <Scissors className="w-8 h-8 text-lime" />
          </div>
          <h1 className="font-heading font-bold text-2xl uppercase">Админ панел</h1>
          <p className="text-white/40 text-sm mt-1">Влезте за да управлявате резервациите</p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card p-8 space-y-5">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="text-xs text-white/40 font-heading font-bold uppercase tracking-wider mb-2 block">Имейл</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@barbershop.com"
                required
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-surface-light border border-white/[0.06] text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-lime/40 focus:border-lime/40 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-white/40 font-heading font-bold uppercase tracking-wider mb-2 block">Парола</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Въведете парола"
                required
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-surface-light border border-white/[0.06] text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-lime/40 focus:border-lime/40 transition-all"
              />
            </div>
          </div>

          <Button type="submit" fullWidth disabled={loading}>
            {loading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full"
              />
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                Вход
              </>
            )}
          </Button>

          <p className="text-center text-white/20 text-xs mt-4">
            Демо: admin@barbershop.com / admin123
          </p>
        </form>
      </motion.div>
    </div>
  );
}
