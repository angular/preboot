"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var preboot_node_1 = require("../src/node/preboot_node");
function getMockWindow() {
    return {
        prebootData: {},
        document: {
            addEventListener: function () { }
        }
    };
}
exports.getMockWindow = getMockWindow;
function getMockOptions() {
    return preboot_node_1.assign({}, preboot_node_1.defaultOptions, {
        window: getMockWindow()
    });
}
exports.getMockOptions = getMockOptions;
function getMockElement() {
    return {
        cloneNode: function () { return { style: {} }; },
        parentNode: {
            insertBefore: function () { }
        }
    };
}
exports.getMockElement = getMockElement;
// add in parent nodes for children
function addParent(anode) {
    if (anode && anode.childNodes) {
        for (var _i = 0, _a = anode.childNodes; _i < _a.length; _i++) {
            var childNode = _a[_i];
            childNode.parentNode = anode;
            addParent(childNode);
        }
    }
}
exports.addParent = addParent;
//# sourceMappingURL=preboot_test_utils.js.map