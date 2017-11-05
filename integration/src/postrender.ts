import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import {AppBrowserModule} from './app/app.module';

// here we are adding the client bootstrap as a function on the window
(<any>window).bootstrapPrebootClient = function () {
  platformBrowserDynamic().bootstrapModule(AppBrowserModule);
};
