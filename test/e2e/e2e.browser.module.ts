import 'reflect-metadata';
import 'zone.js';
import 'zone.js/dist/long-stack-trace-zone.js';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserPrebootModule } from '../../src/browser';
import { AppComponent, CURRENT_PLATFORM } from './e2e.app';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserPrebootModule.replayEvents()
  ],
  providers: [
    { provide: CURRENT_PLATFORM, useValue: 'client view' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
