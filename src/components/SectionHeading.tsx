import type { ReactNode } from 'react';

export default function SectionHeading({ eyebrow, title, children, light = false, align = 'left' }: {
  eyebrow: string;
  title: string;
  children?: ReactNode;
  light?: boolean;
  align?: 'left' | 'center';
}) {
  return (
    <div className={`${align === 'center' ? 'mx-auto text-center' : ''} max-w-3xl`}>
      <p className={`text-xs font-bold uppercase tracking-[.24em] ${light ? 'text-brand-gold' : 'text-brand-gold-dark'}`}>{eyebrow}</p>
      <h2 className={`mt-4 font-serif text-4xl leading-[1.05] sm:text-5xl lg:text-6xl ${light ? 'text-white' : 'text-brand-dark'}`}>{title}</h2>
      {children && <div className={`mt-5 text-base leading-relaxed sm:text-lg ${light ? 'text-brand-clay' : 'text-brand-dark-light'}`}>{children}</div>}
    </div>
  );
}
