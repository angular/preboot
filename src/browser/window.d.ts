import { ComputedStyle, Document, PrebootData, Window, Element } from '../common';
export declare class WindowRef implements Window {
    prebootData: PrebootData;
    document: Document;
    getComputedStyle?(node: Element): ComputedStyle;
}
