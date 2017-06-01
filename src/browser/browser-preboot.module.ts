import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/first';
import {
  APP_BOOTSTRAP_LISTENER,
  ModuleWithProviders,
  NgModule
} from '@angular/core';
import { PrebootReplayOptions } from '../common';
import { EventReplayer } from './event.replayer';
import { WindowRef } from './window';

// only thing this does is replay events
@NgModule()
export class BrowserPrebootModule {

  // user can override the default preboot options by passing them in here
  static replayEvents(opts?: PrebootReplayOptions): ModuleWithProviders {
    const shouldReplay = !opts || !opts.noReplay;

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

              // todo: add option for PrebootReplayOptions where user can dictate
              // when events replayed
              if (shouldReplay) {
                replayer.replayAll();
              }
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
