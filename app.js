import { ComputeEngine, compile } from 'https://cdn.jsdelivr.net/npm/@cortex-js/compute-engine@0.119.0/+esm';
import katex from 'https://cdn.jsdelivr.net/npm/katex@0.18.6/+esm';
import { BUILTIN_EXAMPLES } from './examples.js';
import { analyzeSource, drawCasGraphs } from './cas.js';

const computeEngine = new ComputeEngine();

function toJessieExpression(json) {
  if (typeof json === 'number') return String(json);
  if (typeof json === 'string') return json;
  if (!Array.isArray(json) || !json.length) throw new Error('Unsupported CAS result');
  const [operator, ...operands] = json;
  const values = operands.map(toJessieExpression);
  switch (operator) {
    case 'Add': return `(${values.join('+')})`;
    case 'Multiply': return `(${values.join('*')})`;
    case 'Power': return `(${values[0]}^${values[1]})`;
    case 'Divide':
    case 'Rational': return `(${values[0]}/${values[1]})`;
    case 'Negate': return `(-${values[0]})`;
    case 'Sqrt': return `sqrt(${values[0]})`;
    default: return `${String(operator).toLowerCase()}(${values.join(',')})`;
  }
}

// CortexJS helpers exposed as ordinary JessieCode functions.
JXG.JessieCode.prototype.addBuiltIn('simplify', (source) =>
  toJessieExpression(computeEngine.parse(String(source)).simplify().json)
);
JXG.JessieCode.prototype.addBuiltIn('expand', (source) => {
  const expression = computeEngine.parse(String(source));
  return toJessieExpression(computeEngine.box(['Expand', expression]).evaluate().json);
});
JXG.JessieCode.prototype.addBuiltIn('differentiate', (source, variable) => {
  const expression = computeEngine.parse(String(source));
  return toJessieExpression(computeEngine.box(['D', expression, variable || 'x']).evaluate().json);
});
JXG.JessieCode.prototype.addBuiltIn('solve', (source, variable) =>
  computeEngine.parse(String(source)).solve(variable || 'x').map((solution) => {
    const value = solution.N().valueOf();
    return typeof value === 'number' ? value : solution.latex;
  })
);
JXG.JessieCode.prototype.addBuiltIn('points', function (coordinates, prefix) {
  if (!Array.isArray(coordinates)) throw new Error('points() expects an array of values or [x, y] coordinates');
  const namePrefix = prefix == null ? 'P' : String(prefix);
  return coordinates.map((item, index) => {
    const coordinate = Array.isArray(item) ? item : [item, 0];
    if (!Array.isArray(item) && !Number.isFinite(item)) return null;
    if (!Array.isArray(coordinate) || coordinate.length < 2) {
      throw new Error('Each points() coordinate must be [x, y]');
    }
    return this.board.create('point', [coordinate[0], coordinate[1]], {
      name: namePrefix ? `${namePrefix}${index + 1}` : ''
    });
  }).filter(Boolean);
});

const editor = document.getElementById('editor');
const status = document.getElementById('status');
const points = document.getElementById('points');
const hint = document.getElementById('hint');
const errorMarker = document.getElementById('error-line-marker');
const autocomplete = document.getElementById('autocomplete');
const casResults = document.getElementById('cas-results');
const casResultLines = document.getElementById('cas-result-lines');
const layout = document.getElementById('layout');
const splitter = document.getElementById('splitter');
const pageSelect = document.getElementById('page-select');
const pageName = document.getElementById('page-name');
const addPage = document.getElementById('add-page');
const fullscreenButton = document.getElementById('fullscreen-button');
const programLink = document.getElementById('program-link');
const boardPane = document.getElementById('board-pane');
const canvasZoomIn = document.getElementById('canvas-zoom-in');
const canvasZoomOut = document.getElementById('canvas-zoom-out');
const canvasReset = document.getElementById('canvas-reset');
const canvasFullscreen = document.getElementById('canvas-fullscreen');

