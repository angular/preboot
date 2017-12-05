import { NodeContext } from './preboot.interfaces';

/**
 * Attempt to generate key from node position in the DOM
 */
export function getNodeKeyForPreboot(nodeContext: NodeContext): string {
  const ancestors: Element[] = [];
  const root = nodeContext.root;
  const node = nodeContext.node;
  let temp: Element | null = node;

  // walk up the tree from the target node up to the root
  while (temp && temp !== root.serverNode && temp !== root.clientNode) {
    ancestors.push(temp);
    temp = temp.parentNode as Element;
  }

  // note: if temp doesn't exist here it means root node wasn't found
  if (temp) {
    ancestors.push(temp);
  }

  // now go backwards starting from the root, appending the appName to unique
  // identify the node later..
  const name = node.nodeName || 'unknown';
  let key = name + '_' + root.serverSelector;
  const len = ancestors.length;

  for (let i = len - 1; i >= 0; i--) {
    temp = ancestors[i];

    if (temp.childNodes && i > 0) {
      for (let j = 0; j < temp.childNodes.length; j++) {
        if (temp.childNodes[j] === ancestors[i - 1]) {
          key += '_s' + (j + 1);
          break;
        }
      }
    }
  }

  return key;
}
