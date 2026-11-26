import React, { useState } from 'react';
import { Target, Pencil, Check } from 'lucide-react';
import { Goals, NutritionTotal } from '../types';
import { MACROS } from '../nutrition';

interface Props {
  goals: Goals;
  setGoals: (g: Goals) => void;
  logged: NutritionTotal;
  /** The meal on screen that isn't in the log yet, drawn as a lighter segment. */
  pending?: NutritionTotal | null;
}

const ROWS = [
  { key: 'calories', label: 'Calories', unit: 'kcal', color: '#059669' },
  ...MACROS.map((m) => ({ key: m.key, label: m.label, unit: 'g', color: m.color })),
] as const;

const GoalsPanel: React.FC<Props> = ({ goals, setGoals, logged, pending }) => {
  const [editing, setEditing] = useState(false);

  return (
    <section className="bg-white rounded-3xl p-6 shadow-xl shadow-gray-900/5 border border-gray-100">
      <div className="flex items-center gap-2 mb-5">
        <Target className="h-5 w-5 text-emerald-600" />
        <h3 className="text-lg font-bold text-gray-900">Daily goals</h3>
        <button
          onClick={() => setEditing(!editing)}
          className="ml-auto inline-flex shrink-0 whitespace-nowrap items-center gap-1 rounded-lg px-2.5 py-1 text-sm font-medium text-gray-600 hover:bg-gray-100"
        >
          {editing ? <><Check className="h-4 w-4" /> Done</> : <><Pencil className="h-4 w-4" /> Edit goals</>}
        </button>
      </div>

      <div className="space-y-4">
        {ROWS.map((r) => {
          const goal = goals[r.key] || 1;
          const done = logged[r.key];
          const add = pending?.[r.key] ?? 0;
          const after = Math.round((done + add) * 10) / 10;
          const over = after > goal;
          return (
            <div key={r.key}>
              <div className="flex items-baseline justify-between text-sm mb-1.5">
                <span className="flex items-center gap-2 font-medium text-gray-700">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: r.color }} /> {r.label}
                </span>
                {editing ? (
                  <label className="flex items-center gap-1 text-gray-500">
                    goal
                    <input
                      type="number"
                      min={0}
                      value={goals[r.key]}
                      onChange={(e) => setGoals({ ...goals, [r.key]: Math.max(0, Number(e.target.value)) })}
                      className="w-20 rounded-md border border-gray-200 px-2 py-0.5 text-right text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                      aria-label={`${r.label} goal`}
                    />
                    {r.unit}
                  </label>
                ) : (
                  <span className="tabular-nums text-gray-600">
                    <span className="font-semibold text-gray-900">{after}</span> / {goals[r.key]} {r.unit}
                    {over && <span className="ml-2 text-xs font-medium text-red-600">over by {Math.round((after - goal) * 10) / 10}</span>}
                  </span>
                )}
              </div>
              <div className="flex h-2.5 w-full gap-[2px] overflow-hidden rounded-full bg-gray-100">
                <div className="h-full rounded-l-full" style={{ width: `${Math.min(done / goal, 1) * 100}%`, background: r.color }} />
                {add > 0 && (
                  <div
                    className="h-full"
                    title="This meal (not saved yet)"
                    style={{
                      width: `${Math.max(Math.min(after / goal, 1) - Math.min(done / goal, 1), 0) * 100}%`,
                      background: `repeating-linear-gradient(135deg, ${r.color} 0 4px, ${r.color}66 4px 7px)`,
                    }}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {pending && (
        <p className="mt-4 flex items-center gap-2 text-xs text-gray-500">
          <span className="inline-block h-2.5 w-5 rounded-sm" style={{ background: 'repeating-linear-gradient(135deg, #6b7280 0 4px, #6b728066 4px 7px)' }} />
          Striped = this meal, not saved yet
        </p>
      )}
    </section>
  );
};

export default GoalsPanel;
