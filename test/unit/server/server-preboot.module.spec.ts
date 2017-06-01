import 'reflect-metadata';
import 'jasmine';
import 'zone.js';
import 'zone.js/dist/long-stack-trace-zone.js';

import { NgModule, NgModuleFactory, Component, ReflectiveInjector } from '@angular/core';
import { COMPILER_PROVIDERS, JitCompiler } from '@angular/compiler';
import { ServerModule, renderModuleFactory } from '@angular/platform-server';
import { BrowserModule } from '@angular/platform-browser';
import { ServerPrebootModule } from '../../../src';

describe('UNIT TEST server-preboot.module', function () {
  describe('recordEvents()', function () {
    it('should render on server with JIT compiler', function (done) {

      @Component({
        selector: 'app-root',
        template: `<h1>{{title}}</h1>`,
      })
      class AppComponent {
        title = 'app works!';
      }

      @NgModule({
        declarations: [AppComponent],
        imports: [
          BrowserModule.withServerTransition({ appId: 'my-app-id' }),
          ServerModule,
          ServerPrebootModule.recordEvents({ appRoot: 'app-root' })
        ],
        bootstrap: [AppComponent]
      })
      class AppModule { }

      // get the JIT compiler (not exposed publically, so need to inject it)
      const injector = ReflectiveInjector.resolveAndCreate([COMPILER_PROVIDERS]);
      const jitCompiler = injector.get(JitCompiler);

      // use the JIT compiler to turn our AppModule into a factory
      return jitCompiler.compileModuleAsync(AppModule)

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
          expect(html).toMatch(/prebootData/);
          expect(html).toMatch(/app works/);
          done();
        })
        .catch(done);
    });
  });
});