const STORAGE_KEY = 'jessiepage-state-v1';
const DEFAULT_BBOX = [-6, 6, 6, -6];
const NUMBER = String.raw`[-+]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][-+]?\d+)?`;
const BUILTIN_EXAMPLES_VERSION = 18;
const INPUT_RENDER_MS = 80;
const SAVE_IDLE_MS = 250;
const ERROR_IDLE_MS = 700;
const AUTOCOMPLETE_WORDS = [
  ['point', 'point(', 'geometry'],
  ['line', 'line(', 'geometry'],
  ['segment', 'segment(', 'geometry'],
  ['circle', 'circle(', 'geometry'],
  ['polygon', 'polygon(', 'geometry'],
  ['midpoint', 'midpoint(', 'geometry'],
  ['intersection', 'intersection(', 'geometry'],
  ['perpendicular', 'perpendicular(', 'geometry'],
  ['circumcircle', 'circumcircle(', 'geometry'],
  ['glider', 'glider(', 'geometry'],
  ['tangent', 'tangent(', 'geometry'],
  ['slider', 'slider(', 'control'],
  ['functiongraph', 'functiongraph(', 'plot'],
  ['curve', 'curve(', 'plot'],
  ['simplify', 'simplify(', 'CAS'],
  ['expand', 'expand(', 'CAS'],
  ['differentiate', 'differentiate(', 'CAS'],
  ['solve', 'solve(', 'CAS'],
  ['factor', 'factor(', 'CAS'],
  ['together', 'together(', 'CAS'],
  ['evaluate', 'evaluate(', 'CAS'],
  ['numeric', 'numeric(', 'CAS'],
  ['substitute', 'substitute(', 'CAS'],
  ['integrate', 'integrate(', 'CAS'],
  ['limit', 'limit(', 'CAS'],
  ['sum', 'sum(', 'CAS'],
  ['product', 'product(', 'CAS'],
  ['determinant', 'determinant(', 'CAS'],
  ['inverse', 'inverse(', 'CAS'],
  ['transpose', 'transpose(', 'CAS'],
  ['eigenvalues', 'eigenvalues(', 'CAS'],
  ['range', 'range(', 'CAS'],
  ['map', 'map(', 'CAS'],
  ['zip', 'zip(', 'CAS'],
  ['assume', 'assume(', 'CAS'],
  ['forget', 'forget(', 'CAS'],
  ['plot', 'plot(', 'CAS'],
  ['map', 'map (x) -> ', 'language'],
  ['sin', 'sin(', 'math'],
  ['cos', 'cos(', 'math'],
  ['PI', 'PI', 'constant'],
  ['V', 'V(', 'value']
].map(([label, insert, kind]) => ({ label, insert, kind }));

let board;
let renderTimer;
let saveTimer;
let errorLine = null;
let state = { pages: [], currentPageId: null };
let autocompleteItems = [];
let autocompleteIndex = 0;
let autocompleteToken = null;
let lastCasAnalysis = null;
const textMeasureCanvas = document.createElement('canvas');

const boardOptions = {
  boundingbox: DEFAULT_BBOX,
  axis: true,
  keepaspectratio: true,
  showCopyright: false,
  showNavigation: false,
  browserPan: false,
  pan: { enabled: true, needShift: false, needTwoFingers: false },
  zoom: { enabled: true, wheel: true, needShift: false, pinch: true, center: 'auto' },
  resize: { enabled: true, throttle: 20 }
};

function setStatus(kind, text, title = text) { status.className = kind; status.textContent = text; status.title = title; }
function newId() { return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`; }
function currentPage() { return state.pages.find((p) => p.id === state.currentPageId) || state.pages[0] || null; }
function makePage(name, source) { return { id: newId(), name, source, lastGoodSource: source, bbox: DEFAULT_BBOX.slice(), casGraphs: [] }; }

function saveState() {
  clearTimeout(saveTimer);
  saveTimer = null;
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
  catch (err) { console.warn(err); setStatus('error', 'local save failed'); }
}

function queueSaveState() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    saveState();
    updateProgramLink();
  }, SAVE_IDLE_MS);
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.pages) || !parsed.pages.length) return false;
    state = parsed;
    if (!state.pages.some((p) => p.id === state.currentPageId)) state.currentPageId = state.pages[0].id;
    return true;
  } catch (err) { console.warn(err); return false; }
}

function updateProgramLink() {
  const params = new URLSearchParams();
  params.set('new', '1');
  params.set('name', currentPage()?.name || 'Linked graph');
  params.set('code', editor.value || '');
  const graphKeys = currentPage()?.casGraphs || [];
  if (graphKeys.length) params.set('graphs', graphKeys.join(','));
  programLink.href = `${location.origin}${location.pathname}${location.search}#${params.toString()}`;
}

