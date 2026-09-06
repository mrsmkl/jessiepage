const CAS_CALLS = new Set([
  'simplify', 'expand', 'differentiate', 'solve', 'plot',
  'factor', 'together', 'evaluate', 'numeric', 'substitute', 'integrate', 'limit', 'sum', 'product',
  'determinant', 'inverse', 'transpose', 'eigenvalues',
  'range', 'map', 'zip', 'assume', 'forget'
]);
const JESSIE_CALL = /\b(?:point|line|segment|circle|polygon|midpoint|intersection|perpendicular|circumcircle|glider|tangent|slider|functiongraph|curve|text|angle|map|V)\s*\(/;
const PLAIN_MATH_FUNCTION = /(^|[^\\A-Za-z])(arcsinh|arccosh|arctanh|arcsin|arccos|arctan|sinh|cosh|tanh|sqrt|floor|ceil|sin|cos|tan|cot|sec|csc|log|ln|exp|abs)\s*\(/g;

function normalizePlainPowers(source) {
  let result = '';
  for (let index = 0; index < source.length; index += 1) {
    const character = source[index];
    if (character !== '^' || source[index + 1] === '{') { result += character; continue; }
    let cursor = index + 1;
    if (source[cursor] === '(') {
      let depth = 1;
      let end = cursor + 1;
      while (end < source.length && depth) {
        if (source[end] === '(') depth += 1;
        else if (source[end] === ')') depth -= 1;
        end += 1;
      }
      if (!depth) {
        result += `^{${source.slice(cursor + 1, end - 1)}}`;
        index = end - 1;
        continue;
      }
    }
    if (source[cursor] === '\\') {
      const command = source.slice(cursor).match(/^\\[A-Za-z]+/);
      const open = command ? cursor + command[0].length : -1;
      if (command && source[open] === '(') {
        let depth = 1;
        let end = open + 1;
        while (end < source.length && depth) {
          if (source[end] === '(') depth += 1;
          else if (source[end] === ')') depth -= 1;
          end += 1;
        }
        if (!depth) {
          result += `^{${source.slice(cursor, end)}}`;
          index = end - 1;
          continue;
        }
      }
    }
    const match = source.slice(cursor).match(/^[-+]?(?:(?:\d+(?:\.\d*)?|\.\d+)|[A-Za-z_$][\w$]*)/);
    if (match) {
      result += `^{${match[0]}}`;
      index += match[0].length;
    } else result += character;
  }
  return result;
}

function normalizeMathSource(source) {
  const named = source
    .replace(PLAIN_MATH_FUNCTION, (match, prefix, name) => `${prefix}\\${name}(`)
    .replace(/(^|[^\\A-Za-z])pi(?=$|[^A-Za-z])/gi, '$1\\pi')
    .replace(/(^|[^\\A-Za-z])true(?=$|[^A-Za-z])/gi, '$1\\mathrm{True}')
    .replace(/(^|[^\\A-Za-z])false(?=$|[^A-Za-z])/gi, '$1\\mathrm{False}');
  return normalizePlainPowers(named);
}

function displayLatex(latex) {
  return String(latex || '')
    .replaceAll('\\exponentialE', '\\mathrm{e}')
    .replaceAll('\\imaginaryI', '\\mathrm{i}');
}

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

function casSourceFromLine(line) {
  const source = line.trim();
  if (!source || source.startsWith('//')) return null;
  if (/^[{}]$/.test(source)) return null;
  if (/^(?:\$board|for|if|while)\b/.test(source) || /<<|\.glide\s*\(/.test(source)) return null;
  const terminatedAssignment = source.match(/^([A-Za-z_$][\w$]*)\s*=\s*(?!=)([^;]+?)\s*;\s*(?:\/\/.*)?$/);
  const terminatedBody = terminatedAssignment?.[2] || '';
  if (terminatedAssignment && terminatedBody.trim() && !/[\[\]{}]/.test(terminatedBody)
      && !JESSIE_CALL.test(source) && !/['"]/.test(source)) {
    return `${terminatedAssignment[1]} = ${terminatedAssignment[2].trim()}`;
  }
  if (/;/.test(source)) return null;
  const assignment = source.match(/^([A-Za-z_$][\w$]*)\s*=\s*(?!=)(.+)$/);
  const body = assignment?.[2]?.trim() || source;
  if (callFromLine(body)) return source;
  if (JESSIE_CALL.test(source) || /['"]/.test(source)) return null;
  return assignment || /^[\dA-Za-z_+\-*/^().,=<>\\{}\[\]|\s]+$/.test(source) ? source : null;
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

function complexValue(expression, engine) {
  const json = expression.N().json;
  if (!Array.isArray(json) || json[0] !== 'Complex' || json.length !== 3) return null;
  const real = numberValue(engine.box(json[1]));
  const imaginary = numberValue(engine.box(json[2]));
  return real === null || imaginary === null ? null : [real, imaginary];
}

function collectionItems(expression, engine) {
  const json = expression.json;
  if (!Array.isArray(json) || !['List', 'Set', 'Tuple'].includes(json[0])) return null;
  return json.slice(1).map((item) => engine.box(item));
}

function matrixLatex(expression, engine) {
  const json = expression.json;
  if (!Array.isArray(json) || json[0] !== 'List' || json.length < 2) return '';
  const rows = json.slice(1);
  if (!rows.every((row) => Array.isArray(row) && row[0] === 'List')) return '';
  const width = rows[0].length;
  if (width < 2 || !rows.every((row) => row.length === width)) return '';
  return `\\begin{bmatrix}${rows.map((row) => row.slice(1).map((item) => engine.box(item).latex).join('&')).join('\\\\')}\\end{bmatrix}`;
}

function pointValues(expression, engine) {
  const json = expression.json;
  if (!Array.isArray(json)) return [];
  const [operator, ...items] = json;
  if (['Tuple', 'Pair'].includes(operator) && items.length === 2) {
    const x = numberValue(engine.box(items[0]));
    const y = numberValue(engine.box(items[1]));
    if (x !== null && y !== null) return [[x, y]];
  }
  const collection = ['List', 'Set', 'Tuple'].includes(operator) ? items : [];
  if (!collection.length) return [];

  if (operator === 'List' && collection.every((item) => Array.isArray(item) && item[0] === 'List')) return [];
  const pairs = collection.map((item) => {
    if (!Array.isArray(item) || !['List', 'Tuple', 'Pair'].includes(item[0]) || item.length !== 3) return null;
    const x = numberValue(engine.box(item[1]));
    const y = numberValue(engine.box(item[2]));
    return x === null || y === null ? null : [x, y];
  });
  return pairs.every(Boolean) ? pairs : [];
}

function jessieValue(expression, engine) {
  const value = numberValue(expression);
  if (value !== null) return Number(value.toPrecision(15)).toString();
  if (expression.json === true || expression.json === false) return String(expression.json);
  const json = expression.json;
  if (!Array.isArray(json) || !['List', 'Set', 'Tuple'].includes(json[0])) return '';
  const items = json.slice(1).map((item) => jessieValue(engine.box(item), engine));
  return items.every(Boolean) ? `[${items.join(',')}]` : '';
}

function geometryDefinitionFromLine(line, engine, definitions) {
  const alias = line.trim().match(/^([A-Za-z_$][\w$]*)\s*=\s*([A-Za-z_$][\w$]*)\s*;\s*(?:\/\/.*)?$/);
  if (alias && definitions.has(alias[2])) {
    const value = definitions.get(alias[2]);
    const json = value.json;
    const isGeometry = (Array.isArray(json) && ['Tuple', 'Pair'].includes(json[0]) && json.length === 3)
      || ['Equal', 'NotEqual', 'Less', 'LessEqual', 'Greater', 'GreaterEqual'].includes(value.operator);
    if (isGeometry) {
      definitions.set(alias[1], value);
      engine.assign(alias[1], value);
      return true;
    }
  }
  const match = line.trim().match(/^([A-Za-z_$][\w$]*)\s*=\s*(point|line|segment|circle|functiongraph)\s*\(([\s\S]*?)\)\s*(?:<<[\s\S]*>>)?\s*;?\s*(?:\/\/.*)?$/i);
  if (!match) return false;
  const [, name, rawKind, rawArguments] = match;
  const kind = rawKind.toLowerCase();
  const args = splitArguments(rawArguments);
  const coordinates = (source) => {
    const json = definitions.get(source.trim())?.json;
    if (!Array.isArray(json) || json[0] !== 'Tuple' || json.length !== 3) return null;
    const x = numberValue(engine.box(json[1]));
    const y = numberValue(engine.box(json[2]));
    return x === null || y === null ? null : [x, y];
  };
  let expression;

  if (kind === 'point' && args.length >= 2) {
    const x = numberValue(resolveExpression(args[0], engine, definitions));
    const y = numberValue(resolveExpression(args[1], engine, definitions));
    if (x !== null && y !== null) expression = engine.box(['Tuple', x, y]);
  } else if (['line', 'segment'].includes(kind) && args.length >= 2) {
    const a = coordinates(args[0]);
    const b = coordinates(args[1]);
    if (a && b && (a[0] !== b[0] || a[1] !== b[1])) {
      const xCoefficient = a[1] - b[1];
      const yCoefficient = b[0] - a[0];
      expression = engine.box(['Equal',
        ['Add', ['Multiply', xCoefficient, 'x'], ['Multiply', yCoefficient, 'y']],
        xCoefficient * a[0] + yCoefficient * a[1]
      ]).evaluate();
    }
  } else if (kind === 'circle' && args.length >= 2) {
    const center = coordinates(args[0]);
    const through = coordinates(args[1]);
    const radius = through ? Math.hypot(through[0] - center?.[0], through[1] - center?.[1])
      : numberValue(resolveExpression(args[1], engine, definitions));
    if (center && radius !== null) {
      expression = engine.box(['Equal',
        ['Add', ['Power', ['Subtract', 'x', center[0]], 2], ['Power', ['Subtract', 'y', center[1]], 2]],
        radius ** 2
      ]).evaluate();
    }
  } else if (kind === 'functiongraph' && args.length) {
    const quoted = args[0].match(/^(['"])([\s\S]*)\1$/);
    if (quoted) expression = engine.box(['Equal', 'y', resolveExpression(quoted[2], engine, definitions)]).evaluate();
  }

  if (!expression) return false;
  definitions.set(name, expression);
  engine.assign(name, expression);
  return true;
}

function graphFor(expression, engine, preferredVariable = '') {
  const complex = complexValue(expression, engine);
  if (complex && complex[1] !== 0) return { kind: 'points', coordinates: [complex] };
  const coordinates = pointValues(expression, engine);
  if (coordinates.length) return { kind: 'points', coordinates };
  if (['Equal', 'NotEqual', 'Less', 'LessEqual', 'Greater', 'GreaterEqual'].includes(expression.operator)) return null;
  const variables = Array.from(expression.unknowns || expression.freeVariables || []);
  if (variables.length !== 1) return null;
  const variable = preferredVariable || variables[0];
  return { kind: 'function', variable, expression };
}

function boundVariables(source) {
  const names = new Set();
  for (const match of source.matchAll(/\\(?:sum|prod)_\{\s*([A-Za-z_$][\w$]*)\s*=/g)) names.add(match[1]);
  return names;
}

function resolveExpression(source, engine, definitions, excludedNames = new Set()) {
  const trimmed = source.trim();
  const nestedCall = callFromLine(trimmed);
  if (nestedCall) {
    if (['assume', 'forget', 'plot'].includes(nestedCall.name)) throw new Error(`${nestedCall.name}() cannot be nested`);
    return evaluateLine(trimmed, engine, definitions, -1, true).expression;
  }
  const excluded = new Set([...excludedNames, ...boundVariables(source)]);
  if (/^[A-Za-z_$][\w$]*$/.test(trimmed) && definitions.has(trimmed) && !excluded.has(trimmed)) return definitions.get(trimmed);
  let expandedSource = source;
  for (const [name, value] of [...definitions].sort(([a], [b]) => b.length - a.length)) {
    if (excluded.has(name)) continue;
    const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    expandedSource = expandedSource.replace(new RegExp(`(^|[^A-Za-z0-9_$])${escaped}(?=$|[^A-Za-z0-9_$])`, 'g'), `$1(${value.latex})`);
  }
  const expression = engine.parse(normalizeMathSource(expandedSource));
  if (hasMathError(expression.json)) throw new Error('Could not read this expression');
  return expression.evaluate();
}

function evaluateLine(source, engine, definitions, lineIndex, nested = false) {
  const assignment = source.match(/^([A-Za-z_$][\w$]*)\s*=\s*(?!=)(.+)$/);
  const name = assignment?.[1] || '';
  const body = assignment?.[2]?.trim() || source;
  const call = callFromLine(body);
  let expression;
  let latex;
  let graph = null;
  let forceGraph = false;

  if (call?.name === 'assume') {
    if (call.args.length !== 1) throw new Error('assume() needs one condition');
    const condition = resolveExpression(call.args[0], engine, definitions);
    const status = engine.assume(condition);
    if (status === 'contradiction') throw new Error('This contradicts an earlier assumption');
    if (status === 'not-a-predicate') throw new Error('assume() needs a condition such as x > 0');
    expression = engine.box(true);
    latex = status === 'tautology' ? '\\text{already assumed}' : '\\text{assumed}';
  } else if (call?.name === 'forget') {
    if (call.args.length !== 1 || !/^[A-Za-z_$][\w$]*$/.test(call.args[0].trim())) {
      throw new Error('forget() needs one variable name');
    }
    const variable = call.args[0].trim();
    engine.forget(variable);
    definitions.delete(variable);
    expression = engine.box(true);
    latex = `\\text{forgot }${variable}`;
  } else if (call?.name === 'range') {
    if (call.args.length < 2 || call.args.length > 3) throw new Error('range() needs start, end and optional step');
    const start = numberValue(resolveExpression(call.args[0], engine, definitions));
    const end = numberValue(resolveExpression(call.args[1], engine, definitions));
    const step = call.args[2] ? numberValue(resolveExpression(call.args[2], engine, definitions)) : 1;
    if (start === null || end === null || step === null || step === 0) throw new Error('range() needs finite numbers and a nonzero step');
    const values = [];
    const movingForward = step > 0;
    for (let index = 0; index <= 1000; index += 1) {
      const value = start + index * step;
      if ((movingForward && value > end + Math.abs(step) * 1e-12) || (!movingForward && value < end - Math.abs(step) * 1e-12)) break;
      values.push(engine.box(value));
    }
    if (values.length > 1000) throw new Error('range() is limited to 1000 values');
    expression = engine.box(['List', ...values]);
    latex = expression.latex;
  } else if (call?.name === 'map') {
    if (![2, 3].includes(call.args.length)) throw new Error('map() needs expression, optional variable, and values');
    const input = resolveExpression(call.args[0], engine, definitions);
    const variable = call.args.length === 3 ? call.args[1].trim() : Array.from(input.unknowns || input.freeVariables || [])[0];
    if (!variable) throw new Error('map() could not determine the expression variable');
    const values = collectionItems(resolveExpression(call.args.at(-1), engine, definitions), engine);
    if (!values) throw new Error('map() needs a list, set or tuple of values');
    expression = engine.box(['List', ...values.map((value) => input.subs({ [variable]: value }).evaluate())]);
    latex = expression.latex;
  } else if (call?.name === 'zip') {
    if (call.args.length !== 2) throw new Error('zip() needs two collections');
    const xs = collectionItems(resolveExpression(call.args[0], engine, definitions), engine);
    const ys = collectionItems(resolveExpression(call.args[1], engine, definitions), engine);
    if (!xs || !ys) throw new Error('zip() needs two lists, sets or tuples');
    if (xs.length !== ys.length) throw new Error('zip() collections must have the same length');
    expression = engine.box(['List', ...xs.map((x, index) => ['Tuple', x, ys[index]])]);
    latex = expression.latex;
    const coordinates = xs.map((x, index) => [numberValue(x), numberValue(ys[index])]);
    if (coordinates.every(([x, y]) => x !== null && y !== null)) graph = { kind: 'points', coordinates };
  } else if (['determinant', 'inverse', 'transpose', 'eigenvalues'].includes(call?.name)) {
    if (call.args.length !== 1) throw new Error(`${call.name}() needs one matrix`);
    const input = resolveExpression(call.args[0], engine, definitions);
    const operator = {
      determinant: 'Determinant', inverse: 'Inverse', transpose: 'Transpose', eigenvalues: 'Eigenvalues'
    }[call.name];
    expression = engine.box([operator, input]).evaluate();
    latex = expression.latex;
  } else if (call?.name === 'solve') {
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
  } else if (call?.name === 'substitute') {
    if (call.args.length !== 3) throw new Error('substitute() needs an expression, variable and value');
    const input = resolveExpression(call.args[0], engine, definitions);
    const variable = call.args[1].trim();
    const replacement = resolveExpression(call.args[2], engine, definitions);
    expression = input.subs({ [variable]: replacement }).evaluate();
    latex = expression.latex;
    const x = numberValue(replacement);
    const y = numberValue(expression);
    graph = x === null || y === null ? graphFor(expression, engine) : { kind: 'points', coordinates: [[x, y]] };
  } else if (call?.name === 'integrate') {
    if (![2, 4].includes(call.args.length)) throw new Error('integrate() needs expression, variable, and optional lower and upper bounds');
    const input = resolveExpression(call.args[0], engine, definitions);
    const variable = call.args[1].trim();
    if (call.args.length >= 4) {
      const lower = resolveExpression(call.args[2], engine, definitions);
      const upper = resolveExpression(call.args[3], engine, definitions);
      expression = engine.box(['Integrate', input, ['Tuple', variable, lower, upper]]).evaluate();
    } else {
      expression = engine.box(['Integrate', input, variable]).evaluate();
      graph = graphFor(expression, engine, variable);
    }
    latex = expression.latex;
  } else if (['sum', 'product'].includes(call?.name)) {
    if (call.args.length !== 4) throw new Error(`${call.name}() needs expression, variable, lower and upper bounds`);
    const variable = call.args[1].trim();
    if (!/^[A-Za-z_$][\w$]*$/.test(variable)) throw new Error(`${call.name}() needs a variable name`);
    const savedVariable = definitions.get(variable);
    engine.forget(variable);
    let input;
    try { input = resolveExpression(call.args[0], engine, definitions, new Set([variable])); }
    finally { if (savedVariable) engine.assign(variable, savedVariable); }
    const lower = resolveExpression(call.args[2], engine, definitions);
    const upper = resolveExpression(call.args[3], engine, definitions);
    const operator = call.name === 'sum' ? 'Sum' : 'Product';
    expression = engine.box([operator, input, ['Tuple', variable, lower, upper]]).evaluate();
    latex = expression.latex;
    graph = graphFor(expression, engine);
  } else if (call?.name === 'limit') {
    if (call.args.length !== 3) throw new Error('limit() needs an expression, variable and value');
    const input = resolveExpression(call.args[0], engine, definitions);
    const variable = call.args[1].trim();
    const at = resolveExpression(call.args[2], engine, definitions);
    expression = engine.box(['Limit', input, variable, at]).evaluate();
    latex = expression.latex;
    const x = numberValue(at);
    const y = numberValue(expression);
    if (x !== null && y !== null) graph = { kind: 'points', coordinates: [[x, y]], open: true };
  } else {
    const input = call ? resolveExpression(call.args[0] || '', engine, definitions) : resolveExpression(body, engine, definitions);
    if (call?.name === 'simplify') expression = input.simplify();
    else if (call?.name === 'expand') expression = engine.box(['Expand', input]).evaluate();
    else if (call?.name === 'differentiate') expression = engine.box(['D', input, call.args[1]?.trim() || 'x']).evaluate();
    else if (call?.name === 'factor') expression = engine.box(['Factor', input, ...(call.args[1] ? [call.args[1].trim()] : [])]).evaluate();
    else if (call?.name === 'together') expression = engine.box(['Together', input]).evaluate();
    else if (call?.name === 'evaluate') expression = input.evaluate();
    else if (call?.name === 'numeric') {
      const oldPrecision = engine.precision;
      const requestedPrecision = Number(call.args[1]);
      if (call.args[1] && (!Number.isInteger(requestedPrecision) || requestedPrecision < 2 || requestedPrecision > 1000)) {
        throw new Error('numeric() precision must be an integer from 2 to 1000');
      }
      try {
        if (call.args[1]) engine.precision = requestedPrecision;
        expression = input.N();
        latex = expression.latex;
      } finally { engine.precision = oldPrecision; }
    }
    else expression = input;
    forceGraph = call?.name === 'plot';
    if (!latex) latex = expression.latex;
    const preferredVariable = ['differentiate', 'factor'].includes(call?.name) ? call.args[1]?.trim() : '';
    graph = graphFor(expression, engine, preferredVariable);
  }

  latex = displayLatex(matrixLatex(expression, engine) || latex);
  if (name) {
    definitions.set(name, expression);
    engine.assign(name, expression);
  }
  const sharedValue = name ? jessieValue(expression, engine) : '';
  return {
    lineIndex,
    key: name ? `name:${name}` : `line:${lineIndex}`,
    latex,
    graph,
    forceGraph,
    expression,
    jessieDefinition: sharedValue ? `${name} = ${sharedValue};` : ''
  };
}

function stableHash(value) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36);
}

function visibleStructure(line, state) {
  let visible = '';
  let quote = '';
  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    const next = line[index + 1];
    if (state.blockComment) {
      if (character === '*' && next === '/') { state.blockComment = false; index += 1; }
      continue;
    }
    if (quote) {
      if (character === quote && line[index - 1] !== '\\') quote = '';
      visible += ' ';
      continue;
    }
    if (character === '/' && next === '*') { state.blockComment = true; index += 1; continue; }
    if (character === '/' && next === '/') break;
    if (character === '"' || character === "'") { quote = character; visible += ' '; continue; }
    visible += character;
  }
  return visible;
}

export function analyzeSource(source, ComputeEngine) {
  const engine = new ComputeEngine();
  const definitions = new Map();
  const lines = source.split('\n');
  const results = [];
  const jessieLines = lines.slice();
  const structure = { blockComment: false, depth: 0 };
  const keyCounts = new Map();
  lines.forEach((line, lineIndex) => {
    const visible = visibleStructure(line, structure);
    const topLevel = structure.depth === 0;
    const opens = (visible.match(/\{/g) || []).length;
    const closes = (visible.match(/\}/g) || []).length;
    structure.depth = Math.max(0, structure.depth + opens - closes);
    let geometryLine = false;
    try { if (topLevel) geometryLine = geometryDefinitionFromLine(line, engine, definitions); }
    catch { /* Dynamic Jessie constructions do not need a CAS representation. */ }
    const casSource = topLevel && visible.trim() && !geometryLine ? casSourceFromLine(line) : null;
    if (casSource === null) {
      return;
    }
    jessieLines[lineIndex] = '';
    const assignment = casSource.match(/^([A-Za-z_$][\w$]*)\s*=\s*(?!=)/);
    const baseKey = assignment ? `name:${assignment[1]}` : `expr:${stableHash(casSource.replace(/\s+/g, ' ').trim())}`;
    const occurrence = (keyCounts.get(baseKey) || 0) + 1;
    keyCounts.set(baseKey, occurrence);
    const key = occurrence === 1 ? baseKey : `${baseKey}:${occurrence}`;
    try {
      const result = evaluateLine(casSource, engine, definitions, lineIndex);
      result.key = key;
      delete result.expression;
      results.push(result);
      jessieLines[lineIndex] = result.jessieDefinition;
    }
    catch (error) {
      results.push({ lineIndex, key, error: error?.message || String(error), graph: null, forceGraph: false });
    }
  });
  return { source, lines, jessieSource: jessieLines.join('\n'), results };
}

export function drawCasGraphs(board, results, enabledKeys, compileExpression) {
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
        fillColor: result.graph.open ? '#fff' : color,
        fixed: true
      }));
      return;
    }
    const { expression, variable } = result.graph;
    let compiledRun = null;
    try {
      const compiled = compileExpression?.(expression);
      if (compiled?.success && typeof compiled.run === 'function') compiledRun = compiled.run;
    } catch { /* Fall back to symbolic substitution for unsupported expressions. */ }
    board.create('functiongraph', [(x) => {
      try {
        const value = compiledRun ? compiledRun({ [variable]: x }) : expression.subs({ [variable]: x }).N().valueOf();
        return typeof value === 'number' && Number.isFinite(value) ? value : NaN;
      } catch { return NaN; }
    }], { strokeColor: color, strokeWidth: 3 });
  });
}
