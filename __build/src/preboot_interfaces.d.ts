export interface EventSelector {
    selector: string;
    events: [string];
    keyCodes?: [number];
    preventDefault?: boolean;
    freeze?: boolean;
    action?: Function;
    noReplay?: boolean;
}
export interface PrebootCompleteOptions {
    appRoot?: string;
    window?: Window;
    noCleanup?: boolean;
}
export interface ServerClientRoot {
    serverSelector: string;
    serverNode?: Element;
    clientSelector?: string;
    clientNode?: Element;
}
export interface PrebootOptions {
    window?: Window;
    uglify?: boolean;
    buffer?: boolean;
    noInlineCache?: boolean;
    eventSelectors?: EventSelector[];
    appRoot?: string | string[];
    serverClientRoot?: ServerClientRoot[];
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
    opts?: PrebootOptions;
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
export interface Window {
    prebootData: PrebootData;
    document: Document;
    getComputedStyle?(node: Element): ComputedStyle;
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
    createTextRange?(): any;
    setSelectionRange?(fromPos: number, toPos: number, direction: string): void;
    style?: {
        display?: string;
    };
    parentNode?: Element;
    childNodes?: Element[];
    attributes?: string[];
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
