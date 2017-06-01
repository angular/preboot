export interface EventSelector {
    selector: string;
    events: [string];
    keyCodes?: [number];
    preventDefault?: boolean;
    freeze?: boolean;
    action?: Function;
    noReplay?: boolean;
}
export interface PrebootReplayOptions {
    noReplay?: boolean;
}
export interface ServerClientRoot {
    serverSelector: string;
    serverNode?: Element;
    clientSelector?: string;
    clientNode?: Element;
}
export interface PrebootRecordOptions {
    minify?: boolean;
    buffer?: boolean;
    eventSelectors?: EventSelector[];
    appRoot: string | string[];
}
export interface PrebootEvent {
    node: any;
    nodeKey?: any;
    event: DomEvent;
    name: string;
}
export interface DomEvent {
    which?: number;
    type?: string;
    target?: any;
    preventDefault(): void;
}
export interface PrebootAppData {
    root: ServerClientRoot;
    events: PrebootEvent[];
}
export interface PrebootEventListener {
    node: Element;
    eventName: string;
    handler: Function;
}
export interface NodeContext {
    root: ServerClientRoot;
    node: Element;
    nodeKey?: string;
    selection?: {
        start: number;
        end: number;
        direction: string;
    };
}
export interface PrebootData {
    opts?: PrebootRecordOptions;
    overlay?: Element;
    activeNode?: NodeContext;
    apps?: PrebootAppData[];
    listeners?: PrebootEventListener[];
}
export interface Selection {
    start: number;
    end: number;
    direction: string;
}
export interface Element {
    id?: string;
    value?: string;
    checked?: boolean;
    selected?: boolean;
    tagName?: string;
    nodeName?: string;
    className?: string;
    selectionStart?: number;
    selectionEnd?: number;
    selectionDirection?: string;
    selection?: any;
    style?: {
        display?: string;
    };
    parentNode?: Element;
    childNodes?: Element[];
    attributes?: string[];
    createTextRange?(): any;
    setSelectionRange?(fromPos: number, toPos: number, direction: string): void;
    remove?(): void;
    focus?(): void;
    dispatchEvent?(event: DomEvent): boolean;
    getAttribute?(name: string): string;
    cloneNode?(deep?: boolean): Element;
    insertBefore?(nodeToInsert: Element, beforeNode: Element): Node;
    addEventListener?(name: string, callback: Function): void;
    removeEventListener?(name: string, callback: Function): void;
    querySelector?(selector: string): Element;
    querySelectorAll?(selector: string): Element[];
    appendChild?(node: Element): Node;
    setAttribute?(attrName: string, styles: string): void;
}
export interface Window {
    prebootData: PrebootData;
    prebootStarted?: boolean;
    document: Document;
    getComputedStyle?(node: Element): ComputedStyle;
}
export interface Document {
    body?: Element;
    readyState?: string;
    addEventListener?(name?: string, callback?: Function): void;
    querySelector?(selector?: string): Element;
    querySelectorAll?(selector?: string): Element[];
    createElement?(elementName?: string): Element;
}
export interface ComputedStyle {
    getPropertyValue(prop: string): string;
}
