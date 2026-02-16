import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SNNAKE Barbershop | Прецизни подстригвания. Премиум услуга.',
  description:
    'Предефинираме бръснарското изживяване. Прецизни подстригвания, експертни бръснари, премиум услуга. Запазете час за секунди.',
  keywords: ['бръснарница', 'подстригване', 'оформяне на брада', 'резервация', 'премиум', 'бръснар', 'Царево', 'SNNAKE'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bg" className="dark">
      <body className="min-h-screen bg-background overflow-x-hidden">{children}</body>
    </html>
  );
}
