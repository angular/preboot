import { NodeContext } from './preboot.interfaces';
/**
 * Attempt to generate key from node position in the DOM
 *
 * NOTE: this function is duplicated in preboot_inline.ts and must be
 * kept in sync. It is duplicated for right now since we are trying
 * to keep all inline code separated and distinct (i.e. without imports)
 */
export declare function getNodeKeyForPreboot(nodeContext: NodeContext): string;
