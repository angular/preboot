import {platformBrowser} from '@angular/platform-browser';
import {AppBrowserModule} from './app/app.module';

// here we are adding the client bootstrap as a function on the window
(<any>window).bootstrapPrebootClient = function () {
  platformBrowser().bootstrapModule(AppBrowserModule);
};
