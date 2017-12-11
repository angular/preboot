// basically this is used to identify which events to listen for and what we do with them
export interface EventSelector {
  selector: string; // same as jQuery; selector for nodes
  events: [string]; // array of event names to listen for
  keyCodes?: [number]; // key codes to watch out for
  preventDefault?: boolean; // will prevent default handlers if true
  freeze?: boolean; // if  true, the UI will freeze when this event occurs
  action?: Function; // custom action to take with this event
  noReplay?: boolean; // if true, no replay will occur
}

export interface ServerClientRoot {
  serverSelector: string;
  serverNode?: HTMLElement;
  clientSelector?: string;
  clientNode?: HTMLElement;
}

// interface for the options that can be passed into preboot
export interface PrebootOptions {
  /** @deprecated minification has been removed in v6. Minification should be handled by the end-user */
  minify?: boolean;
  buffer?: boolean; // if true, attempt to buffer client rendering to hidden div
  eventSelectors?: EventSelector[]; // when any of these events occur, they are recorded
  appRoot: string | string[]; // define selectors for one or more server roots
  noReplay?: boolean;
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
  node: HTMLElement;
  eventName: string;
  handler: EventListener;
}

export interface PrebootSelection {
  start: number;
  end: number;
  direction: string;
}

// object that contains all data about the currently active node in the DOM (i.e. that has focus)
export interface NodeContext {
  root: ServerClientRoot;
  node: Element;
  nodeKey?: string;
  selection?: PrebootSelection
}

// interface for global object that contains all preboot data
export interface PrebootData {
  opts?: PrebootOptions;
  overlay?: Element;
  activeNode?: NodeContext;
  apps?: PrebootAppData[];
  listeners?: PrebootEventListener[];
}

export interface PrebootWindow {
  prebootData: PrebootData,
  prebootStarted: boolean,
  getComputedStyle: (elt: Element, pseudoElt?: string) => CSSStyleDeclaration;
  document: Document
}