function linkedPageFromHash() {
  if (!location.hash || location.hash.length < 2) return null;
  const params = new URLSearchParams(location.hash.slice(1));
  if (params.get('new') !== '1' || !params.has('code')) return null;
  const page = makePage((params.get('name') || 'Linked graph').slice(0, 60), params.get('code') || '');
  page.casGraphs = (params.get('graphs') || '').split(',').filter(Boolean);
  return page;
}

function consumeLinkedPageHash() { history.replaceState(null, '', `${location.pathname}${location.search}`); }

function refreshPageControls() {
  pageSelect.replaceChildren();
  const groups = new Map();
  for (const label of ['My pages', 'Examples', 'Euclid · Postulates', 'Euclid · Common notions', 'Euclid · Book I']) {
    const group = document.createElement('optgroup');
    group.label = label;
    groups.set(label, group);
  }
  for (const page of state.pages) {
    const key = page.builtinKey || '';
    const label = key.startsWith('euclid-postulate-') ? 'Euclid · Postulates'
      : key.startsWith('euclid-common-notion-') ? 'Euclid · Common notions'
      : key.startsWith('euclid-i-') ? 'Euclid · Book I'
      : key ? 'Examples' : 'My pages';
    const option = document.createElement('option');
    option.value = page.id;
    option.textContent = page.name;
    groups.get(label).appendChild(option);
  }
  for (const group of groups.values()) {
    if (group.children.length) pageSelect.appendChild(group);
  }
  pageSelect.value = state.currentPageId;
  pageName.value = currentPage()?.name || '';
  updateProgramLink();
}

function nextPageName() {
  let n = 1;
  const used = new Set(state.pages.map((p) => p.name));
  while (used.has(`Page ${n}`)) n += 1;
  return `Page ${n}`;
}

function rememberSource(source) {
  const page = currentPage();
  if (!page) return;
  page.source = source;
  queueSaveState();
}

function rememberView() {
  const page = currentPage();
  if (!page || !board) return;
  const bbox = board.getBoundingBox();
  if (Array.isArray(bbox) && bbox.length === 4 && bbox.every(Number.isFinite)) { page.bbox = bbox.slice(); queueSaveState(); }
}

function enabledCasKeys() {
  return new Set(currentPage()?.casGraphs || []);
}

function syncCasResultsScroll() {
  casResults.scrollTop = editor.scrollTop;
}

function expandedTabs(source, size = 2) {
  let column = 0;
  let result = '';
  for (const character of source) {
    if (character !== '\t') { result += character; column += 1; continue; }
    const spaces = size - (column % size);
    result += ' '.repeat(spaces);
    column += spaces;
  }
  return result;
}

function positionCasConnectors(analysis = lastCasAnalysis) {
  if (!analysis) return;
  const context = textMeasureCanvas.getContext('2d');
  if (!context) return;
  const style = getComputedStyle(editor);
  context.font = `${style.fontSize} ${style.fontFamily}`;
  const editorLeft = editor.getBoundingClientRect().left;
  const textLeft = editorLeft + (Number.parseFloat(style.paddingLeft) || 0) - editor.scrollLeft;
  Array.from(casResultLines.children).forEach((row, lineIndex) => {
    const bubble = row.querySelector('.cas-result-bubble');
    if (!bubble) return;
    const textWidth = context.measureText(expandedTabs(analysis.lines[lineIndex] || '')).width;
    const gap = 6;
    const width = Math.max(0, bubble.getBoundingClientRect().left - textLeft - textWidth - gap);
    bubble.style.setProperty('--connector-width', `${width}px`);
  });
}

