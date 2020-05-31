/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {getMockElement} from '../common/preboot.mocks';
import {createBuffer, getSelection} from './event.recorder';
import {PrebootSelection, ServerClientRoot} from '../common/preboot.interfaces';

describe('UNIT TEST event.recorder', () => {
  describe('createBuffer()', () => {
    it('should do nothing if serverNode empty', () => {
      const root: Partial<ServerClientRoot> = {
        serverNode: undefined
      };

      const actual = createBuffer(root);
      expect(actual).toBe(root.serverNode as HTMLElement);
    });

    it('should clone the node and insert before', () => {
      const root: Partial<ServerClientRoot> = {
        serverNode: getMockElement() as HTMLElement
      };
      const clientNode = {
        style: { display: 'block' } as CSSStyleDeclaration
      } as HTMLElement;

      if (root.serverNode) {
        root.serverNode.cloneNode = () => clientNode;
      }

      const actual = createBuffer(root);
      expect(actual).toBe(clientNode);
    });

    it('should add the "ng-non-bindable" attribute to serverNode', () => {
      const root: Partial<ServerClientRoot> = {
        serverNode: getMockElement() as HTMLElement
      };

      createBuffer(root);
      expect(root.serverNode!.hasAttribute('ng-non-bindable')).toBe(true);
    });
  });

  describe('getSelection()', () => {
    it('should return default if no value', () => {
      const node = {};
      const expected: PrebootSelection = {
        start: 0,
        end: 0,
        direction: 'forward'
      };

      const actual = getSelection(node as HTMLInputElement);
      expect(actual).toEqual(expected);
    });

    it('should return selection for older browsers', () => {
      const node = { value: 'foo' };
      const expected: PrebootSelection = {
        start: 3,
        end: 3,
        direction: 'forward'
      };

      const actual = getSelection(node as HTMLInputElement);
      expect(actual).toEqual(expected);
    });

    it('should return selection for modern browsers', () => {
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
});
