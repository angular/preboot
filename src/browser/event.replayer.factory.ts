import {filter} from 'rxjs/operators/filter';
import {first} from 'rxjs/operators/first';
import {ApplicationRef} from '@angular/core';
import {EventReplayer} from './event.replayer';
import {PrebootReplayOptions} from '../common/preboot.interfaces';

export function eventReplayerFactory(appRef: ApplicationRef, replayer: EventReplayer, opts: PrebootReplayOptions) {
  return function() {
    // if noReplay it means user is going to call replayAll() manually
    if (!opts.noReplay) {
      // we will wait until the application is stable, then replay
      appRef.isStable.pipe(
        filter(stable => stable),
        first()
      ).subscribe(() => {
        replayer.replayAll();
      });
    }
  };
}
