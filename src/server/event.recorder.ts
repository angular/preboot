import {
    EventSelector,
    PrebootRecordOptions,
    PrebootAppData,
    PrebootData,
    Element,
    DomEvent,
    Window,
    Document,
    Selection,
    ServerClientRoot,
    getNodeKeyForPreboot
} from '../common';

/**
 * Called right away to initialize preboot
 *
 * @param opts All the preboot options
 */
export function init(opts: PrebootRecordOptions, win?: Window) {
  const theWindow = <Window>(win || window);

  // add the preboot options to the preboot data and then add the data to
  // the window so it can be used later by the client
  const data = theWindow.prebootData = <PrebootData>{
    opts: opts,
    listening: true,
    apps: [],
    listeners: []
  };

  // start up preboot listening as soon as the DOM is ready
  waitUntilReady(data);
}

/**
 * We want to attach event handlers as soon as possible. Unfortunately this
 * means before DOMContentLoaded fires, so we need to look for document.body to
 * exist instead.
 * @param data
 */
export function waitUntilReady(data: PrebootData, win?: Window) {
  const theWindow = <Window>(win || window);
  const document = <Document>(theWindow.document || {});

  if (document.body) {
    start(data);
  } else {
    setTimeout(function() {
      waitUntilReady(data);
    }, 10);
  }
}

/**
 * Start up preboot by going through each app and assigning the appropriate
 * handlers. Normally this wouldn't be called directly, but we have set it up so
 * that it can for older versions of Universal.
 *
 * @param prebootData Global preboot data object that contains options and will
 * have events
 * @param win Optional param to pass in mock window for testing purposes
 */
export function start(prebootData: PrebootData, win?: Window) {
  const theWindow = <Window>(win || window);

  // only start once
  if (theWindow.prebootStarted) {
    return;
  } else {
    theWindow.prebootStarted = true;
  }

  const document = <Document>(theWindow.document || {});
  const opts = prebootData.opts || {} as PrebootRecordOptions;
  const eventSelectors = opts.eventSelectors || [];

  // create an overlay that can be used later if a freeze event occurs
  prebootData.overlay = createOverlay(document);

  // get an array of all the root info
  const appRoots = getAppRoots(document, prebootData.opts);

  // for each app root
  appRoots.forEach(function(root) {

    // we track all events for each app in the prebootData object which is on
    // the global scope
    const appData = <PrebootAppData>{root: root, events: []};
    prebootData.apps.push(appData);

    // loop through all the eventSelectors and create event handlers
    eventSelectors.forEach(eventSelector => handleEvents(prebootData, appData, eventSelector));
  });
}

/**
 * Create an overlay div and add it to the DOM so it can be used
 * if a freeze event occurs
 *
 * @param document The global document object (passed in for testing purposes)
 * @returns Element The overlay node is returned
 */
export function createOverlay(document: Document): Element {
  const overlay = document.createElement('div');
  overlay.setAttribute('id', 'prebootOverlay');
  overlay.setAttribute('style',
      'display:none;position:absolute;left:0;' +
      'top:0;width:100%;height:100%;z-index:999999;background:black;opacity:.3');
  document.body.appendChild(overlay);
  return overlay;
}

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
export function getAppRoots(document: Document, opts: PrebootRecordOptions): ServerClientRoot[] {
  const roots: ServerClientRoot[] = [];

  // loop through any appRoot selectors to add them to the list of roots
  if (opts.appRoot && opts.appRoot.length) {
    const appRootSelectors = [].concat(opts.appRoot);
    appRootSelectors.forEach(selector => roots.push({ serverSelector: selector }));
  }

  // now loop through the roots to get the nodes for each root
  roots.forEach(function(root) {
    root.serverNode = document.querySelector(root.serverSelector);
    root.clientSelector = root.clientSelector || root.serverSelector;

    if (root.clientSelector !== root.serverSelector) {
      // if diff selectors, then just get the client node
      root.clientNode = document.querySelector(root.clientSelector);

    } else if (opts.buffer) {
      // if we are doing buffering, we need to create the buffer for the client
      root.clientNode = createBuffer(root);

    } else {
      // else the client root is the same as the server
      root.clientNode = root.serverNode;
    }

    // if no server node found, log error
    if (!root.serverNode) {
      console.log('No server node found for selector: ' + root.serverSelector);
    }
  });

  return roots;
}

/**
 * Under given server root, for given selector, record events
 *
 * @param prebootData
 * @param appData
 * @param eventSelector
 */
