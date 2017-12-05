import {NodeContext} from './preboot.interfaces';
import {getNodeKeyForPreboot} from './get-node-key';

describe('UNIT TEST get-node-key', function() {
  describe('getNodeKeyForPreboot()', function() {
    it('should generate a default name', function() {
      const nodeContext = <NodeContext>{
        root: {
          serverSelector: '#myApp',
          clientSelector: '#myApp',
          serverNode: {},
          clientNode: {},
        },
        node: {}
      };
      const expected = 'unknown_#myApp';
      const actual = getNodeKeyForPreboot(nodeContext);
      expect(actual).toEqual(expected);
    });

    it('should generate a name for a deeply nested element', function() {

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
          serverSelector: '#myApp',
          serverNode,
          clientNode: emptyNode
        },
        node
      };

      const expected = 'FOO_#myApp_s3_s2_s4';
      const actual = getNodeKeyForPreboot(nodeContext);
      expect(actual).toEqual(expected);
    });
  });
});
