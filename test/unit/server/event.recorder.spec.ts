import 'reflect-metadata';
import 'jasmine';
import { addParent, getMockElement } from '../../utils';
import {
  Element,
  EventSelector,
  NodeContext,
  PrebootAppData,
  PrebootData,
  ServerClientRoot,
  createBuffer,
  getSelection,
  createListenHandler
} from '../../../src';

describe('UNIT TEST event.recorder', function() {
  describe('createBuffer()', function() {
    it('should do nothing if serverNode empty', function () {
      const root = <ServerClientRoot> {
        serverSelector: 'body',
        serverNode: {}
      };

      const actual = createBuffer(root);
      expect(actual).toBe(root.serverNode);
    });

    it('should clone the node and insert before', function () {
      const root = <ServerClientRoot> {
        serverSelector: 'div',
        serverNode: getMockElement()
      };
      const clientNode = { style: { display: 'block' } };
      root.serverNode.cloneNode = function () {
        return clientNode;
      };

      const actual = createBuffer(root);
      expect(actual).toBe(clientNode);
    });
  });

  describe('getSelection()', function () {
    it('should return default if no value', function () {
      const node = <Element> {};
      const expected = {
        start: 0,
        end: 0,
        direction: 'forward'
      };

      const actual = getSelection(node);
      expect(actual).toEqual(expected);
    });

    it('should return selection for older browsers', function () {
      const node = <Element> { value: 'foo' };
      const expected = {
        start: 3,
        end: 3,
        direction: 'forward'
      };

      const actual = getSelection(node);
      expect(actual).toEqual(expected);
    });

    it('should return selection for modern browsers', function () {
      const node = <Element> {
        value: 'foo',
        selectionStart: 1,
        selectionEnd: 2,
        selectionDirection: 'reverse'
      };
      const expected = {
        start: 1,
        end: 2,
        direction: 'reverse'
      };

      const actual = getSelection(node);
      expect(actual).toEqual(expected);
    });
  });


  describe('createListenHandler()', function () {
    it('should do nothing if not listening', function () {
      const prebootData: PrebootData = <PrebootData> {
        listening: false
      };
      const eventSelector: EventSelector = {
        selector: '',
        events: <[string]> [],
        preventDefault: true
      };
      const appData: PrebootAppData = {
        root: {
          serverSelector: '',
          serverNode: {}
        },
        events: []
      };
      const event = {
        preventDefault: function () {}
      };
      const node = <Element>{};

      spyOn(event, 'preventDefault');

      const handler = createListenHandler(prebootData, eventSelector, appData, node); handler(event);
      expect(event.preventDefault).not.toHaveBeenCalled();
    });
  });
});
