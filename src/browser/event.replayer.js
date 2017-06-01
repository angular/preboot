"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var common_1 = require("../common");
var window_1 = require("./window");
var EventReplayer = (function () {
    function EventReplayer(window) {
        this.window = window;
        this.clientNodeCache = {};
        this.replayStarted = false;
    }
    /**
     * Replay all events for all apps. this can only be run once.
     * if called multiple times, will only do something once
     */
    EventReplayer.prototype.replayAll = function () {
        var _this = this;
        if (this.replayStarted) {
            return;
        }
        else {
            this.replayStarted = true;
        }
        // loop through each of the preboot apps
        var prebootData = this.window.prebootData || {};
        var apps = prebootData.apps || [];
        apps.forEach(function (appData) { return _this.replayForApp(appData); });
        // once all events have been replayed and buffers switched, then we cleanup preboot
        this.cleanup(prebootData);
    };
    /**
     * Replay all events for one app (most of the time there is just one app)
     * @param appData
     * @param opts
     */
    EventReplayer.prototype.replayForApp = function (appData) {
        var _this = this;
        appData = (appData || {});
        // try catch around events b/c even if error occurs, we still move forward
        try {
            var root = (appData.root || {});
            var events = appData.events || [];
            // some client side frameworks (like Angular 1 w UI Router) will replace
            // elements, so we need to re-get client root just to be safe
            root.clientNode = this.window.document.querySelector(root.clientSelector);
            // replay all the events from the server view onto the client view
            events.forEach(function (event) { return _this.replayEvent(appData, event); });
        }
        catch (ex) {
            console.error(ex);
        }
        // if we are buffering, switch the buffers
        this.switchBuffer(appData);
    };
    /**
     * Replay one particular event
     * @param appData
     * @param prebootEvent
     */
    EventReplayer.prototype.replayEvent = function (appData, prebootEvent) {
        appData = (appData || {});
        prebootEvent = (prebootEvent || {});
        var event = prebootEvent.event;
        var serverNode = prebootEvent.node || {};
        var nodeKey = prebootEvent.nodeKey;
        var clientNode = this.findClientNode({
            root: appData.root,
            node: serverNode,
            nodeKey: nodeKey
        });
        // if client node can't be found, log a warning
        if (!clientNode) {
            console.warn('Trying to dispatch event ' + event.type + ' to node ' + nodeKey +
                ' but could not find client node. ' +
                'Server node is: ');
            console.log(serverNode);
            return;
        }
        // now dispatch events and whatnot to the client node
        clientNode.checked = serverNode.checked ? true : undefined;
        clientNode.selected = serverNode.selected ? true : undefined;
        clientNode.value = serverNode.value;
        clientNode.dispatchEvent(event);
    };
    /**
     * Switch the buffer for one particular app (i.e. display the client
     * view and destroy the server view)
     * @param appData
     */
    EventReplayer.prototype.switchBuffer = function (appData) {
        appData = (appData || {});
        var root = (appData.root || {});
        var serverView = root.serverNode;
        var clientView = root.clientNode;
        // if no client view or the server view is the body or client
        // and server view are the same, then don't do anything and return
        if (!clientView || !serverView || serverView === clientView ||
            serverView.nodeName === 'BODY') {
            return;
        }
        // do a try-catch just in case something messed up
        try {
            // get the server view display mode
            var display = this.window.getComputedStyle(serverView).getPropertyValue('display') || 'block';
            // first remove the server view
            serverView.remove ? serverView.remove() :
                serverView.style.display = 'none';
            // now add the client view
            clientView.style.display = display;
        }
        catch (ex) {
            console.error(ex);
        }
    };
    /**
     * Finally, set focus, remove all the event listeners and remove
     * any freeze screen that may be there
     * @param prebootData
     */
    EventReplayer.prototype.cleanup = function (prebootData) {
        var _this = this;
        prebootData = prebootData || {};
        var listeners = prebootData.listeners || [];
        // set focus on the active node AFTER a small delay to ensure buffer
        // switched
        setTimeout(function () { return _this.setFocus(prebootData.activeNode); }, 1);
        // remove all event listeners
        for (var _i = 0, listeners_1 = listeners; _i < listeners_1.length; _i++) {
            var listener = listeners_1[_i];
            listener.node.removeEventListener(listener.eventName, listener.handler);
        }
        // remove the freeze overlay if it exists
        var prebootOverlay = this.window.document.body.querySelector('#prebootOverlay');
        if (prebootOverlay) {
            prebootOverlay.style.display = 'none';
        }
        // finally clear out the data stored for each app
        prebootData.apps = [];
        this.clientNodeCache = {};
    };
    EventReplayer.prototype.setFocus = function (activeNode) {
        // only do something if there is an active node
        if (!activeNode || !activeNode.node || !activeNode.nodeKey) {
            return;
        }
        // find the client node in the new client view
        var clientNode = this.findClientNode(activeNode);
        if (clientNode) {
            // set focus on the client node
            clientNode.focus();
            // set selection if a modern browser (i.e. IE9+, etc.)
            var selection = activeNode.selection;
            if (clientNode.setSelectionRange && selection) {
                clientNode.setSelectionRange(selection.start, selection.end, selection.direction);
            }
        }
    };
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
    EventReplayer.prototype.findClientNode = function (serverNodeContext) {
        serverNodeContext = (serverNodeContext || {});
        var serverNode = serverNodeContext.node;
        var root = serverNodeContext.root;
        // if no server or client root, don't do anything
        if (!root || !root.serverNode || !root.clientNode) {
            return null;
        }
        // we use the string of the node to compare to the client node & as key in
        // cache
        var serverNodeKey = serverNodeContext.nodeKey || common_1.getNodeKeyForPreboot(serverNodeContext);
        // if client node already in cache, return it
        if (this.clientNodeCache[serverNodeKey]) {
            return this.clientNodeCache[serverNodeKey];
        }
        // get the selector for client nodes
        var className = (serverNode.className || '').replace('ng-binding', '').trim();
        var selector = serverNode.tagName;
        if (serverNode.id) {
            selector += '#' + serverNode.id;
        }
        else if (className) {
            selector += '.' + className.replace(/ /g, '.');
        }
        // select all possible client nodes and look through them to try and find a
        // match
        var rootClientNode = root.clientNode;
        var clientNodes = rootClientNode.querySelectorAll(selector) || [];
        // if nothing found, then just try the tag name as a final option
        if (!clientNodes.length) {
            console.log('nothing found for ' + selector + ' so using ' + serverNode.tagName);
            clientNodes = rootClientNode.querySelectorAll(serverNode.tagName) || [];
        }
        for (var _i = 0, clientNodes_1 = clientNodes; _i < clientNodes_1.length; _i++) {
            var clientNode = clientNodes_1[_i];
            // get the key for the client node
            var clientNodeKey = common_1.getNodeKeyForPreboot({ root: root, node: clientNode });
            // if the client node key is exact match for the server node key, then we
            // found the client node
            if (clientNodeKey === serverNodeKey) {
                this.clientNodeCache[serverNodeKey] = clientNode;
                return clientNode;
            }
        }
        // if we get here and there is one clientNode, use it as a fallback
        if (clientNodes.length === 1) {
            this.clientNodeCache[serverNodeKey] = clientNodes[0];
            return clientNodes[0];
        }
        // if we get here it means we couldn't find the client node so give the user
        // a warning
        console.warn('No matching client node found for ' + serverNodeKey +
            '. You can fix this by assigning this element a unique id attribute.');
        return null;
    };
    return EventReplayer;
}());
EventReplayer = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [window_1.WindowRef])
], EventReplayer);
exports.EventReplayer = EventReplayer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZlbnQucmVwbGF5ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJldmVudC5yZXBsYXllci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLHNDQUEyQztBQUMzQyxvQ0FRbUI7QUFDbkIsbUNBQXFDO0FBR3JDLElBQWEsYUFBYTtJQUl4Qix1QkFBb0IsTUFBaUI7UUFBakIsV0FBTSxHQUFOLE1BQU0sQ0FBVztRQUhyQyxvQkFBZSxHQUFnQyxFQUFFLENBQUM7UUFDbEQsa0JBQWEsR0FBRyxLQUFLLENBQUM7SUFFa0IsQ0FBQztJQUV6Qzs7O09BR0c7SUFDSCxpQ0FBUyxHQUFUO1FBQUEsaUJBZUM7UUFiQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztZQUN2QixNQUFNLENBQUM7UUFDVCxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQztRQUM1QixDQUFDO1FBRUQsd0NBQXdDO1FBQ3hDLElBQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxJQUFJLEVBQUUsQ0FBQztRQUNsRCxJQUFNLElBQUksR0FBRyxXQUFXLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQztRQUNwQyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQUEsT0FBTyxJQUFJLE9BQUEsS0FBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsRUFBMUIsQ0FBMEIsQ0FBQyxDQUFDO1FBRXBELG1GQUFtRjtRQUNuRixJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQzVCLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsb0NBQVksR0FBWixVQUFhLE9BQXVCO1FBQXBDLGlCQW9CQztRQW5CQyxPQUFPLEdBQW1CLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBRTFDLDBFQUEwRTtRQUMxRSxJQUFJLENBQUM7WUFDSCxJQUFNLElBQUksR0FBcUIsQ0FBQyxPQUFPLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1lBQ3BELElBQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxNQUFNLElBQUksRUFBRSxDQUFDO1lBRXBDLHdFQUF3RTtZQUN4RSw2REFBNkQ7WUFDN0QsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBRTFFLGtFQUFrRTtZQUNsRSxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQUEsS0FBSyxJQUFJLE9BQUEsS0FBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLEVBQWhDLENBQWdDLENBQUMsQ0FBQztRQUM1RCxDQUFDO1FBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNaLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDcEIsQ0FBQztRQUVELDBDQUEwQztRQUMxQyxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzdCLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsbUNBQVcsR0FBWCxVQUFZLE9BQXVCLEVBQUUsWUFBMEI7UUFDN0QsT0FBTyxHQUFtQixDQUFDLE9BQU8sSUFBSSxFQUFFLENBQUMsQ0FBQztRQUMxQyxZQUFZLEdBQWlCLENBQUMsWUFBWSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBRWxELElBQU0sS0FBSyxHQUFHLFlBQVksQ0FBQyxLQUFLLENBQUM7UUFDakMsSUFBTSxVQUFVLEdBQUcsWUFBWSxDQUFDLElBQUksSUFBSSxFQUFFLENBQUM7UUFDM0MsSUFBTSxPQUFPLEdBQUcsWUFBWSxDQUFDLE9BQU8sQ0FBQztRQUNyQyxJQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDO1lBQ3JDLElBQUksRUFBRSxPQUFPLENBQUMsSUFBSTtZQUNsQixJQUFJLEVBQUUsVUFBVTtZQUNoQixPQUFPLEVBQUUsT0FBTztTQUNqQixDQUFDLENBQUM7UUFFSCwrQ0FBK0M7UUFDL0MsRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1lBQ2hCLE9BQU8sQ0FBQyxJQUFJLENBQ1IsMkJBQTJCLEdBQUcsS0FBSyxDQUFDLElBQUksR0FBRyxXQUFXLEdBQUcsT0FBTztnQkFDaEUsbUNBQW1DO2dCQUNuQyxrQkFBa0IsQ0FBQyxDQUFDO1lBQ3hCLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDeEIsTUFBTSxDQUFDO1FBQ1QsQ0FBQztRQUVELHFEQUFxRDtRQUNyRCxVQUFVLENBQUMsT0FBTyxHQUFHLFVBQVUsQ0FBQyxPQUFPLEdBQUcsSUFBSSxHQUFHLFNBQVMsQ0FBQztRQUMzRCxVQUFVLENBQUMsUUFBUSxHQUFHLFVBQVUsQ0FBQyxRQUFRLEdBQUcsSUFBSSxHQUFHLFNBQVMsQ0FBQztRQUM3RCxVQUFVLENBQUMsS0FBSyxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUM7UUFDcEMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNsQyxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILG9DQUFZLEdBQVosVUFBYSxPQUF1QjtRQUNsQyxPQUFPLEdBQW1CLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBRTFDLElBQU0sSUFBSSxHQUFxQixDQUFDLE9BQU8sQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDLENBQUM7UUFDcEQsSUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQztRQUNuQyxJQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDO1FBRW5DLDZEQUE2RDtRQUM3RCxrRUFBa0U7UUFDbEUsRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFVLElBQUksQ0FBQyxVQUFVLElBQUksVUFBVSxLQUFLLFVBQVU7WUFDdkQsVUFBVSxDQUFDLFFBQVEsS0FBSyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ25DLE1BQU0sQ0FBQztRQUNULENBQUM7UUFFRCxrREFBa0Q7UUFDbEQsSUFBSSxDQUFDO1lBQ0gsbUNBQW1DO1lBQ25DLElBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxDQUFDLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxDQUFDLElBQUksT0FBTyxDQUFDO1lBRWhHLCtCQUErQjtZQUMvQixVQUFVLENBQUMsTUFBTSxHQUFHLFVBQVUsQ0FBQyxNQUFNLEVBQUU7Z0JBQ25CLFVBQVUsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztZQUV0RCwwQkFBMEI7WUFDMUIsVUFBVSxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1FBRXJDLENBQUM7UUFBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ1osT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNwQixDQUFDO0lBQ0gsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCwrQkFBTyxHQUFQLFVBQVEsV0FBd0I7UUFBaEMsaUJBdUJDO1FBdEJDLFdBQVcsR0FBRyxXQUFXLElBQUksRUFBRSxDQUFDO1FBRWhDLElBQU0sU0FBUyxHQUFHLFdBQVcsQ0FBQyxTQUFTLElBQUksRUFBRSxDQUFDO1FBRTlDLG9FQUFvRTtRQUNwRSxXQUFXO1FBQ1gsVUFBVSxDQUFDLGNBQU0sT0FBQSxLQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsRUFBckMsQ0FBcUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUUzRCw2QkFBNkI7UUFDN0IsR0FBRyxDQUFDLENBQW1CLFVBQVMsRUFBVCx1QkFBUyxFQUFULHVCQUFTLEVBQVQsSUFBUztZQUEzQixJQUFNLFFBQVEsa0JBQUE7WUFDakIsUUFBUSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxRQUFRLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUN6RTtRQUVELHlDQUF5QztRQUN6QyxJQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFDbEYsRUFBRSxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztZQUNuQixjQUFjLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7UUFDeEMsQ0FBQztRQUVELGlEQUFpRDtRQUNqRCxXQUFXLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQztRQUN0QixJQUFJLENBQUMsZUFBZSxHQUFHLEVBQUUsQ0FBQztJQUM1QixDQUFDO0lBRUQsZ0NBQVEsR0FBUixVQUFTLFVBQXVCO1FBQzlCLCtDQUErQztRQUMvQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFVBQVUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUMzRCxNQUFNLENBQUM7UUFDVCxDQUFDO1FBRUQsOENBQThDO1FBQzlDLElBQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDbkQsRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztZQUNmLCtCQUErQjtZQUMvQixVQUFVLENBQUMsS0FBSyxFQUFFLENBQUM7WUFFbkIsc0RBQXNEO1lBQ3RELElBQU0sU0FBUyxHQUFHLFVBQVUsQ0FBQyxTQUFTLENBQUM7WUFDdkMsRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLGlCQUFpQixJQUFJLFNBQVMsQ0FBQyxDQUFDLENBQUM7Z0JBQzlDLFVBQVUsQ0FBQyxpQkFBaUIsQ0FDeEIsU0FBUyxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsR0FBRyxFQUFFLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUMzRCxDQUFDO1FBQ0gsQ0FBQztJQUNILENBQUM7SUFFRDs7Ozs7Ozs7Ozs7Ozs7T0FjRztJQUNILHNDQUFjLEdBQWQsVUFBZSxpQkFBOEI7UUFDM0MsaUJBQWlCLEdBQWdCLENBQUMsaUJBQWlCLElBQUksRUFBRSxDQUFDLENBQUM7UUFFM0QsSUFBTSxVQUFVLEdBQUcsaUJBQWlCLENBQUMsSUFBSSxDQUFDO1FBQzFDLElBQU0sSUFBSSxHQUFHLGlCQUFpQixDQUFDLElBQUksQ0FBQztRQUVwQyxpREFBaUQ7UUFDakQsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFDbEQsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNkLENBQUM7UUFFRCwwRUFBMEU7UUFDMUUsUUFBUTtRQUNSLElBQU0sYUFBYSxHQUFHLGlCQUFpQixDQUFDLE9BQU8sSUFBSSw2QkFBb0IsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBRTNGLDZDQUE2QztRQUM3QyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN4QyxNQUFNLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUM3QyxDQUFDO1FBRUQsb0NBQW9DO1FBQ3BDLElBQU0sU0FBUyxHQUFHLENBQUMsVUFBVSxDQUFDLFNBQVMsSUFBSSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ2hGLElBQUksUUFBUSxHQUFHLFVBQVUsQ0FBQyxPQUFPLENBQUM7UUFFbEMsRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDbEIsUUFBUSxJQUFJLEdBQUcsR0FBRyxVQUFVLENBQUMsRUFBRSxDQUFDO1FBQ2xDLENBQUM7UUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztZQUNyQixRQUFRLElBQUksR0FBRyxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ2pELENBQUM7UUFFRCwyRUFBMkU7UUFDM0UsUUFBUTtRQUNSLElBQU0sY0FBYyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7UUFDdkMsSUFBSSxXQUFXLEdBQUcsY0FBYyxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUVsRSxpRUFBaUU7UUFDakUsRUFBRSxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUN4QixPQUFPLENBQUMsR0FBRyxDQUFDLG9CQUFvQixHQUFHLFFBQVEsR0FBRyxZQUFZLEdBQUcsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ2pGLFdBQVcsR0FBRyxjQUFjLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUMxRSxDQUFDO1FBRUQsR0FBRyxDQUFDLENBQXFCLFVBQVcsRUFBWCwyQkFBVyxFQUFYLHlCQUFXLEVBQVgsSUFBVztZQUEvQixJQUFNLFVBQVUsb0JBQUE7WUFFbkIsa0NBQWtDO1lBQ2xDLElBQU0sYUFBYSxHQUFHLDZCQUFvQixDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQztZQUU3RSx5RUFBeUU7WUFDekUsd0JBQXdCO1lBQ3hCLEVBQUUsQ0FBQyxDQUFDLGFBQWEsS0FBSyxhQUFhLENBQUMsQ0FBQyxDQUFDO2dCQUNwQyxJQUFJLENBQUMsZUFBZSxDQUFDLGFBQWEsQ0FBQyxHQUFHLFVBQVUsQ0FBQztnQkFDakQsTUFBTSxDQUFDLFVBQVUsQ0FBQztZQUNwQixDQUFDO1NBQ0Y7UUFFRCxtRUFBbUU7UUFDbkUsRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzdCLElBQUksQ0FBQyxlQUFlLENBQUMsYUFBYSxDQUFDLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3JELE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDeEIsQ0FBQztRQUVELDRFQUE0RTtRQUM1RSxZQUFZO1FBQ1osT0FBTyxDQUFDLElBQUksQ0FDUixvQ0FBb0MsR0FBRyxhQUFhO1lBQ3BELHFFQUFxRSxDQUFDLENBQUM7UUFDM0UsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNkLENBQUM7SUFDSCxvQkFBQztBQUFELENBQUMsQUFsUUQsSUFrUUM7QUFsUVksYUFBYTtJQUR6QixpQkFBVSxFQUFFO3FDQUtpQixrQkFBUztHQUoxQixhQUFhLENBa1F6QjtBQWxRWSxzQ0FBYSJ9