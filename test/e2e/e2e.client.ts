import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './e2e.client.module';

// here we are adding the client bootstrap as a function on the window
(<any>window).bootstrapPrebootClient = function () {
  return platformBrowserDynamic().bootstrapModule(AppModule);
};
