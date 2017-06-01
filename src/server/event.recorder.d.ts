import { EventSelector, PrebootRecordOptions, PrebootAppData, PrebootData, Element, Window, Document, Selection, ServerClientRoot } from '../common';
/**
 * Called right away to initialize preboot
 *
 * @param opts All the preboot options
 */
export declare function init(opts: PrebootRecordOptions, win?: Window): void;
/**
 * We want to attach event handlers as soon as possible. Unfortunately this
 * means before DOMContentLoaded fires, so we need to look for document.body to
 * exist instead.
 * @param data
 */
export declare function waitUntilReady(data: PrebootData, win?: Window): void;
/**
 * Start up preboot by going through each app and assigning the appropriate
 * handlers. Normally this wouldn't be called directly, but we have set it up so
 * that it can for older versions of Universal.
 *
 * @param prebootData Global preboot data object that contains options and will
 * have events
 * @param win Optional param to pass in mock window for testing purposes
 */
export declare function start(prebootData: PrebootData, win?: Window): void;
/**
 * Create an overlay div and add it to the DOM so it can be used
 * if a freeze event occurs
 *
 * @param document The global document object (passed in for testing purposes)
 * @returns Element The overlay node is returned
 */
export declare function createOverlay(document: Document): Element;
/**
 * Get references to all app root nodes based on input options. Users can
 * initialize preboot either by specifying appRoot which is just one or more
 * selectors for apps. This section option is useful for people that are doing their own
 * buffering (i.e. they have their own client and server view)
 *
 * @param document The global document object passed in for testing purposes
 * @param opts Options passed in by the user to init()
 * @returns ServerClientRoot[] An array of root info for each app
 */
export declare function getAppRoots(document: Document, opts: PrebootRecordOptions): ServerClientRoot[];
/**
 * Under given server root, for given selector, record events
 *
 * @param prebootData
 * @param appData
 * @param eventSelector
 */
export declare function handleEvents(prebootData: PrebootData, appData: PrebootAppData, eventSelector: EventSelector): void;
/**
 * Create handler for events that we will record
 */
export declare function createListenHandler(prebootData: PrebootData, eventSelector: EventSelector, appData: PrebootAppData, node: Element): Function;
/**
 * Get the selection data that is later used to set the cursor after client view
 * is active
 */
export declare function getSelection(node: Element): Selection;
/**
 * Create buffer for a given node
 *
 * @param root All the data related to a particular app
 * @returns {Element} Returns the root client node.
 */
export declare function createBuffer(root: ServerClientRoot): Element;
