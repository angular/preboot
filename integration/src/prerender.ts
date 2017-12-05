import 'reflect-metadata';
import 'zone.js';
import {INITIAL_CONFIG, renderModuleFactory} from '@angular/platform-server';
import {readFileSync, writeFileSync} from 'fs-extra';

const { AppServerModuleNgFactory } = require('./app/app.module.ngfactory');

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

renderModuleFactory(AppServerModuleNgFactory, {
  extraProviders: extraProviders
}).then((html: string) => {
  writeFileSync('../dist/index.html', html);
});
