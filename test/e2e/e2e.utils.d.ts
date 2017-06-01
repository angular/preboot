import { promise } from 'protractor';
export declare function loadServerView(): promise.Promise<any>;
export declare function loadClientView(): Promise<{}>;
export declare function loadClientScript(): Promise<{}>;
export declare function waitUntilExists(done: Function): void;
