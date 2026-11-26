// Run with: npm test  (Node strips the TypeScript types natively)
import assert from 'node:assert/strict';
import { totalFor, sumTotals, healthRating, todaysTotal } from './nutrition.ts';

const items = [
  { name: 'rice', calories: 130, protein: 2.7, carbs: 28, fat: 0.3 },
  { name: 'chicken', calories: 165, protein: 31, carbs: 0, fat: 3.6 },
];

assert.deepEqual(totalFor(items, [100, 100]), { calories: 295, protein: 33.7, carbs: 28, fat: 3.9 });
assert.deepEqual(totalFor(items, [200, 0]), { calories: 260, protein: 5.4, carbs: 56, fat: 0.6 });
assert.deepEqual(totalFor(items, []), totalFor(items, [100, 100]), 'missing portion defaults to 100g');
assert.deepEqual(sumTotals([]), { calories: 0, protein: 0, carbs: 0, fat: 0 });
assert.ok(healthRating({ calories: 500, protein: 0, carbs: 0, fat: 10 }).includes('Healthy'));
assert.ok(healthRating({ calories: 600, protein: 0, carbs: 0, fat: 10 }).includes('Moderate'));

const t = { calories: 100, protein: 1, carbs: 1, fat: 1 };
const yesterday = new Date(Date.now() - 86_400_000).toISOString();
assert.equal(todaysTotal([{ id: 'a', date: new Date().toISOString(), names: [], total: t }, { id: 'b', date: yesterday, names: [], total: t }]).calories, 100);

console.log('nutrition: all checks passed');
