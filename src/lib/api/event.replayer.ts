/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {
  NodeContext,
  PrebootAppData,
  PrebootData,
  PrebootEvent,
  PrebootWindow,
  ServerClientRoot,
} from '../common/preboot.interfaces';
import {getNodeKeyForPreboot} from '../common/get-node-key';

export function _window(): PrebootWindow {
  return {
    prebootData: (window as any)['prebootData'],
    getComputedStyle: window.getComputedStyle,
    document: document
  };
}

export class EventReplayer {
  clientNodeCache: { [key: string]: Element } = {};
  replayStarted = false;
  win: PrebootWindow;

  /**
   * Window setting and getter to facilitate testing of window
   * in non-browser environments
   */
  setWindow(win: PrebootWindow) {
    this.win = win;
  }

  /**
   * Window setting and getter to facilitate testing of window
   * in non-browser environments
   */
  getWindow() {
    if (!this.win) {
      this.win = _window();
    }
    return this.win;
  }

  /**
   * Replay all events for all apps. this can only be run once.
   * if called multiple times, will only do something once
   */
  replayAll() {
    if (this.replayStarted) {
      return;
    } else {
      this.replayStarted = true;
    }

    // loop through each of the preboot apps
    const prebootData = this.getWindow().prebootData || {};
    const apps = prebootData.apps || [];
    apps.forEach(appData => this.replayForApp(appData));

    // once all events have been replayed and buffers switched, then we cleanup preboot
    this.cleanup(prebootData);
  }

  /**
   * Replay all events for one app (most of the time there is just one app)
   * @param appData
   */
  replayForApp(appData: PrebootAppData) {
    appData = <PrebootAppData>(appData || {});

    // try catch around events b/c even if error occurs, we still move forward
    try {
      const events = appData.events || [];

      // replay all the events from the server view onto the client view
      events.forEach(event => this.replayEvent(appData, event));
    } catch (ex) {
      console.error(ex);
    }

    // if we are buffering, switch the buffers
    this.switchBuffer(appData);
  }

  /**
   * Replay one particular event
   * @param appData
   * @param prebootEvent
   */
  replayEvent(appData: PrebootAppData, prebootEvent: PrebootEvent) {
    appData = <PrebootAppData>(appData || {});
    prebootEvent = <PrebootEvent>(prebootEvent || {});

    const event = prebootEvent.event as Event;
    const serverNode = prebootEvent.node || {};
    const nodeKey = prebootEvent.nodeKey;
    const clientNode = this.findClientNode({
      root: appData.root,
      node: serverNode,
      nodeKey: nodeKey
    });

    // if client node can't be found, log a warning
    if (!clientNode) {
      console.warn(
        `Trying to dispatch event ${event.type} to node ${nodeKey}
        but could not find client node. Server node is: ${serverNode}`
      );
      return;
    }

    // now dispatch events and whatnot to the client node
    (clientNode as HTMLInputElement).checked = serverNode.checked;
    (clientNode as HTMLOptionElement).selected = serverNode.selected;
    (clientNode as HTMLOptionElement).value = serverNode.value;
    clientNode.dispatchEvent(event);
  }

  /**
   * Switch the buffer for one particular app (i.e. display the client
   * view and destroy the server view)
   * @param appData
   */
  switchBuffer(appData: PrebootAppData) {
    appData = <PrebootAppData>(appData || {});

    const root = <ServerClientRoot>(appData.root || {});
    const serverView = root.serverNode;
    const clientView = root.clientNode;

    // if no client view or the server view is the body or client
    // and server view are the same, then don't do anything and return
    if (!clientView || !serverView || serverView === clientView || serverView.nodeName === 'BODY') {
      return;
    }

    // do a try-catch just in case something messed up
    try {
      // get the server view display mode
      const gcs = this.getWindow().getComputedStyle;
      const display = gcs(serverView).getPropertyValue('display') || 'block';

      // first remove the server view
      serverView.remove ? serverView.remove() : (serverView.style.display = 'none');

      // now add the client view
      clientView.style.display = display;
    } catch (ex) {
      console.error(ex);
    }
  }

