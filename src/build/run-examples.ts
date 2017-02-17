import * as express from 'express';

const app = express();
app.use(express.static('__dist'));
app.listen(9898, () => console.log('Running localhost:9898'));

const exec = require('child_process').exec;
exec('open http://localhost:9898/preboot_examples.html');
