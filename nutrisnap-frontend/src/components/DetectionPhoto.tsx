import React from 'react';
import { FoodItem } from '../types';

interface Props {
  src: string;
  items: FoodItem[];
  grams: number[];
  hovered: number | null;
  onHover: (i: number | null) => void;
}

const DetectionPhoto: React.FC<Props> = ({ src, items, grams, hovered, onHover }) => (
  // Rendered at natural aspect ratio (no cropping) so normalized box coordinates line up.
  <div className="relative overflow-hidden rounded-3xl shadow-xl bg-gray-100">
    <img src={src} alt="Analyzed meal" className="block w-full h-auto" />
    {items.map((item, i) => {
      if (!item.box || grams[i] === 0) return null;
      const [x1, y1, x2, y2] = item.box;
      const active = hovered === i;
      const dimmed = hovered !== null && !active;
      return (
        <div
          key={i}
          onMouseEnter={() => onHover(i)}
          onMouseLeave={() => onHover(null)}
          className={`absolute rounded-lg border-2 transition-all duration-150 ${
            active ? 'border-emerald-400 bg-emerald-400/15 shadow-[0_0_0_3px_rgba(255,255,255,0.7)]' : 'border-white/90'
          } ${dimmed ? 'opacity-30' : ''}`}
          style={{ left: `${x1 * 100}%`, top: `${y1 * 100}%`, width: `${(x2 - x1) * 100}%`, height: `${(y2 - y1) * 100}%` }}
        >
          <span
            className={`absolute -top-px left-0 -translate-y-full whitespace-nowrap rounded-md px-1.5 py-0.5 text-[11px] font-semibold capitalize shadow ${
              active ? 'bg-emerald-500 text-white' : 'bg-white/95 text-gray-800'
            }`}
          >
            {item.name}
            {item.confidence !== undefined && ` · ${Math.round(item.confidence * 100)}%`}
          </span>
        </div>
      );
    })}
  </div>
);

export default DetectionPhoto;
