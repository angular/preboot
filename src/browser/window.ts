import {ComputedStyle, Document, PrebootData, Window, Element} from '../common';

export class WindowRef implements Window {
  prebootData: PrebootData;
  document: Document;

  getComputedStyle?(node: Element): ComputedStyle {
    return {
      node: node,
      getPropertyValue: (prop: string): string => {
        return prop;
      }
    } as ComputedStyle;
  }
}