function renderCasResults(analysis) {
  lastCasAnalysis = analysis;
  const style = getComputedStyle(editor);
  const lineHeight = Number.parseFloat(style.lineHeight) || 22;
  const paddingTop = Number.parseFloat(style.paddingTop) || 0;
  const paddingBottom = Number.parseFloat(style.paddingBottom) || 0;
  const byLine = new Map(analysis.results.map((result) => [result.lineIndex, result]));
  const selected = enabledCasKeys();
  casResultLines.replaceChildren();
  casResultLines.style.setProperty('--cas-line-height', `${lineHeight}px`);
  casResultLines.style.paddingTop = `${paddingTop}px`;
  casResultLines.style.paddingBottom = `${paddingBottom}px`;

  analysis.lines.forEach((unused, lineIndex) => {
    const row = document.createElement('div');
    const result = byLine.get(lineIndex);
    row.className = `cas-result-line${result ? ' has-result' : ''}${result?.error ? ' cas-error' : ''}`;
    const bubble = document.createElement('div');
    bubble.className = 'cas-result-bubble';
    if (result?.error) {
      bubble.textContent = result.error;
      bubble.title = result.error;
      row.appendChild(bubble);
    } else if (result) {
      const formula = document.createElement('span');
      formula.className = 'cas-formula';
      formula.title = result.latex;
      katex.render(result.latex, formula, { throwOnError: false, displayMode: false, strict: false });
      bubble.appendChild(formula);
      if (result.graph) {
        const label = document.createElement('label');
        label.className = 'graph-toggle';
        label.title = result.forceGraph ? 'Graph enabled by plot() in the source' : 'Show this result on the shared graph';
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.checked = result.forceGraph || selected.has(result.key);
        input.disabled = result.forceGraph;
        input.setAttribute('aria-label', 'Graph this result');
        const switchShape = document.createElement('span');
        switchShape.className = 'graph-switch';
        const text = document.createElement('span');
        text.textContent = 'Graph';
        label.append(input, switchShape, text);
        input.addEventListener('change', () => {
          const page = currentPage();
          if (!page) return;
          const keys = new Set(page.casGraphs || []);
          if (input.checked) keys.add(result.key); else keys.delete(result.key);
          page.casGraphs = Array.from(keys);
          saveState();
          render(editor.value, page.bbox, true);
        });
        bubble.appendChild(label);
      }
      row.appendChild(bubble);
    }
    casResultLines.appendChild(row);
  });
  syncCasResultsScroll();
  positionCasConnectors(analysis);
}

function validate(code) {
  let testBoard;
  try {
    testBoard = JXG.JSXGraph.initBoard('validator', { ...boardOptions, axis: false, pan: { enabled: false }, zoom: { enabled: false }, resize: { enabled: false } });
    testBoard.jc.parse(code);
    testBoard.update();
  } finally { if (testBoard) JXG.JSXGraph.freeBoard(testBoard); }
}

async function installBuiltinExamples(selectBasics = false) {
  if ((state.builtinExamplesVersion || 0) >= BUILTIN_EXAMPLES_VERSION) return;
  const existing = new Set(state.pages.map((p) => p.builtinKey).filter(Boolean));
  let basicsId = null;
  for (const example of BUILTIN_EXAMPLES) {
    if (existing.has(example.key)) {
      const page = state.pages.find((p) => p.builtinKey === example.key);
      // Upgrade only pristine earlier built-in examples. Preserve edited pages.
      const previousHashes = example.previousSourceHashes || (example.previousSourceHash ? [example.previousSourceHash] : []);
      if (previousHashes.length && page.source === page.lastGoodSource && globalThis.crypto?.subtle) {
        const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(page.source));
        const hash = Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
        if (previousHashes.includes(hash)) {
          try {
            validate(analyzeSource(example.source, ComputeEngine).jessieSource);
            page.source = example.source;
            page.lastGoodSource = example.source;
          } catch (err) { console.warn(`Keeping previous example ${example.key}`, err); }
        }
      }
      continue;
    }
    try {
      validate(analyzeSource(example.source, ComputeEngine).jessieSource);
      const page = makePage(example.name, example.source);
      page.builtinKey = example.key;
      page.bbox = example.bbox.slice();
      state.pages.push(page);
      if (example.key === 'basics') basicsId = page.id;
    } catch (err) { console.warn(`Skipping invalid built-in example ${example.key}`, err); }
  }
  state.builtinExamplesVersion = BUILTIN_EXAMPLES_VERSION;
  if (selectBasics && basicsId) state.currentPageId = basicsId;
  saveState();
}

function parseErrorLine(message) {
  const match = String(message).match(/Parse error on line\s+(\d+)/i);
  return match ? Number(match[1]) : null;
}

