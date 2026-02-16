interface BadgeProps {
  children: React.ReactNode;
  variant?: 'lime' | 'green' | 'red' | 'gray' | 'amber';
  className?: string;
  onClick?: () => void;
}

const badgeVariants = {
  lime: 'bg-lime/10 text-lime border-lime/20',
  green: 'bg-green-500/10 text-green-400 border-green-500/20',
  red: 'bg-red-500/10 text-red-400 border-red-500/20',
  gray: 'bg-white/5 text-white/50 border-white/10',
  amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
};

export default function Badge({ children, variant = 'lime', className = '', onClick }: BadgeProps) {
  const Component = onClick ? 'button' : 'span';
  return (
    <Component
      onClick={onClick}
      className={`
        inline-flex items-center px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border font-heading
        ${badgeVariants[variant]}
        ${onClick ? 'hover:opacity-80 transition-opacity' : ''}
        ${className}
      `}
    >
      {children}
    </Component>
  );
}