  /**
   * Finally, set focus, remove all the event listeners and remove
   * any freeze screen that may be there
   * @param prebootData
   */
  cleanup(prebootData: PrebootData) {
    prebootData = prebootData || {};

    const listeners = prebootData.listeners || [];

    // set focus on the active node AFTER a small delay to ensure buffer
    // switched
    const activeNode = prebootData.activeNode;
    if (activeNode != null) {
      setTimeout(() => this.setFocus(activeNode), 1);
    }

    // remove all event listeners
    for (const listener of listeners) {
      listener.node.removeEventListener(listener.eventName, listener.handler);
    }

    // remove the freeze overlay if it exists
    const doc = this.getWindow().document;
    const prebootOverlay = doc.getElementById('prebootOverlay');
    if (prebootOverlay) {
      prebootOverlay.remove ?
        prebootOverlay.remove() : prebootOverlay.parentNode !== null ?
        prebootOverlay.parentNode.removeChild(prebootOverlay) :
        prebootOverlay.style.display = 'none';
    }

    // clear out the data stored for each app
    prebootData.apps = [];
    this.clientNodeCache = {};

    // send event to document that signals preboot complete
    // constructor is not supported by older browsers ( i.e. IE9-11 )
    // in these browsers, the type of CustomEvent will be "object"
    if (typeof CustomEvent === 'function') {
      const completeEvent = new CustomEvent('PrebootComplete');
      doc.dispatchEvent(completeEvent);
    } else {
      console.warn(`Could not dispatch PrebootComplete event.
       You can fix this by including a polyfill for CustomEvent.`);
    }
  }

  setFocus(activeNode: NodeContext) {
    // only do something if there is an active node
    if (!activeNode || !activeNode.node || !activeNode.nodeKey) {
      return;
    }

    // find the client node in the new client view
    const clientNode = this.findClientNode(activeNode);
    if (clientNode) {
      // set focus on the client node
      clientNode.focus();

      // set selection if a modern browser (i.e. IE9+, etc.)
      const selection = activeNode.selection;
      if ((clientNode as HTMLInputElement).setSelectionRange && selection) {
        try {
          (clientNode as HTMLInputElement)
            .setSelectionRange(selection.start, selection.end, selection.direction);
        } catch (ex) {}
      }
    }
  }

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
  findClientNode(serverNodeContext: NodeContext): HTMLElement | null {
    serverNodeContext = <NodeContext>(serverNodeContext || {});

    const serverNode = serverNodeContext.node;
    const root = serverNodeContext.root;

    // if no server or client root, don't do anything
    if (!root || !root.serverNode || !root.clientNode) {
      return null;
    }

    // we use the string of the node to compare to the client node & as key in
    // cache
    const serverNodeKey = serverNodeContext.nodeKey || getNodeKeyForPreboot(serverNodeContext);

    // if client node already in cache, return it
    if (this.clientNodeCache[serverNodeKey]) {
      return this.clientNodeCache[serverNodeKey] as HTMLElement;
    }

    // get the selector for client nodes
    const className = (serverNode.className || '').replace('ng-binding', '').trim();
    let selector = serverNode.tagName;

    if (serverNode.id) {
      selector += `#${serverNode.id}`;
    } else if (className) {
      selector += `.${className.replace(/ /g, '.')}`;
    }

    // select all possible client nodes and look through them to try and find a
    // match
    const rootClientNode = root.clientNode;
    let clientNodes = rootClientNode.querySelectorAll(selector);

    // if nothing found, then just try the tag name as a final option
    if (!clientNodes.length) {
      console.log(`nothing found for ${selector} so using ${serverNode.tagName}`);
      clientNodes = rootClientNode.querySelectorAll(serverNode.tagName);
    }

    const length = clientNodes.length;
    for (let i = 0; i < length; i++) {
      const clientNode = clientNodes.item(i);

      // get the key for the client node
      const clientNodeKey = getNodeKeyForPreboot({
        root: root,
        node: clientNode
      });

      // if the client node key is exact match for the server node key, then we
      // found the client node
      if (clientNodeKey === serverNodeKey) {
        this.clientNodeCache[serverNodeKey] = clientNode;
        return clientNode as HTMLElement;
      }
    }

    // if we get here and there is one clientNode, use it as a fallback
    if (clientNodes.length === 1) {
      this.clientNodeCache[serverNodeKey] = clientNodes[0];
      return clientNodes[0] as HTMLElement;
    }

    // if we get here it means we couldn't find the client node so give the user
    // a warning
    console.warn(
      `No matching client node found for ${serverNodeKey}.
       You can fix this by assigning this element a unique id attribute.`
    );
    return null;
  }
}
