'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { BookingFormData, BookingStep, Barber } from '@/lib/types';
import { apiCreateAppointment, apiGetBarbers, APIError } from '@/lib/api';
import { DuplicateCheckResult } from '@/lib/antiSpam';
import StepIndicator from '@/components/ui/StepIndicator';
import SelectService from './SelectService';
import SelectBarber from './SelectBarber';
import SelectDateTime from './SelectDateTime';
import CustomerDetails from './CustomerDetails';
import Confirmation from './Confirmation';
import DuplicateWarning from './DuplicateWarning';

const bookingSchema = z.object({
  serviceIds: z.array(z.string()).min(1, 'Моля, изберете поне една услуга'),
  barberId: z.string().min(1, 'Моля, изберете бръснар'),
  date: z.string().min(1, 'Моля, изберете дата'),
  time: z.string().min(1, 'Моля, изберете час'),
  customerName: z.string().min(2, 'Името трябва да е поне 2 символа'),
  customerPhone: z
    .string()
    .min(7, 'Моля, въведете валиден телефонен номер')
    .regex(/^[+]?[\d\s()-]+$/, 'Моля, въведете валиден телефонен номер'),
});

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 100 : -100,
    opacity: 0,
  }),
};

export default function BookingForm() {
  const [step, setStep] = useState<BookingStep>(1);
  const [direction, setDirection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [showDuplicateWarning, setShowDuplicateWarning] = useState(false);
  const [duplicateCheckResult, setDuplicateCheckResult] = useState<DuplicateCheckResult | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [barbers, setBarbers] = useState<Barber[]>([]);

  useEffect(() => {
    apiGetBarbers().then(setBarbers).catch(() => {});
  }, []);

  const {
    register,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      serviceIds: [],
      barberId: '',
      date: '',
      time: '',
      customerName: '',
      customerPhone: '',
    },
    mode: 'onChange',
  });

  const formData = watch();

  const goNext = () => {
    setDirection(1);
    setStep((prev) => Math.min(prev + 1, 5) as BookingStep);
  };

  const goBack = () => {
    setDirection(-1);
    setStep((prev) => Math.max(prev - 1, 1) as BookingStep);
  };

  const handleNextStep4 = async () => {
    const valid = await trigger(['customerName', 'customerPhone']);
    if (valid) goNext();
  };

  const handleConfirm = async () => {
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const result = await apiCreateAppointment(formData);

      // Ако имаме предупреждения, може да покажем duplicate warning
      if (result.isDuplicate || result.isSuspicious) {
        setDuplicateCheckResult({
          isDuplicate: result.isDuplicate,
          isSuspicious: result.isSuspicious,
          existingBookings: [],
          warnings: result.warnings,
        });
        // Но резервацията вече е създадена от сървъра, просто информираме
      }

      setIsSubmitting(false);
      setIsConfirmed(true);
    } catch (err) {
      setIsSubmitting(false);
      if (err instanceof APIError) {
        if (err.status === 429) {
          alert(
            '⛔ Достигнахте максималния брой резервации.\n\n' +
            'Моля, свържете се с нас директно на +359 88 812 3456.'
          );
        } else if (err.status === 409) {
          alert('⚠️ Този час вече е зает. Моля, изберете друг час.');
          setStep(3);
        } else {
          setSubmitError(err.message);
        }
      } else {
        setSubmitError('Възникна неочаквана грешка. Моля, опитайте отново.');
      }
    }
  };

  const handleConfirmDuplicate = async () => {
    setShowDuplicateWarning(false);
    // No-op, booking already created
  };

  const handleCancelDuplicate = () => {
    setShowDuplicateWarning(false);
    setDuplicateCheckResult(null);
  };

  return (
    <>
      <div className="glass-card p-6 sm:p-8">
        {!isConfirmed && <StepIndicator currentStep={step} totalSteps={5} />}

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            {step === 1 && (
              <SelectService
                selectedIds={formData.serviceIds}
                onToggle={(id) => {
                  const current = formData.serviceIds;
                  const next = current.includes(id)
                    ? current.filter((s) => s !== id)
                    : [...current, id];
                  setValue('serviceIds', next);
                }}
                onNext={goNext}
              />
            )}

            {step === 2 && (
              <SelectBarber
                selectedId={formData.barberId}
                onSelect={(id) => setValue('barberId', id)}
                onNext={goNext}
                onBack={goBack}
              />
            )}

            {step === 3 && (
              <SelectDateTime
                selectedDate={formData.date}
                selectedTime={formData.time}
                barberId={formData.barberId}
                onSelectDate={(date) => setValue('date', date)}
                onSelectTime={(time) => setValue('time', time)}
                onNext={goNext}
                onBack={goBack}
              />
            )}

            {step === 4 && (
              <CustomerDetails
                register={register}
                errors={errors}
                onNext={handleNextStep4}
                onBack={goBack}
                isValid={
                  !!formData.customerName &&
                  !!formData.customerPhone &&
                  !errors.customerName &&
                  !errors.customerPhone
                }
              />
            )}

            {step === 5 && (
              <Confirmation
                formData={formData}
                barberName={barbers.find((b) => b.id === formData.barberId)?.name || ''}
                onBack={goBack}
                onConfirm={handleConfirm}
                isSubmitting={isSubmitting}
                isConfirmed={isConfirmed}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Duplicate Warning Modal */}
      <AnimatePresence>
        {showDuplicateWarning && duplicateCheckResult && (
          <DuplicateWarning
            result={duplicateCheckResult}
            onConfirm={handleConfirmDuplicate}
            onCancel={handleCancelDuplicate}
            isLoading={isSubmitting}
          />
        )}
      </AnimatePresence>
    </>
  );
}
