import {platformBrowser} from '@angular/platform-browser';
const {AppBrowserModuleNgFactory} = require('./app/app.module.ngfactory');

// here we are adding the client bootstrap as a function on the window
(<any>window).bootstrapPrebootClient = function () {
  platformBrowser().bootstrapModuleFactory(AppBrowserModuleNgFactory);
};
