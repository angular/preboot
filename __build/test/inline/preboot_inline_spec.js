"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var preboot_inline_1 = require("../../src/inline/preboot_inline");
var preboot_browser_1 = require("../../src/browser/preboot_browser");
var preboot_test_utils_1 = require("../preboot_test_utils");
describe('node unit test for preboot_inline', function () {
    var preboot = preboot_inline_1.prebootstrap();
    var client = preboot_browser_1.prebootClient();
    describe('createBuffer()', function () {
        it('should return server node if rootSelector is the body', function () {
            var root = {
                serverSelector: 'body',
                serverNode: {}
            };
            var actual = preboot.createBuffer(root);
            expect(actual).toBe(root.serverNode);
        });
        it('should clone the node and insert before', function () {
            var root = {
                serverSelector: 'div',
                serverNode: preboot_test_utils_1.getMockElement()
            };
            var clientNode = { style: { display: 'block' } };
            root.serverNode.cloneNode = function () {
                return clientNode;
            };
            var actual = preboot.createBuffer(root);
            expect(actual).toBe(clientNode);
        });
    });
    describe('getSelection()', function () {
        it('should return default if no value', function () {
            var node = {};
            var expected = {
                start: 0,
                end: 0,
                direction: 'forward'
            };
            var actual = preboot.getSelection(node);
            expect(actual).toEqual(expected);
        });
        it('should return selection for older browsers', function () {
            var node = { value: 'foo' };
            var expected = {
                start: 3,
                end: 3,
                direction: 'forward'
            };
            var actual = preboot.getSelection(node);
            expect(actual).toEqual(expected);
        });
        it('should return selection for modern browsers', function () {
            var node = {
                value: 'foo',
                selectionStart: 1,
                selectionEnd: 2,
                selectionDirection: 'reverse'
            };
            var expected = {
                start: 1,
                end: 2,
                direction: 'reverse'
            };
            var actual = preboot.getSelection(node);
            expect(actual).toEqual(expected);
        });
    });
    describe('getNodeKey()', function () {
        it('should be the EXACT same code as is in the preboot_browser', function () {
            expect(preboot.getNodeKey.toString().replace(/\s/g, ''))
                .toEqual(client.getNodeKey.toString().replace(/\s/g, ''));
        });
        it('should generate a default name', function () {
            var nodeContext = {
                root: {
                    serverSelector: '#myApp',
                    clientSelector: '#myApp',
                    serverNode: {},
                    clientNode: {},
                },
                node: {}
            };
            var expected = 'unknown_#myApp';
            var actual = preboot.getNodeKey(nodeContext);
            expect(actual).toEqual(expected);
        });
        it('should generate a name for a deeply nested element', function () {
            var node = { nodeName: 'foo' };
            var nodeContext = {
                root: {
                    serverSelector: '#myApp',
                    serverNode: {
                        childNodes: [{}, {}, {
                                childNodes: [{}, {
                                        childNodes: [{}, {}, {}, node]
                                    }]
                            }]
                    },
                    clientNode: {}
                },
                node: node
            };
            // add parent references to the rootServerNode tree
            preboot_test_utils_1.addParent(nodeContext.root.serverNode);
            var expected = 'foo_#myApp_s3_s2_s4';
            var actual = preboot.getNodeKey(nodeContext);
            expect(actual).toEqual(expected);
        });
    });
    describe('createListenHandler()', function () {
        it('should do nothing if not listening', function () {
            var prebootData = {
                listening: false
            };
            var eventSelector = {
                selector: '',
                events: [],
                preventDefault: true
            };
            var appData = {
                root: {
                    serverSelector: '',
                    serverNode: {}
                },
                events: []
            };
            var event = {
                preventDefault: function () { }
            };
            var node = {};
            spyOn(event, 'preventDefault');
            var handler = preboot.createListenHandler(prebootData, eventSelector, appData, node);
            handler(event);
            expect(event.preventDefault).not.toHaveBeenCalled();
        });
    });
});
//# sourceMappingURL=preboot_inline_spec.js.map