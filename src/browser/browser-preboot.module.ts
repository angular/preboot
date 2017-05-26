import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/first';
import {
  APP_BOOTSTRAP_LISTENER,
  ModuleWithProviders,
  NgModule,
  ApplicationRef
} from '@angular/core';
import { PrebootCompleteOptions } from '../common';
import { EventReplayer } from './event.replayer';

// only thing this does is replay events
@NgModule()
export class BrowserPrebootModule {

  // user can override the default preboot options by passing them in here
  static replayEvents(opts?: PrebootCompleteOptions): ModuleWithProviders {
    opts = opts || {};

    if (opts.timeout === undefined) {
      opts.timeout = 10000;
    }

    return {
      ngModule: BrowserPrebootModule,
      providers: [
        EventReplayer,
        {
          // run this once the app as bootstrapped
          provide: APP_BOOTSTRAP_LISTENER,

          // generate the inline preboot code and inject it into the document
          useFactory: function(appRef: ApplicationRef, replayer: EventReplayer) {
            return function() {
              appRef.isStable.filter(stable => stable)
                  .first()
                  .subscribe(() => replayer.replayAll(opts));

              // if there is a timeout, then replay after timeout occurs regardless
              // whether app is table or not
              if (opts.timeout) {
                setTimeout(() => replayer.replayAll(opts), opts.timeout);
              }
            };
          },

          multi: true,

          // we need access to the document and renderer
          deps: [ApplicationRef, EventReplayer]
        }
      ]
    };
  }
}
