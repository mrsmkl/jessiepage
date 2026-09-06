import { mkdir, readFile, writeFile } from 'node:fs/promises';

const [html, css, appSource, examplesSource, casSource, readbackSource, stateSource] = await Promise.all([
  readFile('index.html', 'utf8'),
  readFile('styles.css', 'utf8'),
  readFile('app.js', 'utf8'),
  readFile('examples.js', 'utf8'),
  readFile('cas.js', 'utf8'),
  readFile('readback.js', 'utf8'),
  readFile('state.js', 'utf8')
]);

const styleTag = '<link rel="stylesheet" href="./styles.css" />';
const scriptTag = '<script type="module" src="./app.js"></script>';
const examplesImport = "import { BUILTIN_EXAMPLES } from './examples.js';";
const casImport = "import { analyzeSource, drawCasGraphs } from './cas.js';";
const readbackImport = `import {
  formatNumber,
  replaceSimplePointCoordinates,
  replaceSimpleTextCoordinates,
  simplePointNames,
  simpleTextPositions
} from './readback.js';`;
const stateImport = "import { mergePages, savedPixelSize, touchPage } from './state.js';";

if (!html.includes(styleTag) || !html.includes(scriptTag)) {
  throw new Error('index.html is missing a bundle placeholder');
}
if (!appSource.includes(examplesImport) || !appSource.includes(casImport) || !appSource.includes(readbackImport) || !appSource.includes(stateImport)) {
  throw new Error('app.js is missing a local module import');
}

const examples = examplesSource.replace(/^export const BUILTIN_EXAMPLES = /, 'const BUILTIN_EXAMPLES = ');
if (examples === examplesSource) throw new Error('examples.js has an unexpected export');

const cas = casSource.replace(/^export /gm, '');
if (cas === casSource) throw new Error('cas.js has no exports to bundle');
const readback = readbackSource.replace(/^export /gm, '');
if (readback === readbackSource) throw new Error('readback.js has no exports to bundle');
const stateHelpers = stateSource.replace(/^export /gm, '');
if (stateHelpers === stateSource) throw new Error('state.js has no exports to bundle');

const app = appSource
  .replace(examplesImport, () => examples.trimEnd())
  .replace(casImport, () => cas.trimEnd())
  .replace(readbackImport, () => readback.trimEnd())
  .replace(stateImport, () => stateHelpers.trimEnd());
if (app.includes('</script>')) throw new Error('The bundled module contains a closing script tag');

const bundle = html
  .replace(styleTag, () => `<style>\n${css.trimEnd()}\n  </style>`)
  .replace(scriptTag, () => `<script type="module">\n${app.trimEnd()}\n  </script>`);

await mkdir('dist', { recursive: true });
await Promise.all([
  writeFile('dist/index.html', bundle),
  writeFile('dist/.nojekyll', '')
]);

console.log(`Built dist/index.html (${Buffer.byteLength(bundle)} bytes)`);
