export default function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
        <path
          d="M9 5c6 0 11 4.8 11 11s-5 11-11 11"
          stroke="url(#g)"
          strokeWidth="2.4"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="9" cy="5" r="1.6" fill="#ff5c8a" />
        {[0, 1, 2].map((i) => (
          <line
            key={i}
            x1={13 + i * 3.4}
            y1={10}
            x2={13 + i * 3.4}
            y2={22}
            stroke="url(#g)"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        ))}
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="32" y2="32">
            <stop offset="0%" stopColor="#ff5c8a" />
            <stop offset="100%" stopColor="#e11d5e" />
          </linearGradient>
        </defs>
      </svg>
      {!compact && (
        <span className="font-display text-lg tracking-wordmark text-ivory">LYREON</span>
      )}
    </div>
  );
}
