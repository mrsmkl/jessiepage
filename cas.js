const CAS_CALLS = new Set(['simplify', 'expand', 'differentiate', 'solve', 'plot']);
const JESSIE_CALL = /\b(?:point|line|segment|circle|polygon|midpoint|intersection|perpendicular|circumcircle|glider|tangent|slider|functiongraph|curve|text|angle|map|V)\s*\(/;

function splitArguments(source) {
  const parts = [];
  let start = 0;
  let depth = 0;
  let quote = '';
  for (let i = 0; i < source.length; i += 1) {
    const char = source[i];
    if (quote) {
      if (char === quote && source[i - 1] !== '\\') quote = '';
      continue;
    }
    if (char === '"' || char === "'") { quote = char; continue; }
    if ('([{'.includes(char)) depth += 1;
    else if (')]}'.includes(char)) depth -= 1;
    else if (char === ',' && depth === 0) { parts.push(source.slice(start, i).trim()); start = i + 1; }
  }
  parts.push(source.slice(start).trim());
  return parts.filter(Boolean);
}

function callFromLine(source) {
  const match = source.match(/^([A-Za-z][\w]*)\s*\(([\s\S]*)\)$/);
  if (!match || !CAS_CALLS.has(match[1].toLowerCase())) return null;
  return { name: match[1].toLowerCase(), args: splitArguments(match[2]) };
}

function isCasLine(line) {
  const source = line.trim();
  if (!source || source.startsWith('//')) return false;
  if (/^(?:\$board|for|if|while)\b/.test(source) || /;|<<|\.glide\s*\(/.test(source)) return false;
  if (JESSIE_CALL.test(source) || /['"]/.test(source)) return false;
  const assignment = source.match(/^([A-Za-z_$][\w$]*)\s*=\s*(?!=)(.+)$/);
  return Boolean(assignment || callFromLine(source) || /^[\dA-Za-z_+\-*/^().,=\[\]\s]+$/.test(source));
}

function hasMathError(json) {
  if (!Array.isArray(json)) return false;
  if (json[0] === 'Error') return true;
  return json.some(hasMathError);
}

function numberValue(expression) {
  const value = expression.N().valueOf();
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function pointValues(expression, engine) {
  const json = expression.json;
  if (!Array.isArray(json)) return [];
  const [operator, ...items] = json;
  const collection = ['List', 'Set', 'Tuple'].includes(operator) ? items : [];
  if (!collection.length) return [];

  const pairs = collection.map((item) => {
    if (!Array.isArray(item) || !['List', 'Tuple', 'Pair'].includes(item[0]) || item.length !== 3) return null;
    const x = numberValue(engine.box(item[1]));
    const y = numberValue(engine.box(item[2]));
    return x === null || y === null ? null : [x, y];
  });
  if (pairs.every(Boolean)) return pairs;

  const values = collection.map((item) => numberValue(engine.box(item)));
  return values.every((value) => value !== null) ? values.map((value) => [value, 0]) : [];
}

function graphFor(expression, engine, preferredVariable = '') {
  const coordinates = pointValues(expression, engine);
  if (coordinates.length) return { kind: 'points', coordinates };
  if (['Equal', 'NotEqual', 'Less', 'LessEqual', 'Greater', 'GreaterEqual'].includes(expression.operator)) return null;
  const variables = Array.from(expression.unknowns || expression.freeVariables || []);
  if (variables.length !== 1) return null;
  const variable = preferredVariable || variables[0];
  const hasNumericSample = [0, 1, -1].some((value) => numberValue(expression.subs({ [variable]: value })) !== null);
  if (!hasNumericSample) return null;
  return { kind: 'function', variable, expression };
}

function resolveExpression(source, engine, definitions) {
  if (/^[A-Za-z_$][\w$]*$/.test(source.trim()) && definitions.has(source.trim())) return definitions.get(source.trim());
  const expression = engine.parse(source);
  if (hasMathError(expression.json)) throw new Error('Could not read this expression');
  return expression.evaluate();
}

function evaluateLine(source, engine, definitions, lineIndex) {
  const assignment = source.match(/^([A-Za-z_$][\w$]*)\s*=\s*(?!=)(.+)$/);
  const name = assignment?.[1] || '';
  const body = assignment?.[2]?.trim() || source;
  const call = callFromLine(body);
  let expression;
  let latex;
  let graph = null;
  let forceGraph = false;

  if (call?.name === 'solve') {
    if (!call.args[0]) throw new Error('solve() needs an expression');
    const variable = call.args[1]?.trim() || 'x';
    const input = resolveExpression(call.args[0], engine, definitions);
    const equation = input.operator === 'Equal' ? input : engine.box(['Equal', input, 0]);
    const solutions = equation.solve(variable).sort((a, b) => {
      const aValue = numberValue(a);
      const bValue = numberValue(b);
      return aValue === null || bValue === null ? 0 : aValue - bValue;
    });
    expression = engine.box(['Set', ...solutions]);
    latex = `\\left\\{${solutions.map((item) => item.latex).join(',')}\\right\\}`;
    const coordinates = solutions.map(numberValue);
    if (coordinates.length && coordinates.every((value) => value !== null)) {
      graph = { kind: 'points', coordinates: coordinates.map((value) => [value, 0]) };
    }
  } else {
    const input = call ? resolveExpression(call.args[0] || '', engine, definitions) : resolveExpression(body, engine, definitions);
    if (call?.name === 'simplify') expression = input.simplify();
    else if (call?.name === 'expand') expression = engine.box(['Expand', input]).evaluate();
    else if (call?.name === 'differentiate') expression = engine.box(['D', input, call.args[1]?.trim() || 'x']).evaluate();
    else expression = input;
    forceGraph = call?.name === 'plot';
    latex = expression.latex;
    graph = graphFor(expression, engine, call?.name === 'differentiate' ? call.args[1]?.trim() : '');
  }

  if (name) {
    definitions.set(name, expression);
    engine.assign(name, expression);
  }
  return {
    lineIndex,
    key: name ? `name:${name}` : `line:${lineIndex}`,
    latex,
    graph,
    forceGraph
  };
}

export function analyzeSource(source, ComputeEngine) {
  const engine = new ComputeEngine();
  const definitions = new Map();
  const lines = source.split('\n');
  const results = [];
  const jessieLines = lines.slice();
  lines.forEach((line, lineIndex) => {
    if (!isCasLine(line)) return;
    jessieLines[lineIndex] = '';
    try { results.push(evaluateLine(line.trim(), engine, definitions, lineIndex)); }
    catch (error) {
      results.push({ lineIndex, key: `line:${lineIndex}`, error: error?.message || String(error), graph: null, forceGraph: false });
    }
  });
  return { source, lines, jessieSource: jessieLines.join('\n'), results };
}

export function drawCasGraphs(board, results, enabledKeys) {
  const colors = ['#2563eb', '#d97706', '#7c3aed', '#0f8b6d', '#c2416c', '#475569'];
  let colorIndex = 0;
  results.forEach((result) => {
    if (!result.graph || (!result.forceGraph && !enabledKeys.has(result.key))) return;
    const color = colors[colorIndex % colors.length];
    colorIndex += 1;
    if (result.graph.kind === 'points') {
      result.graph.coordinates.forEach(([x, y], index) => board.create('point', [x, y], {
        name: result.graph.coordinates.length > 1 ? `${index + 1}` : '',
        size: 3,
        strokeColor: color,
        fillColor: color
      }));
      return;
    }
    const { expression, variable } = result.graph;
    board.create('functiongraph', [(x) => {
      try {
        const value = expression.subs({ [variable]: x }).N().valueOf();
        return typeof value === 'number' && Number.isFinite(value) ? value : NaN;
      } catch { return NaN; }
    }], { strokeColor: color, strokeWidth: 3 });
  });
}
