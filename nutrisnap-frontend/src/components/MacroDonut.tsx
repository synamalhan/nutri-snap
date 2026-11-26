import React, { useState } from 'react';
import { NutritionTotal } from '../types';
import { MACROS } from '../nutrition';

const R = 52;
const STROKE = 16;
const C = 2 * Math.PI * R;
const GAP = 2; // surface gap between segments, in px of arc length

const MacroDonut: React.FC<{ total: NutritionTotal }> = ({ total }) => {
  const [hover, setHover] = useState<number | null>(null);
  const kcal = MACROS.map((m) => total[m.key] * m.kcalPerGram);
  const sum = kcal.reduce((a, b) => a + b, 0);
  const pct = kcal.map((k) => (sum ? (k / sum) * 100 : 0));
  const nonZero = kcal.filter((k) => k > 0).length;

  let offset = 0;
  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <div className="relative h-36 w-36 shrink-0">
        <svg viewBox="0 0 140 140" className="h-full w-full -rotate-90" role="img" aria-label="Calories by macronutrient">
          <circle cx="70" cy="70" r={R} fill="none" stroke="#f3f4f6" strokeWidth={STROKE} />
          {sum > 0 &&
            MACROS.map((m, i) => {
              const len = (kcal[i] / sum) * C;
              const seg = (
                <circle
                  key={m.key}
                  cx="70"
                  cy="70"
                  r={R}
                  fill="none"
                  stroke={m.color}
                  strokeWidth={hover === i ? STROKE + 4 : STROKE}
                  strokeDasharray={`${Math.max(len - (nonZero > 1 ? GAP : 0), 0)} ${C}`}
                  strokeDashoffset={-offset}
                  opacity={hover === null || hover === i ? 1 : 0.35}
                  className="cursor-pointer transition-all duration-150"
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                />
              );
              offset += len;
              return seg;
            })}
        </svg>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          {hover === null ? (
            <>
              <span className="text-2xl font-extrabold text-gray-900 tabular-nums">{total.calories}</span>
              <span className="text-xs text-gray-500">kcal</span>
            </>
          ) : (
            <>
              <span className="text-xs font-medium text-gray-500">{MACROS[hover].label}</span>
              <span className="text-xl font-bold text-gray-900 tabular-nums">{Math.round(kcal[hover])}</span>
              <span className="text-xs text-gray-500">kcal · {Math.round(pct[hover])}%</span>
            </>
          )}
        </div>
      </div>

      {/* Legend doubles as the data table */}
      <ul className="w-full space-y-2">
        {MACROS.map((m, i) => (
          <li
            key={m.key}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
            className={`flex items-center gap-3 rounded-xl px-3 py-2 transition-colors ${hover === i ? 'bg-gray-100' : 'bg-gray-50'}`}
          >
            <span className="h-3 w-3 rounded-full" style={{ background: m.color }} />
            <span className="text-sm font-medium text-gray-700">{m.label}</span>
            <span className="ml-auto text-sm font-semibold text-gray-900 tabular-nums">{total[m.key]}g</span>
            <span className="w-12 text-right text-xs text-gray-500 tabular-nums">{Math.round(pct[i])}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MacroDonut;
