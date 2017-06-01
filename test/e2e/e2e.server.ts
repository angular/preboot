const path = require('path');
const express = require('express');
const app = express();
const staticDir = path.join(process.cwd(), 'test/e2e/dist');
const port = 4201;

app.use(express.static(staticDir));

export function startServer(done: Function) {
  app.listen(4201, done);
}

export function stopServer() {
  app.close();
}

if (process.argv[2] === 'start') {
  startServer(() => console.log('server started http://localhost:4201'));
}
