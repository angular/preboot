/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {getMockElement} from '../common/preboot.mocks';
import {createBuffer, createListenHandler, getSelection} from './event.recorder';
import {
  EventSelector,
  PrebootAppData,
  PrebootData,
  ServerClientRoot,
} from '../common/preboot.interfaces';
import {PrebootSelection} from 'preboot/common/preboot.interfaces';

describe('UNIT TEST event.recorder', function () {
  describe('createBuffer()', function () {
    it('should do nothing if serverNode empty', function () {
      const root = <ServerClientRoot> {
        serverSelector: 'body',
        serverNode: undefined
      };

      const actual = createBuffer(root);
      expect(actual).toBe(root.serverNode as HTMLElement);
    });

    it('should clone the node and insert before', function () {
      const root = <ServerClientRoot> {
        serverSelector: 'div',
        serverNode: getMockElement()
      };
      const clientNode = {
        style: {display: 'block'}
      } as HTMLElement;

      if (root.serverNode) {
        root.serverNode.cloneNode = function () {
          return clientNode;
        };
      }

      const actual = createBuffer(root);
      expect(actual).toBe(clientNode as HTMLElement);
    });

    it('should add the "ng-non-bindable" attribute to serverNode', function () {
      const root = <ServerClientRoot> {
        serverSelector: 'div',
        serverNode: getMockElement()
      };

      createBuffer(root);
      expect(root.serverNode!.hasAttribute('ng-non-bindable')).toBe(true);
    });
  });

  describe('getSelection()', function () {
    it('should return default if no value', function () {
      const node = {};
      const expected: PrebootSelection = {
        start: 0,
        end: 0,
        direction: 'forward'
      };

      const actual = getSelection(node as HTMLInputElement);
      expect(actual).toEqual(expected);
    });

    it('should return selection for older browsers', function () {
      const node = {value: 'foo'};
      const expected: PrebootSelection = {
        start: 3,
        end: 3,
        direction: 'forward'
      };

      const actual = getSelection(node as HTMLInputElement);
      expect(actual).toEqual(expected);
    });

    it('should return selection for modern browsers', function () {
      const node = {
        value: 'foo',
        selectionStart: 1,
        selectionEnd: 2,
        selectionDirection: 'backward'
      };
      const expected: PrebootSelection = {
        start: 1,
        end: 2,
        direction: 'backward'
      };

      const actual = getSelection(node as HTMLInputElement);
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
        events: [''],
        preventDefault: true
      };
      const appData: PrebootAppData = {
        root: {
          serverSelector: '',
          serverNode: undefined
        },
        events: []
      };
      const event = {
        preventDefault: function () {
        }
      };
      const node = <Element>{};

      spyOn(event, 'preventDefault');

      const handler = createListenHandler(prebootData, eventSelector, appData, node);
      handler(event as Event);
      expect(event.preventDefault).not.toHaveBeenCalled();
    });
  });
});
