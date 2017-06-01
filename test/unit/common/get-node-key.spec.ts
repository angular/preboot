import 'reflect-metadata';
import 'jasmine';
import { getNodeKeyForPreboot, NodeContext } from '../../../src';
import { addParent } from '../../utils';

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
      const node = {nodeName: 'foo'};
      const nodeContext = <NodeContext>{
        root: {
          serverSelector: '#myApp',
          serverNode: {
            childNodes:
                [{}, {}, {childNodes: [{}, {childNodes: [{}, {}, {}, node]}]}]
          },
          clientNode: {}
        },
        node: node
      };

      // add parent references to the rootServerNode tree
      addParent(nodeContext.root.serverNode);

      const expected = 'foo_#myApp_s3_s2_s4';
      const actual = getNodeKeyForPreboot(nodeContext);
      expect(actual).toEqual(expected);
    });
  });
});
