import type { FoodItem, NutritionTotal, MealEntry } from './types.ts';
import { HEALTH_RATINGS, NUTRITION_THRESHOLDS } from './constants.ts';

export const MACROS = [
  { key: 'protein', label: 'Protein', kcalPerGram: 4, color: '#0284c7' },
  { key: 'carbs', label: 'Carbs', kcalPerGram: 4, color: '#d97706' },
  { key: 'fat', label: 'Fat', kcalPerGram: 9, color: '#7c3aed' },
] as const;

// FDA daily reference values.
export const DEFAULT_GOALS: NutritionTotal = { calories: 2000, protein: 50, carbs: 275, fat: 78 };

const round1 = (n: number) => Math.round(n * 10) / 10;

/** Nutrition DB values are per 100g; scale each item by its portion in grams. */
export function totalFor(items: FoodItem[], grams: number[]): NutritionTotal {
  const t = { calories: 0, protein: 0, carbs: 0, fat: 0 };
  items.forEach((item, i) => {
    const f = (grams[i] ?? 100) / 100;
    t.calories += item.calories * f;
    t.protein += item.protein * f;
    t.carbs += item.carbs * f;
    t.fat += item.fat * f;
  });
  return { calories: Math.round(t.calories), protein: round1(t.protein), carbs: round1(t.carbs), fat: round1(t.fat) };
}

export function sumTotals(totals: NutritionTotal[]): NutritionTotal {
  return totals.reduce(
    (a, t) => ({
      calories: a.calories + t.calories,
      protein: round1(a.protein + t.protein),
      carbs: round1(a.carbs + t.carbs),
      fat: round1(a.fat + t.fat),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
  );
}

/** Same rule as the backend (app.py), re-applied when portions change. */
export function healthRating(t: NutritionTotal): string {
  return t.fat < NUTRITION_THRESHOLDS.FAT_MODERATE && t.calories < NUTRITION_THRESHOLDS.CALORIES_HIGH
    ? HEALTH_RATINGS.HEALTHY
    : HEALTH_RATINGS.MODERATE;
}

export const isToday = (iso: string, now = new Date()) => new Date(iso).toDateString() === now.toDateString();

export const todaysTotal = (history: MealEntry[]) => sumTotals(history.filter((m) => isToday(m.date)).map((m) => m.total));
