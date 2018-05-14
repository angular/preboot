import {NodeContext} from './preboot.interfaces';
import {getNodeKeyForPreboot} from './get-node-key';
import {PLATFORM_ID} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {isPlatformBrowser} from '@angular/common';

describe('UNIT TEST get-node-key', function() {
  describe('getNodeKeyForPreboot()', function() {
    it('should generate a default name', function() {
      const nodeContext = <NodeContext>{
        root: {
          serverNode: {},
          clientNode: {},
        },
        node: {}
      };
      const expected = 'unknown';
      const actual = getNodeKeyForPreboot(nodeContext);
      expect(actual).toEqual(expected);
    });

    it('should generate a name for a deeply nested element', function() {

      const platform = TestBed.get(PLATFORM_ID);
      if (!isPlatformBrowser(platform)) {
        return;
      }
      const node = document.createElement('foo');
      const serverNode = document.createElement('div');
      const emptyNode = document.createElement('div');
      const levelTwo = document.createElement('div');
      const levelThree = document.createElement('div');

      levelThree.appendChild(emptyNode.cloneNode());
      levelThree.appendChild(emptyNode.cloneNode());
      levelThree.appendChild(emptyNode.cloneNode());
      levelThree.appendChild(node);

      levelTwo.appendChild(emptyNode.cloneNode());
      levelTwo.appendChild(levelThree);

      serverNode.appendChild(emptyNode.cloneNode());
      serverNode.appendChild(emptyNode.cloneNode());
      serverNode.appendChild(levelTwo);

      const nodeContext = {
        root: {
          serverNode,
          clientNode: emptyNode
        },
        node
      };

      const expected = 'FOO_s3_s2_s4';
      const actual = getNodeKeyForPreboot(nodeContext);
      expect(actual).toEqual(expected);
    });
  });
});
