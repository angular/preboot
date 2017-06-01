import { InjectionToken } from '@angular/core';
export declare const CURRENT_PLATFORM: InjectionToken<string>;
export declare class AppComponent {
    platform: string;
    constructor(platform: string);
}
