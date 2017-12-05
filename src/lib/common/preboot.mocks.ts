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
    cloneNode: () => { return { style: {} }; },
    parentNode: {
      insertBefore: function () {}
    }
  } as any as Element;
}
