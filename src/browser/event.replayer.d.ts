import { PrebootAppData, PrebootData, PrebootEvent, Element, NodeContext } from '../common';
import { WindowRef } from './window';
export declare class EventReplayer {
    private window;
    clientNodeCache: {
        [key: string]: Element;
    };
    replayStarted: boolean;
    constructor(window: WindowRef);
    /**
     * Replay all events for all apps. this can only be run once.
     * if called multiple times, will only do something once
     */
    replayAll(): void;
    /**
     * Replay all events for one app (most of the time there is just one app)
     * @param appData
     * @param opts
     */
    replayForApp(appData: PrebootAppData): void;
    /**
     * Replay one particular event
     * @param appData
     * @param prebootEvent
     */
    replayEvent(appData: PrebootAppData, prebootEvent: PrebootEvent): void;
    /**
     * Switch the buffer for one particular app (i.e. display the client
     * view and destroy the server view)
     * @param appData
     */
    switchBuffer(appData: PrebootAppData): void;
    /**
     * Finally, set focus, remove all the event listeners and remove
     * any freeze screen that may be there
     * @param prebootData
     */
    cleanup(prebootData: PrebootData): void;
    setFocus(activeNode: NodeContext): void;
    /**
     * Given a node from the server rendered view, find the equivalent
     * node in the client rendered view. We do this by the following approach:
     *      1. take the name of the server node tag (ex. div or h1 or input)
     *      2. add either id (ex. div#myid) or class names (ex. div.class1.class2)
     *      3. use that value as a selector to get all the matching client nodes
     *      4. loop through all client nodes found and for each generate a key value
     *      5. compare the client key to the server key; once there is a match,
     *          we have our client node
     *
     * NOTE: this only works when the client view is almost exactly the same as
     * the server view. we will need an improvement here in the future to account
     * for situations where the client view is different in structure from the
     * server view
     */
    findClientNode(serverNodeContext: NodeContext): Element;
}
