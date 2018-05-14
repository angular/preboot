/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {ModuleWithProviders, NgModule} from '@angular/core';

import {EventReplayer, PrebootOptions} from 'preboot';
import {PREBOOT_OPTIONS, PREBOOT_PROVIDER} from './provider';

@NgModule({
  providers: [EventReplayer, PREBOOT_PROVIDER]
})
export class PrebootModule {
  static withConfig(opts: PrebootOptions): ModuleWithProviders {
    return {
      ngModule: PrebootModule,
      providers: [{provide: PREBOOT_OPTIONS, useValue: opts}]
    };
  }
}
