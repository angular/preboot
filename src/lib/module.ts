/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {
  Inject,
  ModuleWithProviders,
  NgModule,
  Optional,
  PLATFORM_ID,
  InjectionToken,
  APP_BOOTSTRAP_LISTENER,
  ApplicationRef,
} from '@angular/core';
import {DOCUMENT, isPlatformBrowser, isPlatformServer} from '@angular/common';
import {filter} from 'rxjs/operators/filter';
import {take} from 'rxjs/operators/take';

import {EventReplayer} from './api/event.replayer';
import {getInlinePrebootCode} from './api/inline.preboot.code';
import {PrebootOptions} from './common/preboot.interfaces';
import {PREBOOT_NONCE} from './common/tokens';


export const PREBOOT_OPTIONS = new InjectionToken<PrebootOptions>('PrebootOptions');

export function prebootHook(doc: Document,
                            prebootOpts: PrebootOptions,
                            nonce: string|null,
                            platformId: Object,
                            appRef: ApplicationRef,
                            eventReplayer: EventReplayer) {
  // necessary because of angular/angular/issues/14485
  const res = () => {
    if (isPlatformServer(platformId)) {
      const inlineCode = getInlinePrebootCode(prebootOpts);
      const script = doc.createElement('script');
      if (nonce) {
        (<any>script)['nonce'] = nonce;
      }
      script.textContent = inlineCode;
      doc.head.appendChild(script);
    }
    if (isPlatformBrowser(platformId) && !prebootOpts.noReplay) {
      appRef.isStable
        .pipe(
          filter(stable => stable),
          take(1)
        ).subscribe(() => {
          eventReplayer.replayAll();
        });
    }
  };

  return res;

}

@NgModule()
export class PrebootModule {
  static withConfig(opts: PrebootOptions): ModuleWithProviders {
    return {
      ngModule: PrebootModule,
      providers: [
        EventReplayer,
        { provide: PREBOOT_OPTIONS, useValue: opts },
        {
          provide: APP_BOOTSTRAP_LISTENER,
          useFactory: prebootHook,
          deps: [
            DOCUMENT,
            PREBOOT_OPTIONS,
            [new Optional(), new Inject(PREBOOT_NONCE)],
            PLATFORM_ID,
            ApplicationRef,
            EventReplayer,
          ],
          multi: true
        }
      ]
    };
  }
}
