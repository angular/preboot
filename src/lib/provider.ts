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
import {filter, take} from 'rxjs/operators';

import {EventReplayer} from './api/event.replayer';
import {PREBOOT_NONCE} from './common/tokens';
import {getInlineDefinition, getInlineInvocation} from './api/inline.preboot.code';
import {PrebootOptions} from './common/preboot.interfaces';
import {validateOptions} from './api';

const PREBOOT_SCRIPT_CLASS = 'preboot-inline-script';
export const PREBOOT_OPTIONS = new InjectionToken<PrebootOptions>('PrebootOptions');

function createScriptFromCode(doc: Document, nonce: string|null, inlineCode: string) {
  const script = doc.createElement('script');
  if (nonce) {
    (script as any).nonce = nonce;
  }
  script.className = PREBOOT_SCRIPT_CLASS;
  script.textContent = inlineCode;

  return script;
}

export function PREBOOT_FACTORY(doc: Document,
                                prebootOpts: PrebootOptions,
                                nonce: string|null,
                                platformId: Object,
                                appRef: ApplicationRef,
                                eventReplayer: EventReplayer) {
  return () => {
    validateOptions(prebootOpts);

    if (isPlatformServer(platformId)) {
      const inlineCodeDefinition = getInlineDefinition(prebootOpts);
      const scriptWithDefinition = createScriptFromCode(doc, nonce, inlineCodeDefinition);
      const inlineCodeInvocation = getInlineInvocation();

      const existingScripts = doc.getElementsByClassName(PREBOOT_SCRIPT_CLASS);

      // Check to see if preboot scripts are already inlined before adding them
      // to the DOM. If they are, update the nonce to be current.
      if (existingScripts.length === 0) {
        const baseList: string[] = [];
        const appRootSelectors = baseList.concat(prebootOpts.appRoot);
        doc.head.appendChild(scriptWithDefinition);
        appRootSelectors
          .map(selector => ({
            selector,
            appRootElem: doc.querySelector(selector)
          }))
          .forEach(({selector, appRootElem}) => {
            if (!appRootElem) {
              console.log(`No server node found for selector: ${selector}`);
              return;
            }
            const scriptWithInvocation = createScriptFromCode(doc, nonce, inlineCodeInvocation);
            appRootElem.insertBefore(scriptWithInvocation, appRootElem.firstChild);
          });
      } else if (existingScripts.length > 0 && nonce) {
        (existingScripts[0] as any).nonce = nonce;
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
