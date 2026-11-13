import { useState } from 'react';

import { getCoverColor, getGlassSwatch, useDoorData } from '@/entities/door-catalog';
import { cn } from '@/shared/lib/utils';

import {
  buildFacadeGeometry,
  type Box,
  type DoorSetup,
  type FacadeView,
} from '@calculation/door-kit';
import type { SwingResult } from '@calculation/swing';

const VIEWS: { id: FacadeView; title: string }[] = [
  { id: 'outside', title: 'Снаружи' },
  { id: 'inside', title: 'Изнутри' },
];

const PAD = 260;
const DIM = '#0284c7';

type DoorFacadeProps = { setup: DoorSetup; result: SwingResult; className?: string };

/** Размерная линия (мм), подпись по центру */
function Dim({
  from,
  to,
  at,
  vertical,
  label,
}: {
  from: number;
  to: number;
  at: number;
  vertical?: boolean;
  label: string;
}) {
  const mid = (from + to) / 2;
  const tick = 18;
  return vertical ? (
    <g stroke={DIM} strokeWidth={2} fill={DIM}>
      <line x1={at} y1={from} x2={at} y2={to} />
      <line x1={at - tick} y1={from} x2={at + tick} y2={from} />
      <line x1={at - tick} y1={to} x2={at + tick} y2={to} />
      <text
        x={at - 14}
        y={mid}
        fontSize={44}
        stroke="#ffffff"
        strokeWidth={10}
        paintOrder="stroke"
        textAnchor="middle"
        transform={`rotate(-90 ${at - 14} ${mid})`}
      >
        {label}
      </text>
    </g>
  ) : (
    <g stroke={DIM} strokeWidth={2} fill={DIM}>
      <line x1={from} y1={at} x2={to} y2={at} />
      <line x1={from} y1={at - tick} x2={from} y2={at + tick} />
      <line x1={to} y1={at - tick} x2={to} y2={at + tick} />
      <text x={mid} y={at - 14} fontSize={44} stroke="#ffffff" strokeWidth={10} paintOrder="stroke" textAnchor="middle">
        {label}
      </text>
    </g>
  );
}

