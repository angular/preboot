import { PrebootOptions } from '../preboot_interfaces';
export declare const defaultOptions: PrebootOptions;
/**
 * Deprecated function just used for backward compatibility.
 * note that certian older options for preboot like listen, replay, freeze, etc. are no longer available
 *
 * @param legacyOptions Object that contains legacy preboot options
 */
export declare function getBrowserCode(legacyOptions: any): any;
/**
 * Main entry point for the server side version of preboot. The main purpose
 * is to generate inline code that can be inserted into the server view.
 *
 * @param customOptions PrebootOptions that override the defaults
 * @returns {string} Generated inline preboot code is returned
 */
export declare function getInlineCode(customOptions?: PrebootOptions): string;
/**
 * For some reason, Object.assign() is not fully supporting in TypeScript, so
 * this is just a simple implementation of it
 *
 * @param target The target object
 * @param optionSets Any number of addition objects that are added on top of the target
 * @returns {Object} A new object that contains all the merged values
 */
export declare function assign(target: Object, ...optionSets: any[]): Object;
/**
 * Stringify an object and include functions. This is needed since we are letting
 * users pass in options that include custom functions for things like the
 * freeze handler or action when an event occurs
 *
 * @param obj This is the object you want to stringify that includes some functions
 * @returns {string} The stringified version of an object
 */
export declare function stringifyWithFunctions(obj: Object): string;
