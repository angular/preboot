/**
 * This is the entire inline JavaScript used for preboot. The way it works is that
 * the server side library for preboot calls toString() on the prebootstrap() function
 * and then injects the resulting JavaScript directly into the server view.
 *
 * As a result, all the code must be within the one prebootstrap() function and it
 * can't use any external dependencies other than interfaces.
 *
 * The final result of this code is to have a global object called prebootData which
 * hangs off the window and can be accessed by the preboot client code to replay
 * events, switch buffers and facilitate the switch from server view to client view.
 */
import { EventSelector, PrebootOptions, PrebootAppData, PrebootData, Element, NodeContext, Document, Selection, ServerClientRoot } from '../preboot_interfaces';
/**
 * The purpose of this wrapper function is simply to have an easy way for the preboot node
 * library to generate the inline code without any downstream deps (like webpack). Basically,
 * the node library get this JavaScript by calling prebootstrap.toString() then it adds
 *
 * prebootstrap().init(opts);
 */
export declare function prebootstrap(): {
    init: (opts: PrebootOptions) => void;
    start: (document: Document, prebootData: PrebootData) => void;
    createOverlay: (document: Document) => Element;
    getAppRoots: (document: Document, opts: PrebootOptions) => ServerClientRoot[];
    handleEvents: (prebootData: PrebootData, appData: PrebootAppData, eventSelector: EventSelector) => void;
    createListenHandler: (prebootData: PrebootData, eventSelector: EventSelector, appData: PrebootAppData, node: Element) => Function;
    getNodeKey: (nodeContext: NodeContext) => string;
    getSelection: (node: Element) => Selection;
    createBuffer: (root: ServerClientRoot) => Element;
};
