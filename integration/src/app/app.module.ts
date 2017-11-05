import 'reflect-metadata';
import 'zone.js';

import {Component, Inject, NgModule, PLATFORM_ID} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { PrebootModule } from 'preboot';
import {ServerModule} from '@angular/platform-server';
import {isPlatformBrowser} from '@angular/common';

@Component({
  selector: 'app-root',
  template: `
    <h1>{{platform}}</h1>
    <p>Here is something</p>
    <input id="myTextBox">
    <select id="mySelect">
      <option></option>
      <option id="myVal">foo</option>
      <option>moo</option>
    </select>
  `,
})
export class AppComponent {

  platform: string;

  constructor( @Inject(PLATFORM_ID) public _platform: string) {
    this.platform = isPlatformBrowser(_platform) ? 'client view' : 'server view';
  }
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: 'foo' }),
    PrebootModule.withConfig({ appRoot: 'app-root' })
  ],
  bootstrap: [AppComponent]
})
export class AppBrowserModule { }

@NgModule({
  imports: [
    AppBrowserModule,
    ServerModule
  ],
  bootstrap: [AppComponent]
})
export class AppServerModule { }
