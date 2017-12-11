import {
  Inject,
  ModuleWithProviders,
  NgModule,
  Optional,
  PLATFORM_ID,
  RendererFactory2,
  RendererType2,
  ViewEncapsulation,
  InjectionToken,
  APP_BOOTSTRAP_LISTENER,
} from '@angular/core';
import {EventReplayer} from './api/event.replayer';
import {DOCUMENT, isPlatformBrowser, isPlatformServer} from '@angular/common';
import {getInlinePrebootCode} from './api/inline.preboot.code';
import {PrebootOptions} from './common/preboot.interfaces';
import {PREBOOT_NONCE} from './common/tokens';

export const PREBOOT_OPTIONS = new InjectionToken<PrebootOptions>('PrebootOptions');

export function addScript(doc: Document, rendererFactory: RendererFactory2, recordOpts: PrebootOptions, nonce: string, platformId: Object) {
  // necessary because of angular/angular/issues/14485
  const res = () => {
    if (isPlatformServer(platformId)) {
      const inlineCode = getInlinePrebootCode(recordOpts);
      const renderType: RendererType2 = { id: '-1', encapsulation: ViewEncapsulation.None, styles: [], data: {} };
      const renderer = rendererFactory.createRenderer(doc, renderType);
      const script = renderer.createElement('script');
      if (nonce) {
        renderer.setProperty(script, 'nonce', nonce);
      }
      renderer.setValue(script, inlineCode);
      renderer.insertBefore(doc.head, script, doc.head.firstChild);
    }
  };

  return res;

}

export function replay(eventReplayer: EventReplayer, replayOpts: PrebootOptions, platformId: Object) {
  // necessary because of angular/angular/issues/14485
  const res = () => {
    if (isPlatformBrowser(platformId) && !replayOpts.noReplay) {
      eventReplayer.replayAll();
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
          useFactory: addScript,
          deps: [
            DOCUMENT,
            RendererFactory2,
            PREBOOT_OPTIONS,
            [new Optional(), new Inject(PREBOOT_NONCE)],
            PLATFORM_ID
          ],
          multi: true
        },
        {
          provide: APP_BOOTSTRAP_LISTENER,
          useFactory: replay,
          deps: [EventReplayer, PREBOOT_OPTIONS, PLATFORM_ID],
          multi: true
        }
      ]
    };
  }
}
