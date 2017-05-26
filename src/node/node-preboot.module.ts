import {
  InjectionToken,
  ModuleWithProviders,
  NgModule,
  RendererFactory2,
  RendererType2,
  ViewEncapsulation
} from '@angular/core';
import { PlatformState } from '@angular/platform-server';
import { PrebootOptions } from '../common';
import { generatePrebootEventRecorderCode } from './preboot.generator';

export const INLINE_PREBOOT = new InjectionToken<string>('InlinePreboot');

// only thing this does is modify the document
@NgModule()
export class NodePrebootModule {

  // user can override the default preboot options by passing them in here
  static recordEvents(opts?: PrebootOptions): ModuleWithProviders {
    return {
      ngModule: NodePrebootModule,
      providers: [{

        // this likely will never be injected but need something to run the
        // factory function
        provide: INLINE_PREBOOT,

        // generate the inline preboot code and inject it into the document
        useFactory: function(state: PlatformState, rendererFactory: RendererFactory2) {
          const doc = state.getDocument();
          const prebootEventRecorderCode = generatePrebootEventRecorderCode(opts);
          addInlineCodeToDocument(prebootEventRecorderCode, doc, rendererFactory);
          return prebootEventRecorderCode;
        },

        // we need access to the document and renderer
        deps: [PlatformState, RendererFactory2]
      }]
    };
  }
}

export function addInlineCodeToDocument(inlineCode: string, doc: Document, rendererFactory: RendererFactory2) {
  const renderType: RendererType2 = {id: '-1', encapsulation: ViewEncapsulation.None, styles: [], data: {}};
  const renderer = rendererFactory.createRenderer(doc, renderType);
  const script = renderer.createElement('script');
  renderer.setValue(script, inlineCode);
  renderer.appendChild(doc.head, script);
}
