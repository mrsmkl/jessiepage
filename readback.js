const NUMBER = String.raw`[-+]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][-+]?\d+)?`;

export function formatNumber(value) {
  const clean = Math.abs(value) < 1e-12 ? 0 : value;
  return Number(clean.toFixed(6)).toString();
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function simplePointNames(code) {
  const names = new Set();
  const assignment = new RegExp(String.raw`^\s*([A-Za-z_$][\w$]*)\s*=\s*point\s*\(\s*${NUMBER}\s*,\s*${NUMBER}\s*\)\s*;?(?:\s*\/\/.*)?\s*$`);
  for (const line of code.split('\n')) {
    const match = line.match(assignment);
    if (match) names.add(match[1]);
  }
  return names;
}

export function replaceSimplePointCoordinates(code, name, x, y) {
  const escapedName = escapeRegex(name);
  const assignment = new RegExp(String.raw`^(\s*${escapedName}\s*=\s*point\s*\(\s*)(${NUMBER})(\s*,\s*)(${NUMBER})(\s*\)\s*;?(?:\s*\/\/.*)?\s*)$`);
  const lines = code.split('\n');
  const index = lines.findIndex((line) => assignment.test(line));
  if (index < 0) return null;
  const match = lines[index].match(assignment);
  lines[index] = match[1] + formatNumber(x) + match[3] + formatNumber(y) + match[5];
  return lines.join('\n');
}

export function simpleTextPositions(code) {
  const positions = [];
  const literal = new RegExp(String.raw`^(\s*(?:[A-Za-z_$][\w$]*\s*=\s*)?text\s*\(\s*)(${NUMBER})(\s*,\s*)(${NUMBER})(\s*,.*)$`);
  let braceDepth = 0;
  let blockComment = false;
  code.split('\n').forEach((line, lineIndex) => {
    let visible = '';
    let quote = '';
    for (let index = 0; index < line.length; index += 1) {
      const character = line[index];
      const next = line[index + 1];
      if (blockComment) {
        if (character === '*' && next === '/') { blockComment = false; index += 1; }
        continue;
      }
      if (quote) {
        if (character === quote && line[index - 1] !== '\\') quote = '';
        visible += ' ';
        continue;
      }
      if (character === '/' && next === '*') { blockComment = true; index += 1; continue; }
      if (character === '/' && next === '/') break;
      if (character === '"' || character === "'") { quote = character; visible += ' '; continue; }
      visible += character;
    }
    const match = braceDepth === 0 ? line.match(literal) : null;
    const calls = visible.match(/(?:^|;)\s*(?:[A-Za-z_$][\w$]*\s*=\s*)?text\s*\(/g) || [];
    if (calls.length === 1 && match) positions.push({
      lineIndex,
      x: Number(match[2]),
      y: Number(match[4]),
      head: match[1],
      separator: match[3],
      tail: match[5]
    });
    braceDepth = Math.max(0, braceDepth + (visible.match(/\{/g) || []).length - (visible.match(/\}/g) || []).length);
  });
  return positions;
}

export function replaceSimpleTextCoordinates(code, position, x, y) {
  const literal = new RegExp(String.raw`^(\s*(?:[A-Za-z_$][\w$]*\s*=\s*)?text\s*\(\s*)(${NUMBER})(\s*,\s*)(${NUMBER})(\s*,.*)$`);
  const lines = code.split('\n');
  const lineIndex = typeof position === 'number' ? position : position?.lineIndex;
  const match = lines[lineIndex]?.match(literal);
  if (!match) return null;
  if (typeof position === 'object' && (
    match[1] !== position.head || match[3] !== position.separator || match[5] !== position.tail
  )) return null;
  lines[lineIndex] = match[1] + formatNumber(x) + match[3] + formatNumber(y) + match[5];
  return lines.join('\n');
}
