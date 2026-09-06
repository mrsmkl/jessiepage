# JessiePage

JessiePage is a text-first geometry and computer algebra workspace for the browser. Write ordinary [JessieCode](https://jsxgraph.org/docs/symbols/JXG.JessieCode.html) on the left, see the JSXGraph construction on one shared canvas, and use [CortexJS Compute Engine](https://cortexjs.io/compute-engine/) expressions in the same source.

CAS results are rendered beside their source lines. The source remains a continuous plain-text editor: there are no notebook cells or formula editor controls.

**Live page:** <https://mrsmkl.github.io/jessiepage/>

**User manual:** [`output/pdf/jessiepage-user-manual.pdf`](output/pdf/jessiepage-user-manual.pdf) (TeX source is included beside it.)

## What it includes

- Live JessieCode geometry with pan, wheel/pinch zoom, resizing, and fullscreen controls
- Line-aligned, typeset CAS results over the right side of the text editor
- One large shared graph for any combination of selected CAS functions and point sets
- Shared definitions across later CAS lines
- Compatible values shared between CortexJS and JessieCode
- Editable browser-local pages, autosave, and shareable program links
- Source readback when simple points or literal-position text widgets are dragged
- Euclid's five postulates, five common notions, and all 48 propositions of Book I
- Separate examples for algebra, calculus, matrices, complex numbers, sampled points, sums, and products

## Quick examples

JessieCode lines end in semicolons as usual:

```jessiecode
A = point(-3, -1);
B = point(3, -1);
AB = segment(A, B);
M = midpoint(A, B);
c = circle(M, A);
```

CAS lines need no special cell marker:

```text
f = x^3 + 2*x^2 - x + 4
g = differentiate(f, x)
h = differentiate(g, x)
solve(f, x)
```

Each graphable result receives a **Graph** switch. Several switches may be enabled at once; every selected result is drawn on the same JSXGraph canvas.

Plain expressions and LaTeX-style input can be mixed:

```text
f = cos(x)
g = e^x
f + g
f*g
\frac{x^2}{2} + \sin(x)
\sum_{k=1}^{10} k
```

## CAS operations

The text interface currently recognizes:

| Area | Operations |
| --- | --- |
| Algebra | `simplify`, `expand`, `factor`, `together`, `evaluate`, `numeric`, `substitute` |
| Equations and calculus | `solve`, `differentiate`, `integrate`, `limit` |
| Finite operations | `sum`, `product` |
| Matrices | `determinant`, `inverse`, `transpose`, `eigenvalues` |
| Collections | `range`, `map`, `zip` |
| State | `assume`, `forget` |
| Graph persistence | `plot` |

Typical call forms are:

```text
simplify(expression)
expand(expression)
differentiate(expression, variable)
solve(expression, variable)
integrate(expression, variable)
integrate(expression, variable, lower, upper)
sum(expression, variable, lower, upper)
product(expression, variable, lower, upper)
```

`plot(expression)` remains available when graph selection should be stored in shared source. Normally the result-area switch is enough.

## Sharing values between CAS and JessieCode

Constant numbers and numeric collections are defined in both systems when possible:

```text
scale = 2
offset = 1
A = point(-scale, offset);
B = point(scale, scale + offset);
segment(A, B);
```

The bridge also gives CortexJS useful representations of straightforward Jessie geometry:

| Jessie object | CortexJS representation |
| --- | --- |
| Point | Coordinate pair |
| Line | Implicit line equation |
| Segment | Equation of its infinite carrier line |
| Circle | Implicit circle equation |
| Quoted function graph | Equation `y = f(x)` |

This allows later CAS lines to use geometry definitions:

```text
A = point(-2, 0);
B = point(2, 2);
carrier = line(A, B);
solve(carrier, y)

c = circle(A, 3);
solve(c, y)
```

Only representations with clear mathematical meaning are shared. Arbitrary polygons, gliders, sliders, and dynamic `map () -> ...` constructions stay in JessieCode. Jessie object aliases and object collections also remain JessieCode values.

## Pages and persistence

Built-in pages are grouped into general examples, Euclid postulates, common notions, and Book I. The **+** button creates a separate editable page. Page source, names, graph selections, and canvas views are stored in browser `localStorage`.

The **Link** action encodes the current source and selected graphs in the URL so the program can be opened as a new page. It does not upload saved pages to a server.

Dragging a standalone text widget with literal coordinates updates those coordinates in the source, just like a simple assigned point:

```jessiecode
title = text(-4, 5, 'Move me');
text(-4, -5, map () -> 'Length = ' + dist(A, B));
```

The text may be static or dynamic. Computed positions such as `text(map () -> X(A), ...)` remain controlled by their expressions and are not rewritten.

## Development

Requirements:

- Node.js 22.3 or newer
- npm

Install and run the complete local check:

```sh
npm ci
npm run check
```

`npm run check` performs JavaScript syntax checks, runs the Node test suite, and builds the single-file GitHub Pages artifact at `dist/index.html`.

To serve the bundled page locally:

```sh
python3 -m http.server 8000 --directory dist
```

Then open <http://localhost:8000/>.

## Testing all built-in pages

The Node suite checks metadata and CortexJS analysis for all 90 built-in pages, with more focused coverage for CAS evaluation, graph callbacks, shared state, collections, and geometry equations.

GitHub Actions additionally starts the bundled page in headless Chrome and runs every built-in page through the production JSXGraph/JessieCode parser. The same browser validation runs on pull requests and again before GitHub Pages deployment.

After building, contributors with Chrome installed can run it directly:

```sh
node scripts/check-builtins-browser.mjs
```

When adding or removing built-in pages, update the expected built-in count in `test/cas.test.js` and `scripts/check-builtins-browser.mjs`.

## Project layout

| Path | Purpose |
| --- | --- |
| `index.html` | Application shell and external browser dependencies |
| `app.js` | Editor, pages, persistence, JSXGraph lifecycle, and interaction |
| `cas.js` | CAS detection, evaluation, graph descriptions, and Jessie/CAS bridge |
| `readback.js` | Literal point and text coordinate source readback |
| `state.js` | Page timestamps, cross-tab merging, and saved layout validation |
| `examples.js` | Built-in sample and Euclid page registry |
| `euclid/` | Standalone JessieCode sources for Euclid Book I |
| `styles.css` | Responsive editor and canvas styling |
| `scripts/build.mjs` | Bundles the static application into `dist/index.html` |
| `scripts/check-builtins-browser.mjs` | Executes all built-ins with the browser JessieCode parser |
| `test/` | Node test suite |

## Deployment

Pull requests run the complete test and browser-validation workflow. Merges to `main` rebuild `dist`, validate all built-in pages, and deploy the artifact with GitHub Pages Actions.

JSXGraph, CortexJS Compute Engine, and KaTeX are loaded from jsDelivr by the browser. No application server or database is required.
