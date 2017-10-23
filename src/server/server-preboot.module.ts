import {
  InjectionToken,
  ModuleWithProviders,
  NgModule,
  RendererFactory2,
  RendererType2,
  ViewEncapsulation,
  APP_BOOTSTRAP_LISTENER
} from '@angular/core';
import { PlatformState } from '@angular/platform-server';
import { PrebootRecordOptions } from '../common';
import { getInlinePrebootCode } from './inline.preboot.code';

export function loadPrebootFactory(state: PlatformState, rendererFactory: RendererFactory2, opts: PrebootRecordOptions, nonce: string) {
  return function() {
    const doc = state.getDocument();
    const inlinePrebootCode = getInlinePrebootCode(opts);
    addInlineCodeToDocument(inlinePrebootCode, doc, rendererFactory, nonce);
  };
}

export const PREBOOT_NONCE = new InjectionToken<string>('PrebootNonce');
export const PREBOOT_RECORD_OPTIONS = new InjectionToken<PrebootRecordOptions>('PrebootRecordOptions');

// only thing this does is modify the document
@NgModule()
export class ServerPrebootModule {
  // user can override the default preboot options by passing them in here
  static recordEvents(opts: PrebootRecordOptions = { appRoot: 'app-root' }): ModuleWithProviders {
    return {
      ngModule: ServerPrebootModule,
      providers: [
        { provide: PREBOOT_RECORD_OPTIONS, useValue: opts },
        { provide: PREBOOT_NONCE, useValue: Math.floor(Math.random() * 10000) + '' },
        {
          // this likely will never be injected but need something to run the
          // factory function
          provide: APP_BOOTSTRAP_LISTENER,

          // generate the inline preboot code and inject it into the document
          useFactory: loadPrebootFactory,

          multi: true,

          // we need access to the document and renderer
          deps: [PlatformState, RendererFactory2, PREBOOT_RECORD_OPTIONS, PREBOOT_NONCE]
        }
      ]
    };
  }
}

export function addInlineCodeToDocument(inlineCode: string, doc: Document, rendererFactory: RendererFactory2, nonce: string) {
  const renderType: RendererType2 = { id: '-1', encapsulation: ViewEncapsulation.None, styles: [], data: {} };
  const renderer = rendererFactory.createRenderer(doc, renderType);
  const script = renderer.createElement('script');
  renderer.setProperty(script, 'nonce', nonce);
  renderer.setValue(script, inlineCode);
  renderer.insertBefore(doc.head, script, doc.head.firstChild);
}
