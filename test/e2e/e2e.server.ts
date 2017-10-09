const path = require('path');
const express = require('express');
const http = require('http');
const app = express();
const staticDir = path.join(process.cwd(), 'test/e2e/dist');
const port = 4201;
let server: any;

app.use(express.static(staticDir));

export function startServer(done: Function) {
  server = http.createServer(app);
  server.listen(4201, done);
}

export function stopServer() {
  server.close();
}

if (process.argv[2] === 'start') {
  startServer(() => console.log('server started http://localhost:4201'));
}
