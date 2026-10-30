const SPINES = Array.from({ length: 36 }, (_, index) => {
  const angle = (index / 36) * Math.PI * 2;
  const long = index % 2 === 0;
  const inner = 15;
  const outer = long ? 46 : 36;
  return {
    id: index,
    x1: 50 + Math.cos(angle) * inner,
    y1: 50 + Math.sin(angle) * inner,
    x2: 50 + Math.cos(angle) * outer,
    y2: 50 + Math.sin(angle) * outer,
    long,
    delay: `${(index % 6) * 0.35}s`,
  };
});

export default function UrchinMark({ className = "h-16 w-16" }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <defs>
        <radialGradient id="urchin-body" cx="40%" cy="38%" r="70%">
          <stop offset="0%" stopColor="#c4b5fd" />
          <stop offset="55%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#2e1065" />
        </radialGradient>
      </defs>
      <g className="urchin-spin">
        {SPINES.map((spine) => (
          <line
            key={spine.id}
            x1={spine.x1}
            y1={spine.y1}
            x2={spine.x2}
            y2={spine.y2}
            stroke={spine.long ? "#a78bfa" : "#8b5cf6"}
            strokeWidth={spine.long ? 2.2 : 1.6}
            strokeLinecap="round"
            className="urchin-spine"
            style={{ animationDelay: spine.delay }}
          />
        ))}
      </g>
      <circle cx="50" cy="50" r="17" fill="url(#urchin-body)" />
      <circle cx="50" cy="50" r="4" fill="#ff9a2e" />
      {[0, 72, 144, 216, 288].map((deg) => (
        <ellipse
          key={deg}
          cx="50"
          cy="40"
          rx="1.6"
          ry="5"
          fill="#ffc785"
          opacity="0.75"
          transform={`rotate(${deg} 50 50)`}
        />
      ))}
    </svg>
  );
}
