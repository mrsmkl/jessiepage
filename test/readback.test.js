import test from 'node:test';
import assert from 'node:assert/strict';
import {
  replaceSimplePointCoordinates,
  replaceSimpleTextCoordinates,
  simplePointNames,
  simpleTextPositions
} from '../readback.js';

test('plain assigned points keep their existing readback behavior', () => {
  const source = 'A = point(-2, 1); // movable\nB = point(map () -> 1, 2);';
  assert.deepEqual([...simplePointNames(source)], ['A']);
  assert.equal(
    replaceSimplePointCoordinates(source, 'A', 3.125, -0.00000001),
    'A = point(3.125, 0); // movable\nB = point(map () -> 1, 2);'
  );
  assert.equal(replaceSimplePointCoordinates(source, 'B', 1, 2), null);
});

test('assigned and unassigned standalone text positions can be read back', () => {
  const source = [
    "title = text(-8, 8, 'I.1') <<fontSize:20>>;",
    "text(-4, -3, map () -> 'Length = ' + dist(A,B));",
    "text(1, 2, 'a'); text(3, 4, 'b');"
  ].join('\n');

  assert.deepEqual(simpleTextPositions(source), [
    { lineIndex: 0, objectIndex: 0 },
    { lineIndex: 1, objectIndex: 1 }
  ]);
  assert.equal(
    replaceSimpleTextCoordinates(source, 0, -6.25, 5.5),
    [
      "title = text(-6.25, 5.5, 'I.1') <<fontSize:20>>;",
      "text(-4, -3, map () -> 'Length = ' + dist(A,B));",
      "text(1, 2, 'a'); text(3, 4, 'b');"
    ].join('\n')
  );
});

test('computed text coordinates are not writable', () => {
  const source = "text(map () -> X(A), 3, 'attached');";
  assert.deepEqual(simpleTextPositions(source), []);
  assert.equal(replaceSimpleTextCoordinates(source, 0, 1, 2), null);
});
