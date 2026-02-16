'use client';

import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPage() {
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
            ПОЛИТИКА ЗА <span className="text-lime">ПОВЕРИТЕЛНОСТ</span>
          </h1>

          <div className="space-y-8 text-white/60 leading-relaxed">
            <section>
              <h2 className="font-heading font-bold text-xl text-white mb-4">
                1. Събиране на информация
              </h2>
              <p>
                SNNAKE Barbershop събира лична информация само когато вие доброволно я предоставите при 
                резервация на час. Събираната информация включва:
              </p>
              <ul className="list-disc list-inside mt-3 space-y-2 ml-4">
                <li>Име и фамилия</li>
                <li>Телефонен номер</li>
                <li>Предпочитана дата и час за резервация</li>
                <li>Избрана услуга и бръснар</li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading font-bold text-xl text-white mb-4">
                2. Използване на информацията
              </h2>
              <p>Вашата лична информация се използва единствено за:</p>
              <ul className="list-disc list-inside mt-3 space-y-2 ml-4">
                <li>Потвърждаване и управление на вашите резервации</li>
                <li>Свързване с вас при необходимост относно вашия час</li>
                <li>Подобряване на качеството на нашите услуги</li>
                <li>Изпращане на напомняния за предстоящи часове (ако сте дали съгласие)</li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading font-bold text-xl text-white mb-4">
                3. Защита на данните
              </h2>
              <p>
                Ние предприемаме всички необходими технически и организационни мерки за защита на вашите 
                лични данни от неоторизиран достъп, загуба или злоупотреба. Вашата информация се съхранява 
                сигурно и се обработва в съответствие с приложимото законодателство.
              </p>
            </section>

            <section>
              <h2 className="font-heading font-bold text-xl text-white mb-4">
                4. Споделяне на информация
              </h2>
              <p>
                SNNAKE Barbershop не продава, не обменя и не предоставя вашата лична информация на трети 
                страни, освен ако не е необходимо за предоставяне на услугата или не е изискано от закона.
              </p>
            </section>

            <section>
              <h2 className="font-heading font-bold text-xl text-white mb-4">
                5. Вашите права
              </h2>
              <p>Вие имате право да:</p>
              <ul className="list-disc list-inside mt-3 space-y-2 ml-4">
                <li>Поискате достъп до вашите лични данни</li>
                <li>Поискате корекция на неточни данни</li>
                <li>Поискате изтриване на вашите данни</li>
                <li>Оттеглите съгласието си за обработка на данни по всяко време</li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading font-bold text-xl text-white mb-4">
                6. Бисквитки (Cookies)
              </h2>
              <p>
                Нашият уебсайт може да използва бисквитки за подобряване на потребителското изживяване. 
                Бисквитките са малки текстови файлове, които се съхраняват на вашето устройство. Можете 
                да настроите браузъра си да отказва бисквитки, но това може да ограничи функционалността 
                на сайта.
              </p>
            </section>

            <section>
              <h2 className="font-heading font-bold text-xl text-white mb-4">
                7. Промени в политиката
              </h2>
              <p>
                SNNAKE Barbershop си запазва правото да актуализира тази политика за поверителност. 
                Всички промени ще бъдат публикувани на тази страница с актуализирана дата.
              </p>
            </section>

            <section>
              <h2 className="font-heading font-bold text-xl text-white mb-4">
                8. Контакт
              </h2>
              <p>
                Ако имате въпроси относно нашата политика за поверителност или желаете да упражните 
                вашите права, моля свържете се с нас:
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
