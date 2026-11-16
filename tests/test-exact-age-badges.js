// Real-age badges (fork): formatBadge shows the file's exact age when a timestamp is known, within VS Code's 2-character limit.
const assert = require('assert');
const { formatBadge, formatBadgeExactAge } = require('../src/utils/freshnessResolver');

const now = Date.now();
const minute = 60 * 1000, hour = 60 * minute, day = 24 * hour;
const cases = [
    [5 * 1000, '0m'], [9 * minute, '9m'], [15 * minute, '¼h'], [30 * minute, '½h'], [50 * minute, '¾h'],
    [3 * hour, '3h'], [12 * hour, '½d'], [20 * hour, '¾d'], [3 * day, '3d'], [20 * day, '2w'],
    [100 * day, '3M'], [330 * day, '10'], [800 * day, '2y'], [20 * 365 * day, '9+'],
];
for (const [age, expected] of cases) {
    const badge = formatBadgeExactAge(now - age, now);
    assert.strictEqual(badge, expected, `age ${age} ms → ${badge}, expected ${expected}`);
    assert.ok([...badge].length <= 2, `badge '${badge}' exceeds 2 characters`);
}
const config = { get: (_key, fallback) => fallback };
assert.strictEqual(formatBadge('now', 'fs', config, 'high'), '!!', 'without a timestamp the bucket symbol is kept');
assert.notStrictEqual(formatBadge('now', 'fs', config, 'high', now - 3 * hour), '!!', 'with a timestamp the real age is shown');
assert.strictEqual(formatBadgeExactAge('not a date'), null);
console.log('✅ exact-age badges');
