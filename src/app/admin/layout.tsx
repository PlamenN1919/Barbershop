import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Админ панел | SNNAKE Barbershop',
  description: 'Управление на резервации и наличност',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
