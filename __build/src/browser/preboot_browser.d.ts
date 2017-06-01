/**
 * This is the entry point for the client side preboot library. At a high level, this library
 * is used to facilitate the switch from the server view to the client view. Specifically that
 * means:
 *
 *    1. Replay stored server view events on client view
 *    2. Switch buffer from server view to client view
 *    3. Reset focus on client view
 */
import { PrebootCompleteOptions, PrebootAppData, PrebootData, PrebootEvent, NodeContext, Element, Window } from '../preboot_interfaces';
export declare function prebootClient(): {
    complete: (opts?: PrebootCompleteOptions) => void;
    completeApp: (opts: PrebootCompleteOptions, appData: PrebootAppData) => void;
    replayEvent: (appData: PrebootAppData, prebootEvent: PrebootEvent) => void;
    switchBuffer: (window: Window, appData: PrebootAppData) => void;
    removeOverlay: (window: Window) => void;
    cleanup: (window: Window, prebootData: PrebootData) => void;
    setFocus: (activeNode: NodeContext) => void;
    findClientNode: (serverNodeContext: NodeContext) => Element;
    getNodeKey: (nodeContext: NodeContext) => string;
};
