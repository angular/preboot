import { APP_BOOTSTRAP_LISTENER, ModuleWithProviders, NgModule, InjectionToken, ApplicationRef } from '@angular/core';
import { PrebootReplayOptions } from '../common';
import { EventReplayer } from './event.replayer';
import {eventReplayerFactory} from './event.replayer.factory';

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
