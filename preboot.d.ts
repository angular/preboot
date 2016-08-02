
import {
    PrebootCompleteOptions,
    PrebootAppData,
    PrebootData,
    PrebootOptions,
    PrebootEvent,
    NodeContext,
    Element,
    Window
} from './src/preboot_interfaces';

export declare function prebootClient(): {
    complete: (opts?: PrebootCompleteOptions) => void;
    completeApp: (opts: PrebootCompleteOptions, appData: PrebootAppData) => void;
    replayEvent: (appData: PrebootAppData, prebootEvent: PrebootEvent) => void;
    switchBuffer: (window: Window, appData: PrebootAppData) => void;
    cleanup: (window: Window, prebootData: PrebootData) => void;
    setFocus: (activeNode: NodeContext) => void;
    findClientNode: (serverNodeContext: NodeContext) => Element;
    getNodeKey: (nodeContext: NodeContext) => string;
};

export declare const defaultOptions: PrebootOptions;
export declare function getInlineCode(customOptions?: PrebootOptions): string;
export declare function assign(target: Object, ...optionSets: any[]): Object;
export declare function stringifyWithFunctions(obj: Object): string;
