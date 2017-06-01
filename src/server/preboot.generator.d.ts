import { PrebootRecordOptions } from '../common';
export declare const defaultOptions: PrebootRecordOptions;
/**
 * Main entry point for the server side version of preboot. The main purpose
 * is to generate inline code that can be inserted into the server view.
 *
 * @param customOptions PrebootRecordOptions that override the defaults
 * @returns {string} Generated inline preboot code is returned
 */
export declare function generatePrebootEventRecorderCode(customOptions?: PrebootRecordOptions): string;
/**
 * Throw an error if issues with any options
 * @param opts
 */
export declare function validateOptions(opts: PrebootRecordOptions): void;
/**
 * Object.assign() is not fully supporting in TypeScript, so
 * this is just a simple implementation of it
 *
 * @param target The target object
 * @param optionSets Any number of addition objects that are added on top of the
 * target
 * @returns {Object} A new object that contains all the merged values
 */
export declare function assign(target: Object, ...optionSets: any[]): Object;
/**
 * Stringify an object and include functions. This is needed since we are
 * letting users pass in options that include custom functions for things like
 * the freeze handler or action when an event occurs
 *
 * @param obj This is the object you want to stringify that includes some
 * functions
 * @param minify If false, JSON outputed with 2 char indents
 * @returns {string} The stringified version of an object
 */
export declare function stringifyWithFunctions(obj: Object, minify?: boolean): string;
