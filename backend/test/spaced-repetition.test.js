const test = require('node:test');
const assert = require('node:assert/strict');
const {
  qualityFromScore,
  calculateNextReview,
  formatDueDate,
  isPerfectScore
} = require('../src/modules/spaced-repetition/spaced-repetition.service');

test('maps score boundaries to SM-2 quality', () => {
  const cases = [
    [0, 0], [39, 0], [40, 1], [59, 1], [60, 2], [69, 2],
    [70, 3], [79, 3], [80, 4], [89, 4], [90, 5], [100, 5]
  ];
  cases.forEach(([score, quality]) => assert.equal(qualityFromScore(score), quality));
});

test('starts successful reviews at one day then six days', () => {
  const first = calculateNextReview({}, 95, '2026-06-28');
  assert.equal(first.repetitions, 1);
  assert.equal(first.intervalDays, 1);
  assert.equal(first.dueDate, '2026-06-29');

  const second = calculateNextReview({
    easeFactor: first.easeFactor,
    intervalDays: first.intervalDays,
    repetitions: first.repetitions
  }, 90, '2026-06-29');
  assert.equal(second.repetitions, 2);
  assert.equal(second.intervalDays, 6);
  assert.equal(second.dueDate, '2026-07-05');
});

test('failed review resets repetitions and increments lapses', () => {
  const next = calculateNextReview({
    easeFactor: 2.5,
    intervalDays: 12,
    repetitions: 4,
    lapses: 2
  }, 50, '2026-06-28');
  assert.equal(next.repetitions, 0);
  assert.equal(next.intervalDays, 1);
  assert.equal(next.lapses, 3);
});

test('ease factor never drops below 1.3', () => {
  const next = calculateNextReview({ easeFactor: 1.3 }, 0, '2026-06-28');
  assert.equal(next.easeFactor, 1.3);
});

test('masters any perfect score', () => {
  assert.equal(isPerfectScore(100), true);
  assert.equal(isPerfectScore(99), false);
  assert.equal(isPerfectScore(95), false);
  assert.equal(isPerfectScore('100'), true);
});

test('formats PostgreSQL date values in the application timezone', () => {
  assert.equal(formatDueDate(new Date('2026-06-28T17:00:00.000Z')), '2026-06-29');
});
