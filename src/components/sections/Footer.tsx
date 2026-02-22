'use client';

import { Scissors, Instagram, Phone } from 'lucide-react';

const footerLinks = [
  {
    title: 'Бързи връзки',
    links: [
      { label: 'Услуги', href: '#services' },
      { label: 'Отзиви', href: '#gallery' },
      { label: 'Цени', href: '#pricing' },
      { label: 'Запази час', href: '#booking' },
    ],
  },
  {
    title: 'Информация',
    links: [
      { label: 'Политика за поверителност', href: '/privacy' },
      { label: 'Общи условия', href: '/terms' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="section-padding py-16 border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 mb-16">
          {/* Бранд */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-lime flex items-center justify-center">
                <Scissors className="w-4 h-4 text-background" />
              </div>
              <span className="font-heading font-bold text-base uppercase tracking-wider">
                SNNAKE Barbershop
              </span>
            </div>
            <p className="text-white/30 text-sm leading-relaxed max-w-xs">
              Премиум бръснарско изживяване в Царево.
              Отворено всеки ден, 10:00 &ndash; 20:00 ч.
            </p>
            <p className="text-white/20 text-sm mt-3">
              Център, ул. „Екзарх Йосиф" 11, 8260 Царево
            </p>
            <a 
              href="tel:0886731212" 
              className="flex items-center gap-2 text-white/30 hover:text-lime transition-colors text-sm mt-3 w-fit"
            >
              <Phone className="w-4 h-4" />
              <span>088 673 1212</span>
            </a>
          </div>

          {/* Линкове */}
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h4 className="font-heading font-bold text-sm uppercase tracking-wider mb-4 text-white/60">
                {group.title}
              </h4>
              <ul className="space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-white/30 hover:text-lime transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Долна лента */}
        <div className="divider mb-6" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/15 text-xs">
            &copy; {new Date().getFullYear()} SNNAKE Barbershop. Всички права запазени.
          </p>
          <a
            href="https://www.instagram.com/plamen_nikolovv/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-white/15 text-xs hover:text-lime transition-colors"
          >
            <span>Made by @plamen_nikolovv</span>
            <Instagram className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
