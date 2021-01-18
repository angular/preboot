import 'zone.js';
import {INITIAL_CONFIG, renderModule} from '@angular/platform-server';
import {readFileSync, writeFileSync} from 'fs-extra';

const {AppServerModule} = require('./app/app.module');
const template = readFileSync('./index.html').toString();

const extraProviders = [
  {
    provide: INITIAL_CONFIG,
    useValue: {
      document: template,
      url: '/'
    }
  }
];

renderModule(AppServerModule, {extraProviders})
  .then((html: string) => writeFileSync('../dist/index.html', html));
