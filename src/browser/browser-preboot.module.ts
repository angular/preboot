import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/first';
import {
  APP_BOOTSTRAP_LISTENER,
  ModuleWithProviders,
  NgModule,
  InjectionToken,
  ApplicationRef
} from '@angular/core';
import { PrebootReplayOptions } from '../common';
import { EventReplayer } from './event.replayer';

export function eventReplayerFactory(appRef: ApplicationRef, replayer: EventReplayer, opts: PrebootReplayOptions) {
  return function () {

    // if noReplay it means user is going to call replayAll() manually
    if (!opts.noReplay) {

      // we will wait until the application is stable, then replay
      appRef.isStable
        .filter(stable => stable)
        .first()
        .subscribe(() => {
          replayer.replayAll();
        });
    }
  };
}

export const PREBOOT_REPLAY_OPTIONS = new InjectionToken<PrebootReplayOptions>('PrebootReplayOptions');

// only thing this does is replay events
@NgModule()
export class BrowserPrebootModule {

  // user can override the default preboot options by passing them in here
  static replayEvents(opts: PrebootReplayOptions = {}): ModuleWithProviders {

    return {
      ngModule: BrowserPrebootModule,
      providers: [
        EventReplayer,
        { provide: PREBOOT_REPLAY_OPTIONS, useValue: opts },
        {
          // run this once the app as bootstrapped
          provide: APP_BOOTSTRAP_LISTENER,

          // generate the inline preboot code and inject it into the document
          useFactory: eventReplayerFactory,

          multi: true,

          // we need access to the document and renderer
          deps: [ApplicationRef, EventReplayer, PREBOOT_REPLAY_OPTIONS]
        }
      ]
    };
  }
}