/** Фасад двери: проём, короб, полотно, стекло, петли, ручка и размеры; вид снаружи/изнутри */
export function DoorFacade({ setup, result, className }: DoorFacadeProps) {
  const data = useDoorData();
  const [view, setView] = useState<FacadeView>('outside');
  const g = buildFacadeGeometry(setup, result.sizes, result.hingeCount, view);
  const W = g.opening.width;
  const H = g.opening.height;
  // SVG: Y вниз, геометрия — Y вверх от пола
  const flip = (b: Box) => ({
    x: b.x,
    y: H - b.y - b.height,
    width: b.width,
    height: b.height,
  });
  const frameColor = getCoverColor(data.price(setup.frameCoverSku)?.name ?? '');
  const leafColor = getCoverColor(data.price(setup.doorCoverSku)?.name ?? '');
  const side = view === 'outside' ? 'front' : 'back';
  const insert = setup.inserts[side] ?? setup.inserts.front;
  const glass = insert ? getGlassSwatch(data.price(insert.sku)) : null;
  const leaf = g.leaf;

  return (
    <div className={cn('calc:relative calc:flex calc:min-h-0 calc:flex-col', className)}>
      <div className="calc:absolute calc:top-2 calc:left-2 calc:z-10 calc:flex calc:gap-1 calc:rounded-xl calc:bg-background/80 calc:p-0.5 calc:backdrop-blur">
        {VIEWS.map((v) => (
          <button
            key={v.id}
            type="button"
            aria-pressed={view === v.id}
            onClick={() => {
              setView(v.id);
            }}
            className={cn(
              'calc:cursor-pointer calc:rounded-lg calc:px-2 calc:py-0.5 calc:text-xs calc:text-muted-foreground calc:hover:bg-muted',
              view === v.id && 'calc:bg-primary/10 calc:font-medium calc:text-primary'
            )}
          >
            {v.title}
          </button>
        ))}
      </div>
      <svg
        role="img"
        aria-label="Фасад двери"
        viewBox={`${-PAD} ${-PAD / 2} ${W + PAD * 1.6} ${H + PAD * 1.3}`}
        className="calc:size-full calc:min-h-0 calc:flex-1"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <pattern
            id="wall-hatch"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
          >
            <line x1="0" y1="0" x2="0" y2="40" stroke="#cbd5e1" strokeWidth="6" />
          </pattern>
        </defs>
        {/* Стена вокруг проёма */}
        <path
          d={`M ${-PAD * 0.6} ${-PAD * 0.3} H ${W + PAD * 0.6} V ${H} H ${W} V 0 H 0 V ${H} H ${-PAD * 0.6} Z`}
          fill="url(#wall-hatch)"
          stroke="#94a3b8"
          strokeWidth={3}
        />
        <line
          x1={-PAD * 0.8}
          y1={H}
          x2={W + PAD * 0.8}
          y2={H}
          stroke="#334155"
          strokeWidth={5}
        />

        {g.frameBars.map((bar, i) => (
          <rect
            key={i}
            {...flip(bar)}
            fill={frameColor}
            stroke="#0f172a"
            strokeWidth={2}
          />
        ))}

        {leaf ? (
          <g>
            <rect {...flip(leaf)} fill={leafColor} stroke="#0f172a" strokeWidth={3} />
            <rect
              {...flip(leaf.inner)}
              fill={glass ? glass.color : '#eef2f5'}
              fillOpacity={glass?.pattern === 'clear' ? 0.55 : 1}
              stroke="#0f172a"
              strokeWidth={1.5}
            />
            {(() => {
              const b = flip(leaf);
              const hx = leaf.hingeSide === 'right' ? b.x + b.width : b.x;
              const ax = leaf.hingeSide === 'right' ? b.x : b.x + b.width;
              return (
                <polyline
                  points={`${hx},${b.y} ${ax},${b.y + b.height / 2} ${hx},${b.y + b.height}`}
                  fill="none"
                  stroke="#475569"
                  strokeWidth={2.5}
                  strokeDasharray={leaf.isAway ? '24 16' : undefined}
                />
              );
            })()}
            {leaf.hinges.map((h, i) => (
              <rect key={i} {...flip(h)} rx={4} fill="#b45309" />
            ))}
            {leaf.handle ? <rect {...flip(leaf.handle)} rx={8} fill="#1f2937" /> : null}
          </g>
        ) : null}

        <Dim from={0} to={W} at={H + 110} label={`${W}`} />
        <Dim from={0} to={H} at={-110} vertical label={`${H}`} />
        {g.frame ? (
          <>
            <Dim
              from={g.frame.x}
              to={g.frame.x + g.frame.width}
              at={-60}
              label={`${g.frame.width}`}
            />
            <Dim
              from={H - g.frame.height}
              to={H}
              at={W + 90}
              vertical
              label={`${g.frame.height}`}
            />
          </>
        ) : null}
        {leaf ? (
          <>
            <Dim
              from={leaf.x}
              to={leaf.x + leaf.width}
              at={H - leaf.y - leaf.height / 2 + 200}
              label={`${leaf.width}`}
            />
            <Dim
              from={H - leaf.y - leaf.height}
              to={H - leaf.y}
              at={leaf.x + leaf.width / 2 + 140}
              vertical
              label={`${leaf.height}`}
            />
          </>
        ) : null}
      </svg>
      <p className="calc:px-3 calc:pb-2 calc:text-xs calc:text-muted-foreground">
        Проём {W}×{H} · короб {g.frame ? `${g.frame.width}×${g.frame.height}` : 'нет'} ·
        полотно {leaf ? `${leaf.width}×${leaf.height}` : 'нет'} · петель{' '}
        {result.hingeCount}. Штрих — открывание от зрителя.
      </p>
    </div>
  );
}
