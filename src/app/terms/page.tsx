'use client';

import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto section-padding py-24">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-white/50 hover:text-lime transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Назад към начало</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="heading-xl text-4xl sm:text-5xl mb-8">
            ОБЩИ <span className="text-lime">УСЛОВИЯ</span>
          </h1>

          <div className="space-y-8 text-white/60 leading-relaxed">
            <section>
              <h2 className="font-heading font-bold text-xl text-white mb-4">
                1. Общи разпоредби
              </h2>
              <p>
                Настоящите общи условия регулират ползването на услугите на SNNAKE Barbershop, 
                разположен на адрес: Център, ул. „Екзарх Йосиф" 11, 8260 Царево. Използвайки 
                нашите услуги и/или резервационна система, вие се съгласявате с тези условия.
              </p>
            </section>

            <section>
              <h2 className="font-heading font-bold text-xl text-white mb-4">
                2. Резервации
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-heading font-semibold text-white/80 mb-2">2.1. Правене на резервация</h3>
                  <p>
                    Резервации могат да се правят онлайн чрез нашия уебсайт или по телефон. 
                    При резервация е необходимо да предоставите точна информация (име, телефон).
                  </p>
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-white/80 mb-2">2.2. Потвърждение</h3>
                  <p>
                    Всяка резервация се счита за потвърдена след получаване на потвърдително съобщение 
                    от нас. Запазваме си правото да откажем резервация при липса на свободни часове.
                  </p>
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-white/80 mb-2">2.3. Закъснения</h3>
                  <p>
                    Моля, пристигайте навреме за вашата резервация. При закъснение над 15 минути 
                    без предварително уведомление, запазваме си правото да анулираме резервацията.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="font-heading font-bold text-xl text-white mb-4">
                3. Отмяна и промяна на резервация
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-heading font-semibold text-white/80 mb-2">3.1. Отмяна от клиент</h3>
                  <p>
                    Можете да отмените или промените вашата резервация най-малко 24 часа предварително. 
                    За отмяна, моля свържете се с нас по телефон или чрез резервационната система.
                  </p>
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-white/80 mb-2">3.2. Отмяна от салона</h3>
                  <p>
                    В редки случаи може да се наложи да отменим или пренасрочим вашата резервация 
                    (напр. при болест на бръснаря, извънредни обстоятелства). Ще ви уведомим 
                    възможно най-бързо и ще ви предложим алтернативен час.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="font-heading font-bold text-xl text-white mb-4">
                4. Цени и плащане
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-heading font-semibold text-white/80 mb-2">4.1. Ценообразуване</h3>
                  <p>
                    Всички цени са посочени в български левове (BGN) и включват ДДС. Запазваме си 
                    правото да променяме цените без предварително уведомление, но промените няма 
                    да засегнат вече направени резервации.
                  </p>
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-white/80 mb-2">4.2. Начини на плащане</h3>
                  <p>
                    Плащането се извършва в салона след приключване на услугата. Приемаме кеш и 
                    банкови карти.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="font-heading font-bold text-xl text-white mb-4">
                5. Поведение в салона
              </h2>
              <p>
                Очакваме от всички клиенти да се държат с уважение към персонала и другите клиенти. 
                Запазваме си правото да откажем обслужване на клиенти, които проявяват неподходящо 
                поведение.
              </p>
            </section>

            <section>
              <h2 className="font-heading font-bold text-xl text-white mb-4">
                6. Качество на услугите
              </h2>
              <p>
                Ние полагаме всички усилия да предоставим висококачествени услуги. Ако не сте 
                доволни от резултата, моля уведомете ни веднага, за да можем да коригираме 
                проблема. Рекламации се приемат в рамките на 24 часа след извършване на услугата.
              </p>
            </section>

            <section>
              <h2 className="font-heading font-bold text-xl text-white mb-4">
                7. Отговорност
              </h2>
              <p>
                SNNAKE Barbershop не носи отговорност за:
              </p>
              <ul className="list-disc list-inside mt-3 space-y-2 ml-4">
                <li>Алергични реакции към използваните продукти (моля, информирайте ни предварително за алергии)</li>
                <li>Лични вещи, оставени в салона</li>
                <li>Резултати, които не отговарят на нереалистични очаквания</li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading font-bold text-xl text-white mb-4">
                8. Работно време
              </h2>
              <p>
                SNNAKE Barbershop работи от понеделник до събота, 9:00 - 20:00 часа. 
                В неделя и официални празници сме затворени. Работното време може да се променя 
                по време на празници - следете обявите ни.
              </p>
            </section>

            <section>
              <h2 className="font-heading font-bold text-xl text-white mb-4">
                9. Промени в условията
              </h2>
              <p>
                SNNAKE Barbershop си запазва правото да променя тези общи условия по всяко време. 
                Актуалната версия винаги е достъпна на нашия уебсайт.
              </p>
            </section>

            <section>
              <h2 className="font-heading font-bold text-xl text-white mb-4">
                10. Контакт
              </h2>
              <p>
                За въпроси относно тези общи условия или нашите услуги, моля свържете се с нас:
              </p>
              <div className="mt-3 space-y-1">
                <p>SNNAKE Barbershop</p>
                <p>Адрес: Център, ул. „Екзарх Йосиф" 11, 8260 Царево</p>
              </div>
            </section>

            <div className="pt-8 border-t border-white/[0.06]">
              <p className="text-white/30 text-sm">
                Последна актуализация: {new Date().toLocaleDateString('bg-BG', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
