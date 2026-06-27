const test = require('node:test');
const assert = require('node:assert/strict');
const dailyService = require('../src/modules/daily/daily.service');

function task(targetType, targetId, skill, overdueDays, easeFactor = 2.5) {
  return { targetType, targetId, skill, overdueDays, easeFactor, lastAssignedAt: null };
}

test('selects one overdue task per skill before repeating a skill', () => {
  const due = [
    task('writing_lesson', 'w1', 'writing', 5),
    task('writing_lesson', 'w2', 'writing', 4),
    task('reading_lesson', 'r1', 'reading', 3),
    task('grammar_topic', 'g1', 'grammar', 2),
    task('game_level', 'm1', 'game', 1)
  ];
  const selected = dailyService.selectDiverseTasks(due, [], 4);
  assert.deepEqual(selected.map((item) => item.targetId), ['w1', 'r1', 'g1', 'm1']);
});

test('uses another due task before introducing new content', () => {
  const due = [
    task('writing_lesson', 'w1', 'writing', 5),
    task('writing_lesson', 'w2', 'writing', 4)
  ];
  const fresh = [task('reading_lesson', 'r1', 'reading', 0)];
  const selected = dailyService.selectDiverseTasks(due, fresh, 3);
  assert.deepEqual(selected.map((item) => item.targetId), ['w1', 'w2', 'r1']);
});

test('does not select a target already present in the daily plan', () => {
  const due = [
    task('reading_lesson', 'r1', 'reading', 5),
    task('grammar_topic', 'g1', 'grammar', 3)
  ];
  const selected = dailyService.selectDiverseTasks(
    due,
    [],
    2,
    new Set(['reading_lesson:r1'])
  );
  assert.deepEqual(selected.map((item) => item.targetId), ['g1']);
});
