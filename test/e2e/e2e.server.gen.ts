import 'reflect-metadata';
import 'zone.js';
import 'zone.js/dist/long-stack-trace-zone.js';
import { NgModuleFactory, ReflectiveInjector } from '@angular/core';
import { COMPILER_PROVIDERS, JitCompiler } from '@angular/compiler';
import { renderModuleFactory } from '@angular/platform-server';
import { AppModule } from './e2e.server.module';
import { AppComponent } from './e2e.app';
import * as fs from 'fs';
import * as path from 'path';

// get the JIT compiler (not exposed publically, so need to inject it)
const injector = ReflectiveInjector.resolveAndCreate([COMPILER_PROVIDERS]);
const jitCompiler = injector.get(JitCompiler);

// use the JIT compiler to turn our AppModule into a factory
jitCompiler.compileModuleAsync(AppModule)

  // we can now render our app using the factory and a supplied document
  .then((factory: NgModuleFactory<AppComponent>) => renderModuleFactory(factory, {
    url: '/',
    document: `
      <html>
        <head>
          <title>Preboot Test</title>
        </head>
        <body>
          <app-root></app-root>
        </body>
      </html>
    `
  }))
  .then((html: string) => {
    const filePath = path.join(process.cwd(), 'test/e2e/dist/index.html');
    fs.writeFileSync(filePath, html);
  })
  .catch(console.error);
