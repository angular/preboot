/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {PrebootOptions, PrebootWindow} from './preboot.interfaces';
import {assign, defaultOptions} from '../api/inline.preboot.code';

export function getMockWindow(): PrebootWindow {
  return {
    prebootData: {},
    prebootStarted: false
  } as PrebootWindow;
}

export function getMockOptions(): PrebootOptions {
  return <PrebootOptions> assign({}, defaultOptions, {
    window: getMockWindow()
  });
}

export function getMockElement(): Element {
  return {
    ___attributes: new Map<string, string>(),
    cloneNode: () => { return { style: {} }; },
    parentNode: {
      insertBefore: function () {}
    },
    hasAttribute(key: string) {
      return this.___attributes.has(key);
    },
    getAttribute(key: string) {
      return this.___attributes.get(key);
    },
    setAttribute(key: string, value: string) {
      this.___attributes.set(key, value);
    },
    removeAttribute(key: string) {
      this.___attributes.delete(key);
    }
  } as any as Element;
}
