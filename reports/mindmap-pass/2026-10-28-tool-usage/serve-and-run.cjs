// Serves dist/ on :4321 and runs one child command against it (the run's rendered capture/recapture), then exits.
const http = require('http'), fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const ROOT = path.resolve(__dirname, '../../../dist');
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.xml': 'application/xml', '.svg': 'image/svg+xml' };
const srv = http.createServer((req, res) => {
  let f = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]));
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
  if (!fs.existsSync(f)) { res.writeHead(404); return res.end('not found'); }
  res.writeHead(200, { 'content-type': types[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(res);
});
srv.listen(4321, () => {
  const [cmd, ...args] = process.argv.slice(2);
  const { spawn } = require('child_process');
  const c = spawn(cmd, args, { stdio: 'inherit' });
  c.on('exit', (code) => { srv.close(); process.exit(code ?? 1); });
});
