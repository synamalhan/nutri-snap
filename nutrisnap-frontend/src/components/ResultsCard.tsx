import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Utensils, Timer, X, Undo2, BookmarkPlus, BookmarkCheck } from 'lucide-react';
import { AnalysisResult, Goals, NutritionTotal } from '../types';
import { totalFor, healthRating, sumTotals } from '../nutrition';
import DetectionPhoto from './DetectionPhoto';
import MacroDonut from './MacroDonut';
import GoalsPanel from './GoalsPanel';

interface ResultsCardProps {
  result: AnalysisResult;
  imageUrl: string | null;
  goals: Goals;
  setGoals: (g: Goals) => void;
  /** Today's logged total, excluding this meal. */
  loggedExcludingThis: NutritionTotal;
  isSaved: boolean;
  onSave: (total: NutritionTotal, names: string[]) => void;
}

const ratingStyle = (rating: string) => {
  if (rating.includes('🟢')) return 'bg-emerald-50 text-emerald-700 ring-emerald-200';
  if (rating.includes('🟡')) return 'bg-amber-50 text-amber-700 ring-amber-200';
  return 'bg-red-50 text-red-700 ring-red-200';
};

const ResultsCard: React.FC<ResultsCardProps> = ({ result, imageUrl, goals, setGoals, loggedExcludingThis, isSaved, onSave }) => {
  const { items } = result;
  const [grams, setGrams] = useState<number[]>(() => items.map(() => 100));
  const [lastGrams, setLastGrams] = useState<Record<number, number>>({}); // for undoing a removal
  const [hovered, setHovered] = useState<number | null>(null);
  const [dirty, setDirty] = useState(false);

  const total = totalFor(items, grams);
  const rating = healthRating(total);
  const activeNames = items.filter((_, i) => grams[i] > 0).map((it) => it.name);

  const setPortion = (i: number, g: number) => {
    setGrams((prev) => prev.map((v, j) => (j === i ? g : v)));
    setDirty(true);
  };
  const toggleRemoved = (i: number) => {
    if (grams[i] > 0) {
      setLastGrams({ ...lastGrams, [i]: grams[i] });
      setPortion(i, 0);
    } else {
      setPortion(i, lastGrams[i] ?? 100);
    }
  };
  const save = () => {
    onSave(total, activeNames);
    setDirty(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      {/* Photo, rating, save */}
      <div className="lg:col-span-2 space-y-4 lg:sticky lg:top-24 self-start">
        {imageUrl && <DetectionPhoto src={imageUrl} items={items} grams={grams} hovered={hovered} onHover={setHovered} />}
        <div className={`flex items-center justify-between rounded-2xl p-5 ring-1 ${ratingStyle(rating)}`}>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide opacity-70">Health rating</p>
            <p className="text-2xl font-bold">{rating}</p>
          </div>
          {result.processingTime !== undefined && (
            <span className="flex items-center gap-1 text-xs opacity-70">
              <Timer className="h-3.5 w-3.5" /> {result.processingTime}s
            </span>
          )}
        </div>
        <button
          onClick={save}
          disabled={isSaved && !dirty}
          className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3.5 font-semibold text-white shadow-lg shadow-emerald-600/20 transition-colors hover:bg-emerald-700 disabled:bg-emerald-50 disabled:text-emerald-700 disabled:shadow-none disabled:ring-1 disabled:ring-emerald-200"
        >
          {isSaved && !dirty ? (
            <><BookmarkCheck className="h-5 w-5" /> Saved to today's log</>
          ) : (
            <><BookmarkPlus className="h-5 w-5" /> {isSaved ? 'Update log entry' : 'Save to log'}</>
          )}
        </button>
      </div>

      <div className="lg:col-span-3 space-y-6">
        <section className="bg-white rounded-3xl p-6 shadow-xl shadow-gray-900/5 border border-gray-100">
          <div className="mb-5">
            <p className="text-sm font-medium text-gray-500">This meal</p>
            <p className="text-lg font-bold text-gray-900">Calories by macronutrient</p>
          </div>
          <MacroDonut total={total} />
        </section>

        <section className="bg-white rounded-3xl p-6 shadow-xl shadow-gray-900/5 border border-gray-100">
          <div className="flex items-center gap-2 mb-1">
            <Utensils className="h-5 w-5 text-emerald-600" />
            <h3 className="text-lg font-bold text-gray-900">Detected items</h3>
            <span className="ml-auto bg-emerald-50 text-emerald-700 text-xs font-medium px-2.5 py-1 rounded-full">
              {activeNames.length} of {items.length}
            </span>
          </div>
          <p className="mb-4 text-sm text-gray-500">Adjust each portion; values are scaled from per-100g data.</p>

          {items.length === 0 ? (
            <p className="text-sm text-gray-500 py-6 text-center">No known foods were detected in this photo.</p>
          ) : (
            <ul className="space-y-2">
              {items.map((item, i) => {
                const removed = grams[i] === 0;
                const f = grams[i] / 100;
                return (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                    className={`rounded-2xl p-3 transition-colors ${hovered === i ? 'bg-emerald-50 ring-1 ring-emerald-200' : 'bg-gray-50'} ${removed ? 'opacity-50' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="min-w-0 flex-1">
                        <p className={`font-semibold capitalize text-gray-900 ${removed ? 'line-through' : ''}`}>{item.name}</p>
                        {item.confidence !== undefined && (
                          <p className="text-xs text-gray-500">{Math.round(item.confidence * 100)}% confidence</p>
                        )}
                      </div>
                      <div className="hidden sm:flex gap-3 text-xs tabular-nums text-gray-600">
                        <span>P {Math.round(item.protein * f * 10) / 10}g</span>
                        <span>C {Math.round(item.carbs * f * 10) / 10}g</span>
                        <span>F {Math.round(item.fat * f * 10) / 10}g</span>
                      </div>
                      <span className="w-20 text-right text-sm font-semibold text-gray-900 tabular-nums">
                        {Math.round(item.calories * f)} kcal
                      </span>
                      <button
                        onClick={() => toggleRemoved(i)}
                        aria-label={removed ? `Restore ${item.name}` : `Remove ${item.name}`}
                        title={removed ? 'Restore' : 'Not this food? Remove it'}
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-white hover:text-gray-700"
                      >
                        {removed ? <Undo2 className="h-4 w-4" /> : <X className="h-4 w-4" />}
                      </button>
                    </div>
                    {!removed && (
                      <div className="mt-2 flex items-center gap-3">
                        <input
                          type="range"
                          min={10}
                          max={500}
                          step={10}
                          value={grams[i]}
                          onChange={(e) => setPortion(i, Number(e.target.value))}
                          aria-label={`${item.name} portion in grams`}
                          className="flex-1 accent-emerald-600"
                        />
                        <span className="w-14 text-right text-sm font-medium text-gray-700 tabular-nums">{grams[i]}g</span>
                      </div>
                    )}
                  </motion.li>
                );
              })}
            </ul>
          )}
        </section>

        {isSaved && !dirty ? (
          <GoalsPanel goals={goals} setGoals={setGoals} logged={sumTotals([loggedExcludingThis, total])} />
        ) : (
          <GoalsPanel goals={goals} setGoals={setGoals} logged={loggedExcludingThis} pending={total} />
        )}
      </div>
    </motion.div>
  );
};

export default ResultsCard;
