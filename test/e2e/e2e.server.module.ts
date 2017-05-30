import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ServerModule } from '@angular/platform-server';
import { ServerPrebootModule } from '../../src/server';
import { AppComponent, CURRENT_PLATFORM } from './e2e.app';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: 'foo' }),
    ServerModule,
    ServerPrebootModule.recordEvents({ appRoot: 'app-root', minify: false })
  ],
  providers: [
    { provide: CURRENT_PLATFORM, useValue: 'server view' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
