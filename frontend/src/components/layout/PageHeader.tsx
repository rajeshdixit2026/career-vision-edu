import type { ReactNode } from "react";

interface PageHeaderProps {
  badge: string;
  title: string;
  description: string;
  image?: string;
  children?: ReactNode;
}

/** Navy banner used at the top of every inner page. Clears the fixed header with pt-28/pt-32. */
export default function PageHeader({ badge, title, description, image, children }: PageHeaderProps) {
  return (
    <section className="relative overflow-hidden bg-navy text-white">
      {image && (
        <img
          src={image}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover opacity-25"
        />
      )}
      <div className="absolute inset-0 hero-scrim" />
      <div className="absolute inset-0 dot-grid" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-28 sm:px-6 md:pt-32 lg:px-8">
        <p className="inline-flex items-center rounded-full bg-gold px-3.5 py-1 text-xs font-bold text-navy">
          {badge}
        </p>
        <h1 className="mt-4 max-w-3xl font-heading text-3xl font-bold leading-tight md:text-4xl">
          {title}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/75 md:text-base">{description}</p>
        {children && <div className="mt-6">{children}</div>}
      </div>
    </section>
  );
}
