import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/first';
import { ModuleWithProviders } from '@angular/core';
import { PrebootReplayOptions } from '../common';
export declare class BrowserPrebootModule {
    static replayEvents(opts?: PrebootReplayOptions): ModuleWithProviders;
}
