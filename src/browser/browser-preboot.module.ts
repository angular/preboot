import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/first';
import {
  APP_BOOTSTRAP_LISTENER,
  ModuleWithProviders,
  NgModule
} from '@angular/core';
import { PrebootCompleteOptions } from '../common';
import { EventReplayer } from './event.replayer';
import { WindowRef } from './window';

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
        { provide: WindowRef, useValue: window },
        EventReplayer,
        {
          // run this once the app as bootstrapped
          provide: APP_BOOTSTRAP_LISTENER,

          // generate the inline preboot code and inject it into the document
          useFactory: function(replayer: EventReplayer) {
            return function() {

              // todo: add option for PrebootCompleteOptions where user can dictate
              // when events replayed

              replayer.replayAll(opts);
            };
          },

          multi: true,

          // we need access to the document and renderer
          deps: [EventReplayer]
        }
      ]
    };
  }
}
