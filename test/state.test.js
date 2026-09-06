import test from 'node:test';
import assert from 'node:assert/strict';
import { mergePages, savedPixelSize, touchPage } from '../state.js';

test('saving from one tab preserves pages created in another tab', () => {
  const local = [{ id: 'a', source: 'local', updatedAt: 10 }];
  const stored = [{ id: 'a', source: 'old', updatedAt: 5 }, { id: 'b', source: 'other tab', updatedAt: 8 }];

  assert.deepEqual(mergePages(local, stored), [local[0], stored[1]]);
});

test('newer page revisions win during cross-tab merging', () => {
  const local = [{ id: 'a', source: 'old', updatedAt: 5 }];
  const stored = [{ id: 'a', source: 'new', updatedAt: 10 }];

  assert.equal(mergePages(local, stored)[0].source, 'new');
  assert.equal(touchPage(local[0], 20).updatedAt, 21);
});

test('missing split preferences do not collapse the editor', () => {
  assert.equal(savedPixelSize(null, 0), null);
  assert.equal(savedPixelSize('', 0), null);
  assert.equal(savedPixelSize('320', 0), 320);
  assert.equal(savedPixelSize('20', 43), null);
});
