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

  const positions = simpleTextPositions(source);
  assert.deepEqual(positions.map(({ lineIndex, x, y }) => ({ lineIndex, x, y })), [
    { lineIndex: 0, x: -8, y: 8 },
    { lineIndex: 1, x: -4, y: -3 }
  ]);
  assert.equal(
    replaceSimpleTextCoordinates(source, positions[0], -6.25, 5.5),
    [
      "title = text(-6.25, 5.5, 'I.1') <<fontSize:20>>;",
      "text(-4, -3, map () -> 'Length = ' + dist(A,B));",
      "text(1, 2, 'a'); text(3, 4, 'b');"
    ].join('\n')
  );
});

test('text readback ignores texts created inside runtime blocks', () => {
  const source = `for (n=0; n<3; n=n+1) {
  text(n, 0, 'loop');
}
text(2, 3, 'source');`;
  const positions = simpleTextPositions(source);

  assert.equal(positions.length, 1);
  assert.deepEqual({ lineIndex: positions[0].lineIndex, x: positions[0].x, y: positions[0].y }, { lineIndex: 3, x: 2, y: 3 });
});

test('text readback refuses to rewrite a line changed after board creation', () => {
  const original = "text(1, 2, 'first');";
  const position = simpleTextPositions(original)[0];

  assert.equal(replaceSimpleTextCoordinates("text(1, 2, 'different');", position, 4, 5), null);
});

test('computed text coordinates are not writable', () => {
  const source = "text(map () -> X(A), 3, 'attached');";
  assert.deepEqual(simpleTextPositions(source), []);
  assert.equal(replaceSimpleTextCoordinates(source, 0, 1, 2), null);
});