function positionErrorMarker() {
  if (!errorLine) { errorMarker.style.display = 'none'; return; }
  const style = getComputedStyle(editor);
  const lineHeight = Number.parseFloat(style.lineHeight) || 22;
  const top = (Number.parseFloat(style.paddingTop) || 0) + (errorLine - 1) * lineHeight - editor.scrollTop;
  errorMarker.style.height = `${lineHeight}px`;
  errorMarker.style.top = `${top}px`;
  errorMarker.style.display = (top + lineHeight < 0 || top > editor.clientHeight) ? 'none' : 'block';
}

function clearError() {
  errorLine = null;
  errorMarker.style.display = 'none';
  hint.className = 'hint';
  hint.textContent = 'Autosaved locally · drag canvas to pan · use board controls or wheel/pinch to zoom · drag simple points to edit source';
}

function showError(err) {
  const message = err?.message || String(err);
  errorLine = parseErrorLine(message);
  positionErrorMarker();
  hint.className = 'hint error';
  hint.textContent = errorLine ? `Line ${errorLine}: ${message.split('\n')[0]}` : message.split('\n')[0];
  setStatus('error', errorLine ? `line ${errorLine}` : 'error', message);
}

function formatNumber(value) { const clean = Math.abs(value) < 1e-12 ? 0 : value; return Number(clean.toFixed(6)).toString(); }
function escapeRegex(value) { return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

function simplePointNames(code) {
  const names = new Set();
  const assignment = new RegExp(String.raw`^\s*([A-Za-z_$][\w$]*)\s*=\s*point\s*\(\s*${NUMBER}\s*,\s*${NUMBER}\s*\)\s*;?(?:\s*\/\/.*)?\s*$`);
  for (const line of code.split('\n')) { const match = line.match(assignment); if (match) names.add(match[1]); }
  return names;
}

function syncSimplePointToSource(name, x, y) {
  const escapedName = escapeRegex(name);
  const assignment = new RegExp(String.raw`^(\s*${escapedName}\s*=\s*point\s*\(\s*)(${NUMBER})(\s*,\s*)(${NUMBER})(\s*\)\s*;?(?:\s*\/\/.*)?\s*)$`);
  const lines = editor.value.split('\n');
  for (let i = 0; i < lines.length; i += 1) {
    const match = lines[i].match(assignment);
    if (!match) continue;
    lines[i] = match[1] + formatNumber(x) + match[3] + formatNumber(y) + match[5];
    const start = editor.selectionStart;
    const end = editor.selectionEnd;
    editor.value = lines.join('\n');
    editor.setSelectionRange(start, end);
    rememberSource(editor.value);
    return true;
  }
  return false;
}

function namedPoints() {
  if (!board) return [];
  return board.objectsList.filter((el) => el && (el.elType === 'point' || el.elType === 'glider') && el.name && typeof el.X === 'function' && typeof el.Y === 'function' && Number.isFinite(el.X()) && Number.isFinite(el.Y())).sort((a, b) => a.name.localeCompare(b.name));
}

function updatePointReadback() {
  const list = namedPoints();
  points.textContent = list.length ? list.map((p) => `${p.name} = (${formatNumber(p.X())}, ${formatNumber(p.Y())})`).join('\n') : 'No named points';
}

function bindSimplePointSourceSync(code) {
  const writable = simplePointNames(code);
  for (const point of namedPoints()) {
    if (!writable.has(point.name)) continue;
    point.on('drag', () => { syncSimplePointToSource(point.name, point.X(), point.Y()); updatePointReadback(); });
    point.on('up', () => { syncSimplePointToSource(point.name, point.X(), point.Y()); updatePointReadback(); });
  }
}

function makeBoard(code, bbox, casAnalysis = null) {
  if (board) JXG.JSXGraph.freeBoard(board);
  board = JXG.JSXGraph.initBoard('board', { ...boardOptions, boundingbox: Array.isArray(bbox) ? bbox : DEFAULT_BBOX });
  board.jc.parse(code);
  if (casAnalysis) drawCasGraphs(board, casAnalysis.results, enabledCasKeys(), compile);
  board.on('update', updatePointReadback);
  board.on('boundingbox', rememberView);
  board.update();
  bindSimplePointSourceSync(code);
  updatePointReadback();
}

function render(code, bbox, showErrors = true) {
  const casAnalysis = analyzeSource(code, ComputeEngine);
  renderCasResults(casAnalysis);
  try {
    validate(casAnalysis.jessieSource);
    makeBoard(casAnalysis.jessieSource, bbox, casAnalysis);
    const page = currentPage();
    if (page) { page.lastGoodSource = code; page.source = code; saveState(); }
    clearError();
    updateProgramLink();
    const casErrors = casAnalysis.results.filter((result) => result.error).length;
    setStatus(casErrors ? 'error' : 'ok', casErrors ? `${casErrors} CAS error${casErrors === 1 ? '' : 's'}` : 'saved');
    return true;
  } catch (err) {
    if (showErrors) {
      showError(err);
      console.error(err);
    }
    updateProgramLink();
    return false;
  }
}

function autocompleteActive() {
  return autocomplete.classList.contains('visible') && autocompleteItems.length > 0;
}

function deferError() {
  clearTimeout(renderTimer);
  clearError();
  setStatus('pending', 'typing…');
  renderTimer = setTimeout(() => render(editor.value, currentPage()?.bbox, true), ERROR_IDLE_MS);
}

function processEditorInput(event) {
  clearTimeout(renderTimer);
  rememberSource(editor.value);
  if (event?.inputType === 'insertFromPaste') hideAutocomplete();
  else updateAutocomplete();
  clearError();
  setStatus('pending', autocompleteActive() ? 'completing…' : 'checking…');
  renderTimer = setTimeout(() => {
    if (render(editor.value, currentPage()?.bbox, false)) return;
    deferError();
  }, INPUT_RENDER_MS);
}

function validateNow() {
  clearTimeout(renderTimer);
  render(editor.value, currentPage()?.bbox, true);
}

function showCurrentPage() {
  clearTimeout(renderTimer);
  hideAutocomplete();
  const page = currentPage();
  if (!page) return;
  editor.value = page.source || '';
  if (!render(editor.value, page.bbox) && page.lastGoodSource && page.lastGoodSource !== page.source) {
    try {
      const fallback = analyzeSource(page.lastGoodSource, ComputeEngine);
      makeBoard(fallback.jessieSource, page.bbox, fallback);
    } catch (err) { console.error(err); }
  }
  refreshPageControls();
}

function sourceSymbols() {
  const seen = new Set();
  const out = [];
  const re = /^\s*([A-Za-z_$][\w$]*)\s*=/gm;
  let match;
  while ((match = re.exec(editor.value)) !== null) {
    const label = match[1];
    if (seen.has(label)) continue;
    seen.add(label);
    out.push({ label, insert: label, kind: 'name' });
  }
  return out;
}

function tokenAtCaret() {
  if (editor.selectionStart !== editor.selectionEnd) return null;
  const caret = editor.selectionStart;
  const match = editor.value.slice(0, caret).match(/([A-Za-z_$][\w$]*)$/);
  if (!match) return null;
  return { text: match[1], start: caret - match[1].length, end: caret };
}

function hideAutocomplete() {
  autocomplete.classList.remove('visible');
  autocomplete.replaceChildren();
  autocompleteItems = [];
  autocompleteIndex = 0;
  autocompleteToken = null;
}

function drawAutocomplete() {
  autocomplete.replaceChildren();
  autocompleteItems.forEach((item, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `autocomplete-item${index === autocompleteIndex ? ' selected' : ''}`;
    button.setAttribute('role', 'option');
    button.setAttribute('aria-selected', index === autocompleteIndex ? 'true' : 'false');
    const name = document.createElement('span');
    name.className = 'autocomplete-name';
    name.textContent = item.label;
    const kind = document.createElement('span');
    kind.className = 'autocomplete-kind';
    kind.textContent = item.kind;
    button.append(name, kind);
    button.addEventListener('pointerdown', (event) => {
      event.preventDefault();
      acceptAutocomplete(index);
    });
    autocomplete.appendChild(button);
  });
  autocomplete.classList.toggle('visible', autocompleteItems.length > 0);
}

function updateAutocomplete(force = false) {
  if (document.activeElement !== editor) { hideAutocomplete(); return; }
  const token = tokenAtCaret();
  if (!token || (!force && token.text.length < 1)) { hideAutocomplete(); return; }
  const query = token.text.toLowerCase();
  const seen = new Set();
  const candidates = [...sourceSymbols(), ...AUTOCOMPLETE_WORDS]
    .filter((item) => {
      const key = item.label.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      if (force && !query) return true;
      if (!key.startsWith(query)) return false;
      return key !== query || item.insert !== item.label;
    })
    .slice(0, 7);
  autocompleteToken = token;
  autocompleteItems = candidates;
  autocompleteIndex = Math.min(autocompleteIndex, Math.max(0, candidates.length - 1));
  drawAutocomplete();
  if (candidates.length) {
    clearTimeout(renderTimer);
    clearError();
    setStatus('pending', 'completing…');
  }
}

function acceptAutocomplete(index = autocompleteIndex) {
  const item = autocompleteItems[index];
  const token = autocompleteToken;
  if (!item || !token) return;
  editor.setRangeText(item.insert, token.start, token.end, 'end');
  hideAutocomplete();
  editor.focus();
  editor.dispatchEvent(new Event('input', { bubbles: true }));
}

async function initialize() {
  const hadState = loadState();
  if (!hadState) {
    let source = '// New construction\nA = point(-2, 0);\nB = point(2, 0);\nline(A, B);\n';
    try { const response = await fetch('./construction.jessie', { cache: 'no-store' }); if (response.ok) source = await response.text(); }
    catch (err) { console.warn(err); }
    const page = makePage('Page 1', source);
    state.pages = [page];
    state.currentPageId = page.id;
    saveState();
  }
  // Repair literal HTML entities in known captions, including edited saved copies.
  // Replace only the exact original line; keep all surrounding user edits.
  for (const page of state.pages) {
    if (!Array.isArray(page.casGraphs)) page.casGraphs = [];
    for (const fix of [{"key": "euclid-postulate-05", "before": "text(-9,-5.5,'Here α + β < 180°: the lines meet on the right.') <<display:'internal',fontSize:16>>;", "after": "text(-9,-5.5,'Here α + β < 180°: the lines meet on the right.') <<display:'html',fontSize:16>>;"}, {"key": "euclid-common-notion-05", "before": "text(-9,-4,'AB = AC + CB, with CB > 0; hence AB > AC.') <<display:'internal',fontSize:16>>;", "after": "text(-9,-4,'AB = AC + CB, with CB > 0; hence AB > AC.') <<display:'html',fontSize:16>>;"}]) {
      if (page.builtinKey !== fix.key) continue;
      for (const field of ['source', 'lastGoodSource']) {
        if (typeof page[field] === 'string') page[field] = page[field].split(fix.before).join(fix.after);
      }
    }
  }
  await installBuiltinExamples(!hadState);
  const linkedPage = linkedPageFromHash();
  if (linkedPage) {
    state.pages.push(linkedPage);
    state.currentPageId = linkedPage.id;
    saveState();
    consumeLinkedPageHash();
  }
  refreshPageControls();
  showCurrentPage();
}

function setSplitFromPointer(event) {
  const rect = layout.getBoundingClientRect();
  if (window.matchMedia('(max-width: 760px)').matches) {
    const height = Math.max(43, Math.min(rect.height, event.clientY - rect.top));
    document.documentElement.style.setProperty('--editor-height', `${height}px`);
    localStorage.setItem('jessiepage-editor-height', String(height));
  } else {
    const width = Math.max(0, Math.min(rect.width, event.clientX - rect.left));
    document.documentElement.style.setProperty('--editor-width', `${width}px`);
    localStorage.setItem('jessiepage-editor-width', String(width));
  }
  if (board) board.updateContainerDims();
  positionCasConnectors();
}

async function toggleFullscreen(target) {
  try {
    const active = document.fullscreenElement || document.webkitFullscreenElement || null;
    if (active === target) {
      if (document.exitFullscreen) await document.exitFullscreen();
      else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    } else {
      if (target.requestFullscreen) await target.requestFullscreen();
      else if (target.webkitRequestFullscreen) target.webkitRequestFullscreen();
      else throw new Error('Fullscreen is not supported by this browser');
    }
  } catch (err) { setStatus('error', 'fullscreen', err?.message || String(err)); }
}

function updateFullscreenButtons() {
  const active = document.fullscreenElement || document.webkitFullscreenElement || null;
  const pageFull = active === document.documentElement;
  const canvasFull = active === boardPane;
  fullscreenButton.textContent = pageFull ? '×' : '⛶';
  fullscreenButton.title = pageFull ? 'Exit fullscreen' : 'Enter fullscreen';
  canvasFullscreen.textContent = canvasFull ? '×' : '⛶';
  canvasFullscreen.title = canvasFull ? 'Exit canvas fullscreen' : 'Canvas fullscreen';
  setTimeout(() => { if (board) board.updateContainerDims(); }, 50);
}

splitter.addEventListener('pointerdown', (event) => {
  event.preventDefault();
  splitter.classList.add('dragging');
  splitter.setPointerCapture(event.pointerId);
  const move = (e) => setSplitFromPointer(e);
  const stop = () => {
    splitter.classList.remove('dragging');
    splitter.removeEventListener('pointermove', move);
    splitter.removeEventListener('pointerup', stop);
    splitter.removeEventListener('pointercancel', stop);
  };
  splitter.addEventListener('pointermove', move);
  splitter.addEventListener('pointerup', stop);
  splitter.addEventListener('pointercancel', stop);
});

pageSelect.addEventListener('change', () => { rememberSource(editor.value); rememberView(); state.currentPageId = pageSelect.value; saveState(); showCurrentPage(); });
pageName.addEventListener('input', () => {
  const page = currentPage();
  if (!page) return;
  page.name = pageName.value || 'Untitled';
  saveState();
  const option = pageSelect.querySelector(`option[value="${CSS.escape(page.id)}"]`);
  if (option) option.textContent = page.name;
  updateProgramLink();
});
pageName.addEventListener('blur', () => {
  const page = currentPage();
  if (!page) return;
  page.name = pageName.value.trim() || 'Untitled';
  pageName.value = page.name;
  saveState();
  refreshPageControls();
});
addPage.addEventListener('click', () => {
  rememberSource(editor.value);
  rememberView();
  const page = makePage(nextPageName(), '// New construction\n');
  state.pages.push(page);
  state.currentPageId = page.id;
  saveState();
  showCurrentPage();
  pageName.focus();
  pageName.select();
});

fullscreenButton.addEventListener('click', () => toggleFullscreen(document.documentElement));
canvasFullscreen.addEventListener('click', () => toggleFullscreen(boardPane));
canvasZoomIn.addEventListener('click', () => { if (board) { board.zoomIn(); rememberView(); } });
canvasZoomOut.addEventListener('click', () => { if (board) { board.zoomOut(); rememberView(); } });
canvasReset.addEventListener('click', () => { if (board) { board.setBoundingBox(DEFAULT_BBOX, true); board.fullUpdate(); rememberView(); } });
document.addEventListener('fullscreenchange', updateFullscreenButtons);
document.addEventListener('webkitfullscreenchange', updateFullscreenButtons);

editor.addEventListener('input', processEditorInput);
editor.addEventListener('scroll', () => { positionErrorMarker(); syncCasResultsScroll(); positionCasConnectors(); });
window.addEventListener('resize', () => positionCasConnectors());
editor.addEventListener('click', () => updateAutocomplete());
editor.addEventListener('blur', () => setTimeout(() => {
  hideAutocomplete();
  validateNow();
}, 80));
editor.addEventListener('keydown', (event) => {
  if ((event.ctrlKey || event.metaKey) && event.code === 'Space') {
    event.preventDefault();
    updateAutocomplete(true);
    return;
  }
  if (!autocomplete.classList.contains('visible')) return;
  if (event.key === 'ArrowDown') {
    event.preventDefault();
    autocompleteIndex = (autocompleteIndex + 1) % autocompleteItems.length;
    drawAutocomplete();
  } else if (event.key === 'ArrowUp') {
    event.preventDefault();
    autocompleteIndex = (autocompleteIndex - 1 + autocompleteItems.length) % autocompleteItems.length;
    drawAutocomplete();
  } else if (event.key === 'Tab' || event.key === 'Enter') {
    event.preventDefault();
    acceptAutocomplete();
  } else if (event.key === 'Escape') {
    event.preventDefault();
    hideAutocomplete();
    if (!render(editor.value, currentPage()?.bbox, false)) deferError();
  }
});

const savedWidth = Number(localStorage.getItem('jessiepage-editor-width'));
const savedHeight = Number(localStorage.getItem('jessiepage-editor-height'));
if (Number.isFinite(savedWidth) && savedWidth >= 0) document.documentElement.style.setProperty('--editor-width', `${savedWidth}px`);
if (Number.isFinite(savedHeight) && savedHeight >= 43) document.documentElement.style.setProperty('--editor-height', `${savedHeight}px`);

initialize();
