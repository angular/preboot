import { ModuleWithProviders, RendererFactory2 } from '@angular/core';
import { PrebootRecordOptions } from '../common';
export declare class ServerPrebootModule {
    static recordEvents(opts?: PrebootRecordOptions): ModuleWithProviders;
}
export declare function addInlineCodeToDocument(inlineCode: string, doc: Document, rendererFactory: RendererFactory2): void;
