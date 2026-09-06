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
  let objectIndex = 0;
  code.split('\n').forEach((line, lineIndex) => {
    const calls = line.match(/(?:^|;)\s*(?:[A-Za-z_$][\w$]*\s*=\s*)?text\s*\(/g) || [];
    if (calls.length === 1 && literal.test(line)) positions.push({ lineIndex, objectIndex });
    objectIndex += calls.length;
  });
  return positions;
}

export function replaceSimpleTextCoordinates(code, lineIndex, x, y) {
  const literal = new RegExp(String.raw`^(\s*(?:[A-Za-z_$][\w$]*\s*=\s*)?text\s*\(\s*)(${NUMBER})(\s*,\s*)(${NUMBER})(\s*,.*)$`);
  const lines = code.split('\n');
  const match = lines[lineIndex]?.match(literal);
  if (!match) return null;
  lines[lineIndex] = match[1] + formatNumber(x) + match[3] + formatNumber(y) + match[5];
  return lines.join('\n');
}
