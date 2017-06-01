import { assign, defaultOptions, Element, PrebootRecordOptions, Window } from '../../src';

export function getMockWindow(): Window {
  return <Window> {
    prebootData: {},
    document: {
      addEventListener: function () {}
    }
  };
}

export function getMockOptions(): PrebootRecordOptions {
  return <PrebootRecordOptions> assign({}, defaultOptions, {
    window: getMockWindow()
  });
}

export function getMockElement(): Element {
  return {
    cloneNode: () => { return { style: {} }; },
    parentNode: {
      insertBefore: function () {}
    }
  } as any as Element;
}

// add in parent nodes for children
export function addParent(anode: Element) {
  if (anode && anode.childNodes) {
    for (const childNode of anode.childNodes) {
      childNode.parentNode = anode;
      addParent(childNode);
    }
  }
}