export function handleEvents(prebootData: PrebootData, appData: PrebootAppData, eventSelector: EventSelector) {
  const serverRoot = appData.root.serverNode;

  // don't do anything if no server root
  if (!serverRoot) {
    return;
  }

  // get all nodes under the server root that match the given selector
  const nodes = <[Element]>serverRoot.querySelectorAll(eventSelector.selector);

  // don't do anything if no nodes found
  if (!nodes) {
    return;
  }

  // we want to add an event listener for each node and each event
  for (const node of nodes) {
    eventSelector.events.forEach(function(eventName: string) {

      // get the appropriate handler and add it as an event listener
      const handler = createListenHandler(prebootData, eventSelector, appData, node);
      node.addEventListener(eventName, handler);

      // need to keep track of listeners so we can do node.removeEventListener()
      // when preboot done
      prebootData.listeners.push(
          {node: node, eventName: eventName, handler: handler});
    });
  }
}

/**
 * Create handler for events that we will record
 */
export function createListenHandler(
    prebootData: PrebootData,
    eventSelector: EventSelector,
    appData: PrebootAppData,
    node: Element
): Function {

  const CARET_EVENTS = ['keyup', 'keydown', 'focusin', 'mouseup', 'mousedown'];
  const CARET_NODES = ['INPUT', 'TEXTAREA'];

  return function(event: DomEvent) {
    const root = appData.root;
    const eventName = event.type;

    // if no node or no event name or not listening, just return
    if (!node || !eventName) {
      return;
    }

    // if key codes set for eventSelector, then don't do anything if event
    // doesn't include key
    const keyCodes = eventSelector.keyCodes;
    if (keyCodes && keyCodes.length) {
      const matchingKeyCodes =
          keyCodes.filter((keyCode) => event.which === keyCode);

      // if there are not matches (i.e. key entered NOT one of the key codes)
      // then don't do anything
      if (!matchingKeyCodes.length) {
        return;
      }
    }

    // if for a given set of events we are preventing default, do that
    if (eventSelector.preventDefault) {
      event.preventDefault();
    }

    // if an action handler passed in, use that
    if (eventSelector.action) {
      eventSelector.action(node, event);
    }

    // get the node key for a given node
    const nodeKey = getNodeKeyForPreboot({root: root, node: node});

    // if event on input or text area, record active node
    if (CARET_EVENTS.indexOf(eventName) >= 0 &&
        CARET_NODES.indexOf(node.tagName) >= 0) {
      prebootData.activeNode = {
        root: root,
        node: node,
        nodeKey: nodeKey,
        selection: getSelection(node)
      };
    } else if (eventName !== 'change' && eventName !== 'focusout') {
      ;
      prebootData.activeNode = null;
    }

    // if we are freezing the UI
    if (eventSelector.freeze) {
      const overlay = prebootData.overlay;

      // show the overlay
      overlay.style.display = 'block';

      // hide the overlay after 10 seconds just in case preboot.complete() never
      // called
      setTimeout(function() {
        overlay.style.display = 'none';
      }, 10000);
    }

    // we will record events for later replay unless explicitly marked as
    // doNotReplay
    if (!eventSelector.noReplay) {
      appData.events.push(
          {node: node, nodeKey: nodeKey, event: event, name: eventName});
    }
  };
}

/**
 * Get the selection data that is later used to set the cursor after client view
 * is active
 */
export function getSelection(node: Element): Selection {
  node = node || {};

  const nodeValue = node.value || '';
  const selection = <Selection>{
    start: nodeValue.length,
    end: nodeValue.length,
    direction: 'forward'
  };

  // if browser support selectionStart on node (Chrome, FireFox, IE9+)
  try {
    if (node.selectionStart || node.selectionStart === 0) {
      selection.start = node.selectionStart;
      selection.end = node.selectionEnd;
      selection.direction = node.selectionDirection;
    }
  } catch (ex) {}

  return selection;
}

/**
 * Create buffer for a given node
 *
 * @param root All the data related to a particular app
 * @returns {Element} Returns the root client node.
 */
export function createBuffer(root: ServerClientRoot): Element {
  const serverNode = root.serverNode;

  // if no rootServerNode OR the selector is on the entire html doc or the body
  // OR no parentNode, don't buffer
  if (!serverNode || !serverNode.parentNode || root.serverSelector === 'html' ||
      root.serverSelector === 'body') {
    return serverNode;
  }

  // create shallow clone of server root
  const rootClientNode = serverNode.cloneNode(false);
  if (rootClientNode) {
    // we want the client to write to a hidden div until the time for switching
    // the buffers
    rootClientNode.style.display = 'none';

    // insert the client node before the server and return it
    serverNode.parentNode.insertBefore(rootClientNode, serverNode);
  }

  // return the rootClientNode
  return rootClientNode;
}
