import { mkdir, readFile, writeFile } from 'node:fs/promises';

const [html, css, appSource, examplesSource] = await Promise.all([
  readFile('index.html', 'utf8'),
  readFile('styles.css', 'utf8'),
  readFile('app.js', 'utf8'),
  readFile('examples.js', 'utf8')
]);

const styleTag = '<link rel="stylesheet" href="./styles.css" />';
const scriptTag = '<script type="module" src="./app.js"></script>';
const examplesImport = "import { BUILTIN_EXAMPLES } from './examples.js';";

if (!html.includes(styleTag) || !html.includes(scriptTag)) {
  throw new Error('index.html is missing a bundle placeholder');
}
if (!appSource.includes(examplesImport)) {
  throw new Error('app.js is missing its examples import');
}

const examples = examplesSource.replace(/^export const BUILTIN_EXAMPLES = /, 'const BUILTIN_EXAMPLES = ');
if (examples === examplesSource) throw new Error('examples.js has an unexpected export');

const app = appSource.replace(examplesImport, () => examples.trimEnd());
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
