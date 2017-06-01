
// basically this is used to identify which events to listen for and what we do with them
export interface EventSelector {
  selector: string;                 // same as jQuery; selector for nodes
  events: [string];                 // array of event names to listen for
  keyCodes?: [number];              // key codes to watch out for
  preventDefault?: boolean;         // will prevent default handlers if true
  freeze?: boolean;                 // if  true, the UI will freeze when this event occurs
  action?: Function;                // custom action to take with this event
  noReplay?: boolean;               // if true, no replay will occur
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

// interface for the options that can be passed into preboot
export interface PrebootRecordOptions {
  minify?: boolean;                 // if true, client code generated will be uglified
  buffer?: boolean;                 // if true, attempt to buffer client rendering to hidden div
  eventSelectors?: EventSelector[]; // when any of these events occur, they are recorded
  appRoot: string | string[];       // define selectors for one or more server roots
}

// our wrapper around DOM events in preboot
export interface PrebootEvent {
  node: any;
  nodeKey?: any;
  event: DomEvent;
  name: string;
}

// an actual DOM event object
export interface DomEvent {
  which?: number;
  type?: string;
  target?: any;
  preventDefault(): void;
}

// data on global preboot object for one particular app
export interface PrebootAppData {
  root: ServerClientRoot;
  events: PrebootEvent[];
}

// object that is used to keep track of all the preboot listeners (so we can remove the listeners later)
export interface PrebootEventListener {
  node: Element;
  eventName: string;
  handler: Function;
}

// object that contains all data about the currently active node in the DOM (i.e. that has focus)
export interface NodeContext {
  root: ServerClientRoot;
  node: Element;
  nodeKey?: string;
  selection?: {
    start: number,
    end: number,
    direction: string
  };
}

// interface for global object that contains all preboot data
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

// this represents a node in the DOM
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

export interface ComputedStyle { getPropertyValue(prop: string): string; }
