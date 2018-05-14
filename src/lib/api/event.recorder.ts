/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {
  EventSelector,
  getNodeKeyForPreboot,
  PrebootOptions,
  PrebootAppData,
  PrebootData,
  DomEvent,
  PrebootWindow,
  ServerClientRoot,
  PrebootSelection,
  PrebootSelectionDirection,
} from 'preboot/common';

/**
 * Called right away to initialize preboot
 *
 * @param opts All the preboot options
 * @param win
 */
export function initAll(opts: PrebootOptions, win?: PrebootWindow) {
  const theWindow = <PrebootWindow>(win || window);

  // Add the preboot options to the preboot data and then add the data to
  // the window so it can be used later by the client.
  // Only set new options if they're not already set - we may have multiple app roots
  // and each of them invokes the init function separately.
  const data = (theWindow.prebootData = <PrebootData>{
    opts: opts,
    apps: [],
    listeners: []
  });

  return () => start(data, theWindow);
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
export function start(prebootData: PrebootData, win?: PrebootWindow) {
  const theWindow = <PrebootWindow>(win || window);
  const _document = <Document>(theWindow.document || {});

  // Remove the current script from the DOM so that child indexes match
  // between the client & the server. The script is already running so it
  // doesn't affect it.
  const currentScript = _document.currentScript ||
    // Support: IE 9-11 only
    // IE doesn't support document.currentScript. Since the script is invoked
    // synchronously, though, the current running script is just the last one
    // currently in the document.
    [].slice.call(_document.getElementsByTagName('script'), -1)[0];

  if (!currentScript) {
    console.error('Preboot initialization failed, no currentScript has been detected.');
    return;
  }

  let serverNode = currentScript.parentNode;
  if (!serverNode) {
    console.error('Preboot initialization failed, the script is detached');
    return;
  }

  serverNode.removeChild(_document.currentScript);

  const opts = prebootData.opts || ({} as PrebootOptions);
  let eventSelectors = opts.eventSelectors || [];

  // get the root info
  const appRoot = prebootData.opts ? getAppRoot(_document, prebootData.opts, serverNode) : null;

  // we track all events for each app in the prebootData object which is on
  // the global scope; each `start` invocation adds data for one app only.
  const appData = <PrebootAppData>{ root: appRoot, events: [] };
  if (prebootData.apps) {
    prebootData.apps.push(appData);
  }

  eventSelectors = eventSelectors.map(eventSelector => {
    if (!eventSelector.hasOwnProperty('replay')) {
      eventSelector.replay = true;
    }
    return eventSelector;
  });

  // loop through all the eventSelectors and create event handlers
  eventSelectors.forEach(eventSelector =>
    handleEvents(_document, prebootData, appData, eventSelector));
}

/**
 * Create an overlay div and add it to the DOM so it can be used
 * if a freeze event occurs
 *
 * @param _document The global document object (passed in for testing purposes)
 * @returns Element The overlay node is returned
 */
export function createOverlay(_document: Document): HTMLElement | undefined {
  let overlay = _document.createElement('div');
  overlay.setAttribute('id', 'prebootOverlay');
  overlay.setAttribute(
    'style',
    'display:none;position:absolute;left:0;' +
    'top:0;width:100%;height:100%;z-index:999999;background:black;opacity:.3'
  );
  _document.documentElement.appendChild(overlay);

  return overlay;
}

/**
 * Get references to the current app root node based on input options. Users can
 * initialize preboot either by specifying appRoot which is just one or more
 * selectors for apps. This section option is useful for people that are doing their own
 * buffering (i.e. they have their own client and server view)
 *
 * @param _document The global document object used to attach the overlay
 * @param opts Options passed in by the user to init()
 * @param serverNode The server node serving as application root
 * @returns ServerClientRoot An array of root info for the current app
 */
export function getAppRoot(
  _document: Document,
  opts: PrebootOptions,
  serverNode: HTMLElement
): ServerClientRoot {
  const root: ServerClientRoot = {serverNode};

  // if we are doing buffering, we need to create the buffer for the client
  // else the client root is the same as the server
  root.clientNode = opts.buffer ? createBuffer(root) : root.serverNode;

  // create an overlay that can be used later if a freeze event occurs
  root.overlay = createOverlay(_document);

  return root;
}

/**
 * Under given server root, for given selector, record events
 *
 * @param _document
 * @param prebootData
 * @param appData
 * @param eventSelector
 */
export function handleEvents(_document: Document,
                             prebootData: PrebootData,
                             appData: PrebootAppData,
                             eventSelector: EventSelector) {
  const serverRoot = appData.root.serverNode;

  // don't do anything if no server root
  if (!serverRoot) {
    return;
  }

  // Attach delegated event listeners for each event selector.
  // We need to use delegated events as only the top level server node
  // exists at this point.
  eventSelector.events.forEach((eventName: string) => {
    // get the appropriate handler and add it as an event listener
    const handler = createListenHandler(_document, prebootData, eventSelector, appData);
    // attach the handler in the capture phase so that it fires even if
    // one of the handlers below calls stopPropagation()
    serverRoot.addEventListener(eventName, handler, true);

    // need to keep track of listeners so we can do node.removeEventListener()
    // when preboot done
    if (prebootData.listeners) {
      prebootData.listeners.push({
        node: serverRoot,
        eventName,
        handler
      });
    }
  });
}

/**
 * Create handler for events that we will record
 */
export function createListenHandler(
  _document: Document,
  prebootData: PrebootData,
  eventSelector: EventSelector,
  appData: PrebootAppData
): EventListener {
  const CARET_EVENTS = ['keyup', 'keydown', 'focusin', 'mouseup', 'mousedown'];
  const CARET_NODES = ['INPUT', 'TEXTAREA'];

  // Support: IE 9-11 only
  // IE uses a prefixed `matches` version
  const matches = _document.documentElement.matches ||
    _document.documentElement.msMatchesSelector;

  return function(event: DomEvent) {
    const node: Element = event.target;

    // a delegated handlers on document is used so we need to check if
    // event target matches a desired selector
    if (!matches.call(node, eventSelector.selector)) {
      return;
    }

    const root = appData.root;
    const eventName = event.type;

    // if no node or no event name, just return
    if (!node || !eventName) {
      return;
    }

    // if key codes set for eventSelector, then don't do anything if event
    // doesn't include key
    const keyCodes = eventSelector.keyCodes;
    if (keyCodes && keyCodes.length) {
      const matchingKeyCodes = keyCodes.filter(keyCode => event.which === keyCode);

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
    const nodeKey = getNodeKeyForPreboot({ root: root, node: node });

    // if event on input or text area, record active node
    if (CARET_EVENTS.indexOf(eventName) >= 0 &&
      CARET_NODES.indexOf(node.tagName ? node.tagName : '') >= 0) {
      prebootData.activeNode = {
        root: root,
        node: node,
        nodeKey: nodeKey,
        selection: getSelection(node as HTMLInputElement)
      };
    } else if (eventName !== 'change' && eventName !== 'focusout') {
      prebootData.activeNode = undefined;
    }

    // if we are freezing the UI
    if (eventSelector.freeze) {
      const overlay = root.overlay as HTMLElement;

      // show the overlay
      overlay.style.display = 'block';

      // hide the overlay after 10 seconds just in case preboot.complete() never
      // called
      setTimeout(() => {
        overlay.style.display = 'none';
      }, 10000);
    }

    // we will record events for later replay unless explicitly marked as
    // doNotReplay
    if (eventSelector.replay) {
      appData.events.push({
        node,
        nodeKey,
        event,
        name: eventName
      });
    }
  };
}

/**
 * Get the selection data that is later used to set the cursor after client view
 * is active
 */
export function getSelection(node: HTMLInputElement): PrebootSelection {
  node = node || {} as HTMLInputElement;

  const nodeValue = node.value || '';
  const selection: PrebootSelection = {
    start: nodeValue.length,
    end: nodeValue.length,
    direction: 'forward'
  };

  // if browser support selectionStart on node (Chrome, FireFox, IE9+)
  try {
    if (node.selectionStart || node.selectionStart === 0) {
      selection.start = node.selectionStart;
      selection.end = node.selectionEnd ? node.selectionEnd : 0;
      selection.direction = node.selectionDirection ?
        node.selectionDirection as PrebootSelectionDirection : 'none';
    }
  } catch (ex) {}

  return selection;
}

/**
 * Create buffer for a given node
 *
 * @param root All the data related to a particular app
 * @returns Returns the root client node.
 */
export function createBuffer(root: ServerClientRoot): HTMLElement {
  const serverNode = root.serverNode;

  // if no rootServerNode OR the selector is on the entire html doc or the body
  // OR no parentNode, don't buffer
  if (!serverNode || !serverNode.parentNode ||
    serverNode === document.documentElement || serverNode === document.body) {
    return serverNode as HTMLElement;
  }

  // create shallow clone of server root
  const rootClientNode = serverNode.cloneNode(false) as HTMLElement;
  // we want the client to write to a hidden div until the time for switching
  // the buffers
  rootClientNode.style.display = 'none';

  // insert the client node before the server and return it
  serverNode.parentNode.insertBefore(rootClientNode, serverNode);

  // mark server node as not to be touched by AngularJS - needed for ngUpgrade
  serverNode.setAttribute('ng-non-bindable', '');

  // return the rootClientNode
  return rootClientNode;
}
