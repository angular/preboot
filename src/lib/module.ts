/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {ModuleWithProviders, NgModule} from '@angular/core';

import {EventReplayer} from './api/event.replayer';
import {PrebootOptions} from './common/preboot.interfaces';
import {PREBOOT_OPTIONS, PREBOOT_PROVIDER} from './provider';

@NgModule({
  providers: [EventReplayer, PREBOOT_PROVIDER]
})
export class PrebootModule {
  static withConfig(opts: PrebootOptions): ModuleWithProviders<PrebootModule> {
    return {
      ngModule: PrebootModule,
      providers: [{provide: PREBOOT_OPTIONS, useValue: opts}]
    };
  }
}
