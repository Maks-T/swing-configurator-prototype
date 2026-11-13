import type { OpenSide } from '@calculation/door-kit';

/** Условное обозначение открывания в плане: стена, полотно и дуга */
export function OpenSideGlyph({ side }: { side: OpenSide }) {
  const isRight = side.startsWith('right');
  const isOutside = side.endsWith('outside');
  const hx = isRight ? 30 : 6;
  const tip = isRight ? 6 : 30;
  const leafY = isOutside ? 24 : 4;
  const sweep = isRight === isOutside ? 1 : 0;
  return (
    <svg viewBox="0 0 36 28" className="calc:h-7 calc:w-9 calc:shrink-0" aria-hidden>
      <line x1="0" y1="14" x2="6" y2="14" stroke="currentColor" strokeWidth="3" />
      <line x1="30" y1="14" x2="36" y2="14" stroke="currentColor" strokeWidth="3" />
      <line
        x1={hx}
        y1="14"
        x2={hx}
        y2={leafY}
        stroke="var(--primary)"
        strokeWidth="2.5"
      />
      <path
        d={`M ${hx} ${leafY} A 24 24 0 0 ${sweep} ${tip} 14`}
        fill="none"
        stroke="currentColor"
        strokeDasharray="2 2"
        strokeWidth="1"
      />
    </svg>
  );
}
