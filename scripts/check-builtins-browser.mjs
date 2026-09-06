import { access, readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';

const candidates = [process.env.CHROME_BIN, '/usr/bin/google-chrome', '/usr/bin/google-chrome-stable', '/usr/bin/chromium'].filter(Boolean);
let chrome = '';
for (const candidate of candidates) {
  try { await access(candidate); chrome = candidate; break; } catch { /* Try the next installed browser. */ }
}
if (!chrome) throw new Error('Headless Chrome is required to validate JessieCode pages');

const html = await readFile('dist/index.html');
const server = createServer((request, response) => {
  if (request.url?.startsWith('/favicon')) { response.writeHead(204).end(); return; }
  response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
  response.end(html);
});
await new Promise((resolve, reject) => server.listen(0, '127.0.0.1', resolve).once('error', reject));
const { port } = server.address();

const child = spawn(chrome, [
  '--headless=new', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage',
  '--virtual-time-budget=45000', '--dump-dom', `http://127.0.0.1:${port}/?validate-builtins=1`
]);
let output = '';
let errors = '';
child.stdout.on('data', (chunk) => { output += chunk; });
child.stderr.on('data', (chunk) => { errors += chunk; });
const timeout = setTimeout(() => child.kill('SIGKILL'), 90000);
const exitCode = await new Promise((resolve) => child.once('close', resolve));
clearTimeout(timeout);
server.close();

const status = output.match(/data-builtin-validation="([^"]+)"/)?.[1];
const count = output.match(/data-builtin-count="([^"]+)"/)?.[1];
const failures = output.match(/data-builtin-failures="([^"]+)"/)?.[1];
if (exitCode !== 0 || status !== 'ok' || count !== '90') {
  throw new Error(`Built-in browser validation failed (exit ${exitCode}, status ${status || 'missing'}, count ${count || 'missing'}, pages ${failures || 'unknown'})\n${errors.slice(-2000)}`);
}
console.log(`Validated all ${count} built-in pages with the browser JessieCode parser`);
