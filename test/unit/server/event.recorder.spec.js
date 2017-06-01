"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
require("jasmine");
var utils_1 = require("../../utils");
var src_1 = require("../../../src");
describe('UNIT TEST event.recorder', function () {
    describe('createBuffer()', function () {
        it('should do nothing if serverNode empty', function () {
            var root = {
                serverSelector: 'body',
                serverNode: {}
            };
            var actual = src_1.createBuffer(root);
            expect(actual).toBe(root.serverNode);
        });
        it('should clone the node and insert before', function () {
            var root = {
                serverSelector: 'div',
                serverNode: utils_1.getMockElement()
            };
            var clientNode = { style: { display: 'block' } };
            root.serverNode.cloneNode = function () {
                return clientNode;
            };
            var actual = src_1.createBuffer(root);
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
            var actual = src_1.getSelection(node);
            expect(actual).toEqual(expected);
        });
        it('should return selection for older browsers', function () {
            var node = { value: 'foo' };
            var expected = {
                start: 3,
                end: 3,
                direction: 'forward'
            };
            var actual = src_1.getSelection(node);
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
            var actual = src_1.getSelection(node);
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
            var handler = src_1.createListenHandler(prebootData, eventSelector, appData, node);
            handler(event);
            expect(event.preventDefault).not.toHaveBeenCalled();
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZlbnQucmVjb3JkZXIuc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImV2ZW50LnJlY29yZGVyLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw0QkFBMEI7QUFDMUIsbUJBQWlCO0FBQ2pCLHFDQUF3RDtBQUN4RCxvQ0FVc0I7QUFFdEIsUUFBUSxDQUFDLDBCQUEwQixFQUFFO0lBQ25DLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRTtRQUN6QixFQUFFLENBQUMsdUNBQXVDLEVBQUU7WUFDMUMsSUFBTSxJQUFJLEdBQXNCO2dCQUM5QixjQUFjLEVBQUUsTUFBTTtnQkFDdEIsVUFBVSxFQUFFLEVBQUU7YUFDZixDQUFDO1lBRUYsSUFBTSxNQUFNLEdBQUcsa0JBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNsQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUN2QyxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyx5Q0FBeUMsRUFBRTtZQUM1QyxJQUFNLElBQUksR0FBc0I7Z0JBQzlCLGNBQWMsRUFBRSxLQUFLO2dCQUNyQixVQUFVLEVBQUUsc0JBQWMsRUFBRTthQUM3QixDQUFDO1lBQ0YsSUFBTSxVQUFVLEdBQUcsRUFBRSxLQUFLLEVBQUUsRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLEVBQUUsQ0FBQztZQUNuRCxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsR0FBRztnQkFDMUIsTUFBTSxDQUFDLFVBQVUsQ0FBQztZQUNwQixDQUFDLENBQUM7WUFFRixJQUFNLE1BQU0sR0FBRyxrQkFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2xDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDbEMsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRTtRQUN6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