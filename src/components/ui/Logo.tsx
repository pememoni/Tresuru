export function LogoMark({ size = 32, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="32" height="32" rx="10" fill="url(#logo-gradient)" />
      <path
        d="M9 12.5C9 11.1193 10.1193 10 11.5 10H20.5C21.8807 10 23 11.1193 23 12.5V13.5H9V12.5Z"
        fill="white"
        fillOpacity="0.9"
      />
      <rect x="11" y="15.5" width="10" height="2.5" rx="1.25" fill="white" fillOpacity="0.6" />
      <rect x="11" y="20" width="6.5" height="2.5" rx="1.25" fill="white" fillOpacity="0.35" />
      <defs>
        <linearGradient id="logo-gradient" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#818CF8" />
          <stop offset="1" stopColor="#6366F1" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function LogoFull({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <LogoMark size={28} />
      <span className="text-sm font-semibold text-white tracking-tight">Tresuru</span>
    </div>
  );
}
