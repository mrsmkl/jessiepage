import test from 'node:test';
import assert from 'node:assert/strict';
import { ComputeEngine, compile } from '@cortex-js/compute-engine';
import { analyzeSource, drawCasGraphs } from '../cas.js';
import { BUILTIN_EXAMPLES } from '../examples.js';

function analyze(source) {
  return analyzeSource(source, ComputeEngine);
}

function successful(source) {
  const analysis = analyze(source);
  assert.deepEqual(analysis.results.filter((result) => result.error), []);
  return analysis;
}

function resultAt(analysis, lineIndex) {
  return analysis.results.find((result) => result.lineIndex === lineIndex);
}

class MockBoard {
  created = [];

  create(type, args, attributes) {
    const object = { type, args, attributes };
    this.created.push(object);
    return object;
  }
}

test('shared definitions feed later algebra and calculus lines', () => {
  const analysis = successful(`f = x^3 - 2*x
simplify(f)
differentiate(f, x)
substitute(f, x, 3)`);

  assert.equal(resultAt(analysis, 0).latex, 'x^3-2x');
  assert.equal(resultAt(analysis, 2).latex, '3x^2-2');
  assert.equal(resultAt(analysis, 3).latex, '21');
});

test('generic solve returns and graphs every real solution', () => {
  const analysis = successful(`f = (x-3)*(x+2)*(x-1)
solve(f, x)`);
  const solved = resultAt(analysis, 1);

  assert.equal(solved.latex, '\\left\\{-2,1,3\\right\\}');
  assert.deepEqual(solved.graph.coordinates, [[-2, 0], [1, 0], [3, 0]]);
});

test('function and derivative graph callbacks evaluate their own expressions', () => {
  const analysis = successful(`f = x^2 - 4
differentiate(f, x)`);
  const board = new MockBoard();

  drawCasGraphs(board, analysis.results, new Set(['name:f', 'line:1']), compile);

  assert.equal(board.created.length, 2);
  assert.deepEqual(board.created.map((object) => object.type), ['functiongraph', 'functiongraph']);
  assert.equal(board.created[0].args[0](3), 5);
  assert.equal(board.created[1].args[0](3), 6);
  assert.equal(board.created[0].attributes.strokeWidth, 3);
});

test('plain-text cosine and exponential expressions render and graph correctly', () => {
  const analysis = successful(`f = cos(x)
g = e^x`);
  const board = new MockBoard();

  assert.equal(resultAt(analysis, 0).latex, '\\cos(x)');
  assert.equal(resultAt(analysis, 1).latex, '\\mathrm{e}^{x}');
  drawCasGraphs(board, analysis.results, new Set(['name:f', 'name:g']), compile);
  assert.equal(board.created[0].args[0](0), 1);
  assert.ok(Math.abs(board.created[1].args[0](1) - Math.E) < 1e-12);
});

test('graph expressions compile once instead of substituting on every sample', () => {
  const analysis = successful('f = x^3 + 2*x^2 - x + 4');
  const board = new MockBoard();
  let compilations = 0;

  drawCasGraphs(board, analysis.results, new Set(['name:f']), (expression) => {
    compilations += 1;
    return compile(expression);
  });
  const evaluate = board.created[0].args[0];
  for (let x = -50; x <= 50; x += 0.05) assert.ok(Number.isFinite(evaluate(x)));

  assert.equal(compilations, 1);
});

test('several selected functions and point sets share one board', () => {
  const analysis = successful(`f = x^2
samples = {(-2,4),(0,0),(2,4)}
z = 3 + 2*i`);
  const board = new MockBoard();

  drawCasGraphs(board, analysis.results, new Set(['name:f', 'name:samples', 'name:z']), compile);

  assert.equal(board.created.filter((object) => object.type === 'functiongraph').length, 1);
  const points = board.created.filter((object) => object.type === 'point');
  assert.deepEqual(points.map((point) => point.args), [[-2, 4], [0, 0], [2, 4], [3, 2]]);
  assert.ok(points.every((point) => point.attributes.fixed));
});

test('plot() forces a graph while ordinary graphable results remain opt-in', () => {
  const analysis = successful(`f = x^2
differentiate(f, x)
plot(f)`);
  const board = new MockBoard();

  drawCasGraphs(board, analysis.results, new Set(), compile);

  assert.equal(board.created.length, 1);
  assert.equal(board.created[0].type, 'functiongraph');
  assert.equal(board.created[0].args[0](4), 16);
});

test('finite limits use a hollow point marker', () => {
  const analysis = successful(`f = (x^2-1)/(x-1)
limit(f, x, 1)`);
  const board = new MockBoard();

  drawCasGraphs(board, analysis.results, new Set(['line:1']), compile);

  assert.deepEqual(board.created[0].args, [1, 2]);
  assert.equal(board.created[0].attributes.fillColor, '#fff');
});

test('range, map and zip produce one graphable sampled point set', () => {
  const analysis = successful(`f = x^2 - 4
xs = range(-2, 2)
ys = map(f, xs)
samples = zip(xs, ys)`);

  assert.equal(resultAt(analysis, 1).graph, null);
  assert.equal(resultAt(analysis, 2).graph, null);
  assert.deepEqual(resultAt(analysis, 3).graph.coordinates, [[-2, 0], [-1, -3], [0, -4], [1, -3], [2, 0]]);
});

test('matrix operations render as matrices and never as point collections', () => {
  const analysis = successful(`A = [[1,2],[3,4]]
determinant(A)
inverse(A)
transpose(A)
eigenvalues(A)`);

  assert.equal(resultAt(analysis, 0).graph, null);
  assert.equal(resultAt(analysis, 1).latex, '-2');
  assert.match(resultAt(analysis, 2).latex, /^\\begin\{bmatrix\}/);
  assert.match(resultAt(analysis, 3).latex, /^\\begin\{bmatrix\}/);
  assert.equal(resultAt(analysis, 4).graph, null);
});

test('assumptions affect later results and forget() clears them', () => {
  const analysis = successful(`assume(x > 0)
simplify(\\sqrt{x^2})
forget(x)
simplify(\\sqrt{x^2})`);

  assert.equal(resultAt(analysis, 1).latex, 'x');
  assert.equal(resultAt(analysis, 3).latex, '\\vert x\\vert');
});

test('JessieCode map syntax is not consumed as a CAS call', () => {
  const source = 'fx = map (t) -> 2 * cos(t);';
  const analysis = successful(source);

  assert.equal(analysis.jessieSource, source);
  assert.equal(analysis.results.length, 0);
});

test('invalid collection operations report inline errors without stopping later lines', () => {
  const analysis = analyze(`range(0, 3, 0)
zip([1,2], [3])
a = 5`);

  assert.match(resultAt(analysis, 0).error, /nonzero step/);
  assert.match(resultAt(analysis, 1).error, /same length/);
  assert.equal(resultAt(analysis, 2).latex, '5');
});

test('every built-in CAS page evaluates without a CAS error', () => {
  const examples = BUILTIN_EXAMPLES.filter((example) => example.key.startsWith('cas-'));
  assert.equal(examples.length, 21);

  for (const example of examples) {
    const errors = analyze(example.source).results.filter((result) => result.error);
    assert.deepEqual(errors, [], example.key);
  }
});
