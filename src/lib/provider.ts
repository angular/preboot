/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {
  APP_BOOTSTRAP_LISTENER,
  ApplicationRef,
  Inject,
  InjectionToken,
  Optional,
  PLATFORM_ID
} from '@angular/core';
import {DOCUMENT, isPlatformBrowser, isPlatformServer} from '@angular/common';
import {take} from 'rxjs/operators/take';
import {filter} from 'rxjs/operators/filter';

import {EventReplayer} from './api/event.replayer';
import {PREBOOT_NONCE} from './common/tokens';
import {getInlinePrebootCode} from './api/inline.preboot.code';
import {PrebootOptions} from './common/preboot.interfaces';

const PREBOOT_SCRIPT_ID = 'preboot-inline-script';
export const PREBOOT_OPTIONS = new InjectionToken<PrebootOptions>('PrebootOptions');

export function PREBOOT_FACTORY(doc: Document,
                                prebootOpts: PrebootOptions,
                                nonce: string|null,
                                platformId: Object,
                                appRef: ApplicationRef,
                                eventReplayer: EventReplayer) {
  return () => {
    if (isPlatformServer(platformId)) {
      const inlineCode = getInlinePrebootCode(prebootOpts);
      const script = doc.createElement('script');
      if (nonce) {
        (<any>script)['nonce'] = nonce;
      }
      script.id = PREBOOT_SCRIPT_ID;
      script.textContent = inlineCode;
      const existingScripts = doc.querySelectorAll(`#${PREBOOT_SCRIPT_ID}`);

      // Check to see if a preboot script is already inlined before adding
      // it to the DOM. If it is, update the nonce to be current
      if (existingScripts.length === 0) {
        doc.head.appendChild(script);
      } else if (existingScripts.length > 0 && nonce) {
        (<any>existingScripts[0])['nonce'] = nonce;
      }
    }
    if (isPlatformBrowser(platformId)) {
      const replay = prebootOpts.replay != null ? prebootOpts.replay : true;
      if (replay) {
        appRef.isStable
          .pipe(
            filter(stable => stable),
            take(1)
          ).subscribe(() => {
          eventReplayer.replayAll();
        });
      }
    }
  };
}

export const PREBOOT_PROVIDER = {
  provide: <InjectionToken<() => void>>APP_BOOTSTRAP_LISTENER,
  useFactory: PREBOOT_FACTORY,
  deps: [
    DOCUMENT,
    PREBOOT_OPTIONS,
    [new Optional(), new Inject(PREBOOT_NONCE)],
    PLATFORM_ID,
    ApplicationRef,
    EventReplayer,
  ],
  multi: true
};
