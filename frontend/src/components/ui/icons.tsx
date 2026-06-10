type IconProps = {
  className?: string;
  strokeWidth?: number;
};

const base = (className = 'h-5 w-5', strokeWidth = 1.8) => ({ className, strokeWidth });

export const MenuIcon = ({ className, strokeWidth }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth ?? 1.8} className={className ?? 'h-5 w-5'} aria-hidden="true">
    <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
  </svg>
);

export const CloseIcon = ({ className, strokeWidth }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth ?? 1.8} className={className ?? 'h-5 w-5'} aria-hidden="true">
    <path d="M6 6l12 12M18 6l-12 12" strokeLinecap="round" />
  </svg>
);

export const SearchIcon = ({ className, strokeWidth }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth ?? 1.8} className={className ?? 'h-5 w-5'} aria-hidden="true">
    <circle cx="11" cy="11" r="6.5" />
    <path d="M16.2 16.2L21 21" strokeLinecap="round" />
  </svg>
);

export const HomeIcon = ({ className, strokeWidth }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth ?? 1.8} className={className ?? 'h-5 w-5'} aria-hidden="true">
    <path d="M4 11.5L12 4l8 7.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6.5 10.5V20h11V10.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const StoreIcon = ({ className, strokeWidth }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth ?? 1.8} className={className ?? 'h-5 w-5'} aria-hidden="true">
    <path d="M4 9h16l-1.2-4H5.2L4 9Z" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6 9v10h12V9" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9 13h6" strokeLinecap="round" />
  </svg>
);

export const HeartIcon = ({ className, strokeWidth }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth ?? 1.8} className={className ?? 'h-5 w-5'} aria-hidden="true">
    <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10Z" strokeLinejoin="round" />
  </svg>
);

export const BagIcon = ({ className, strokeWidth }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth ?? 1.8} className={className ?? 'h-5 w-5'} aria-hidden="true">
    <path d="M6 8h12l-1 12H7L6 8Z" strokeLinejoin="round" />
    <path d="M9 8a3 3 0 0 1 6 0" strokeLinecap="round" />
  </svg>
);

export const UserIcon = ({ className, strokeWidth }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth ?? 1.8} className={className ?? 'h-5 w-5'} aria-hidden="true">
    <circle cx="12" cy="8" r="3.2" />
    <path d="M5.5 20c1.5-3.8 5-5.7 6.5-5.7S17 16.2 18.5 20" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const FilterIcon = ({ className, strokeWidth }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth ?? 1.8} className={className ?? 'h-5 w-5'} aria-hidden="true">
    <path d="M4 6h16M7 12h10M10 18h4" strokeLinecap="round" />
  </svg>
);

export const SlidersIcon = ({ className, strokeWidth }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth ?? 1.8} className={className ?? 'h-5 w-5'} aria-hidden="true">
    <path d="M6 4v8M6 16v4M12 4v4M12 12v8M18 4v12M18 20v0" strokeLinecap="round" />
    <circle cx="6" cy="14" r="1.8" fill="currentColor" stroke="none" />
    <circle cx="12" cy="10" r="1.8" fill="currentColor" stroke="none" />
    <circle cx="18" cy="18" r="1.8" fill="currentColor" stroke="none" />
  </svg>
);

export const StarIcon = ({ className, strokeWidth = 1.8 }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className ?? 'h-5 w-5'} aria-hidden="true">
    <path d="M12 2.8 14.9 9l6.8.6-5.1 4.4 1.6 6.7L12 16.9 5.8 20.7l1.6-6.7-5.1-4.4L9.1 9 12 2.8Z" />
  </svg>
);

export const PlusIcon = ({ className, strokeWidth }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth ?? 1.8} className={className ?? 'h-5 w-5'} aria-hidden="true">
    <path d="M12 5v14M5 12h14" strokeLinecap="round" />
  </svg>
);

export const MinusIcon = ({ className, strokeWidth }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth ?? 1.8} className={className ?? 'h-5 w-5'} aria-hidden="true">
    <path d="M5 12h14" strokeLinecap="round" />
  </svg>
);

export const ChevronLeftIcon = ({ className, strokeWidth }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth ?? 1.8} className={className ?? 'h-5 w-5'} aria-hidden="true">
    <path d="M14.5 5.5 8 12l6.5 6.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ChevronRightIcon = ({ className, strokeWidth }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth ?? 1.8} className={className ?? 'h-5 w-5'} aria-hidden="true">
    <path d="M9.5 5.5 16 12l-6.5 6.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const MapPinIcon = ({ className, strokeWidth }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth ?? 1.8} className={className ?? 'h-5 w-5'} aria-hidden="true">
    <path d="M12 21s5.5-5.5 5.5-10.2A5.5 5.5 0 0 0 12 5.3a5.5 5.5 0 0 0-5.5 5.5C6.5 15.5 12 21 12 21Z" strokeLinejoin="round" />
    <circle cx="12" cy="10.7" r="1.8" />
  </svg>
);

export const TruckIcon = ({ className, strokeWidth }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth ?? 1.8} className={className ?? 'h-5 w-5'} aria-hidden="true">
    <path d="M3 7h11v10H3z" strokeLinejoin="round" />
    <path d="M14 10h4l3 3v4h-2.5" strokeLinejoin="round" />
    <circle cx="7" cy="18" r="1.8" />
    <circle cx="18" cy="18" r="1.8" />
  </svg>
);

export const BoxIcon = ({ className, strokeWidth }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth ?? 1.8} className={className ?? 'h-5 w-5'} aria-hidden="true">
    <path d="M4.5 8.5 12 4l7.5 4.5v8L12 21l-7.5-4.5v-8Z" strokeLinejoin="round" />
    <path d="M12 4v17" strokeLinecap="round" />
    <path d="M4.5 8.5 12 13l7.5-4.5" strokeLinejoin="round" />
  </svg>
);

export const CheckIcon = ({ className, strokeWidth }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth ?? 1.8} className={className ?? 'h-5 w-5'} aria-hidden="true">
    <path d="M5.5 12.5 10 17l8.5-10" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ClockIcon = ({ className, strokeWidth }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth ?? 1.8} className={className ?? 'h-5 w-5'} aria-hidden="true">
    <circle cx="12" cy="12" r="8" />
    <path d="M12 8v4l3 2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ArrowRightIcon = ({ className, strokeWidth }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth ?? 1.8} className={className ?? 'h-5 w-5'} aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ShieldIcon = ({ className, strokeWidth }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth ?? 1.8} className={className ?? 'h-5 w-5'} aria-hidden="true">
    <path d="M12 3 19 6v5c0 4.5-2.8 7.8-7 10-4.2-2.2-7-5.5-7-10V6l7-3Z" strokeLinejoin="round" />
    <path d="M9.2 12.1 11 14l3.8-4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ZoomIcon = ({ className, strokeWidth }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth ?? 1.8} className={className ?? 'h-5 w-5'} aria-hidden="true">
    <circle cx="10.5" cy="10.5" r="6.5" />
    <path d="M15.5 15.5 21 21" strokeLinecap="round" />
    <path d="M10.5 7.5v6M7.5 10.5h6" strokeLinecap="round" />
  </svg>
);
