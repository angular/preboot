import {
    InjectionToken,
    ModuleWithProviders,
    NgModule,
    RendererFactory2,
    APP_BOOTSTRAP_LISTENER,
    Inject,
    Optional,
    forwardRef
} from '@angular/core';
import { PlatformState } from '@angular/platform-server';
import { PrebootRecordOptions } from '../common';
import {loadPrebootFactory} from './server.factory';


export class NonceOp {
  constructor(@Optional() @Inject(forwardRef(() => PREBOOT_NONCE)) public nonce: string) { }
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
        { provide : NonceOp, useClass: NonceOp },
        {
          // this likely will never be injected but need something to run the
          // factory function
          provide: APP_BOOTSTRAP_LISTENER,

          // generate the inline preboot code and inject it into the document
          useFactory: loadPrebootFactory,

          multi: true,

          // we need access to the document and renderer
          deps: [PlatformState, RendererFactory2, PREBOOT_RECORD_OPTIONS, NonceOp]
        }
      ]
    };
  }
}
