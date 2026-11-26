import React from 'react';
import { History, Trash2, UtensilsCrossed } from 'lucide-react';
import { MealEntry } from '../types';
import { isToday, todaysTotal } from '../nutrition';

interface Props {
  history: MealEntry[];
  onDelete: (id: string) => void;
}

const dayLabel = (iso: string) =>
  isToday(iso) ? 'Today' : new Date(iso).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });

const MealHistory: React.FC<Props> = ({ history, onDelete }) => {
  const today = todaysTotal(history);
  const sorted = [...history].sort((a, b) => b.date.localeCompare(a.date));
  const groups = sorted.reduce<Record<string, MealEntry[]>>((g, m) => {
    (g[dayLabel(m.date)] ??= []).push(m);
    return g;
  }, {});

  return (
    <section className="bg-white rounded-3xl p-6 shadow-xl shadow-gray-900/5 border border-gray-100">
      <div className="flex items-center gap-2 mb-4">
        <History className="h-5 w-5 text-emerald-600" />
        <h3 className="text-lg font-bold text-gray-900">Meal log</h3>
        <span className="ml-auto text-sm text-gray-500">
          Today: <span className="font-semibold text-gray-900 tabular-nums">{today.calories} kcal</span>
        </span>
      </div>

      {history.length === 0 ? (
        <div className="py-8 text-center text-sm text-gray-500">
          <UtensilsCrossed className="mx-auto mb-2 h-8 w-8 text-gray-300" />
          No meals logged yet. Analyze a photo and press <span className="font-medium text-gray-700">Save to log</span>.
        </div>
      ) : (
        <div className="max-h-96 space-y-5 overflow-y-auto pr-1">
          {Object.entries(groups).map(([day, meals]) => (
            <div key={day}>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">{day}</p>
              <ul className="space-y-2">
                {meals.map((m) => (
                  <li key={m.id} className="group flex items-center gap-3 rounded-2xl bg-gray-50 p-2 pr-3">
                    {m.thumbnail ? (
                      <img src={m.thumbnail} alt="" className="h-12 w-12 rounded-xl object-cover" />
                    ) : (
                      <div className="h-12 w-12 rounded-xl bg-gray-200" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold capitalize text-gray-900">
                        {m.names.join(', ') || 'Meal'}
                      </p>
                      <p className="truncate text-xs text-gray-500 tabular-nums">
                        {new Date(m.date).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })} · P {m.total.protein}g · C{' '}
                        {m.total.carbs}g · F {m.total.fat}g
                      </p>
                    </div>
                    <span className="whitespace-nowrap text-sm font-semibold text-gray-900 tabular-nums">{m.total.calories} kcal</span>
                    <button
                      onClick={() => onDelete(m.id)}
                      aria-label="Delete meal"
                      className="rounded-lg p-1.5 text-gray-400 sm:opacity-0 transition-opacity hover:bg-red-50 hover:text-red-600 focus:opacity-100 group-hover:opacity-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default MealHistory;
