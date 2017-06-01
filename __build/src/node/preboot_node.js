"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var preboot_inline_1 = require("../inline/preboot_inline");
var preboot_browser_1 = require("../browser/preboot_browser");
var fs = require("fs");
var path = require("path");
var inlineCodeCache = {};
// exporting default options in case developer wants to use these + custom on top
exports.defaultOptions = {
    buffer: true,
    // these are the default events are are listening for an transfering from server view to client view
    eventSelectors: [
        // for recording changes in form elements
        { selector: 'input,textarea', events: ['keypress', 'keyup', 'keydown', 'input', 'change'] },
        { selector: 'select,option', events: ['change'] },
        // when user hits return button in an input box
        { selector: 'input', events: ['keyup'], preventDefault: true, keyCodes: [13], freeze: true },
        // for tracking focus (no need to replay)
        { selector: 'input,textarea', events: ['focusin', 'focusout', 'mousedown', 'mouseup'], noReplay: true },
        // user clicks on a button
        { selector: 'input[type="submit"],button', events: ['click'], preventDefault: true, freeze: true }
    ]
};
/**
 * Deprecated function just used for backward compatibility.
 * note that certian older options for preboot like listen, replay, freeze, etc. are no longer available
 *
 * @param legacyOptions Object that contains legacy preboot options
 */
function getBrowserCode(legacyOptions) {
    legacyOptions = legacyOptions || {};
    // we will remove this function with the next version
    console.warn('getBrowserCode() deprecated and many custom options no longer available. ' +
        'Please switch to getInlineCode().');
    var inlineCode = getInlineCode({
        appRoot: legacyOptions.appRoot || 'app',
        uglify: legacyOptions.uglify,
        buffer: legacyOptions.buffer,
        noInlineCache: legacyOptions.noInlineCache,
        eventSelectors: legacyOptions.eventSelectors,
        serverClientRoot: legacyOptions.serverClientRoot
    });
    // two different possibilities depending on how client is calling preboot_node
    var minCodePath = path.normalize(__dirname + '/../../../__dist/preboot_browser.min.js');
    var browserCode = (legacyOptions.uglify && fs.existsSync(minCodePath)) ?
        fs.readFileSync(minCodePath).toString() :
        (preboot_browser_1.prebootClient.toString() + '\nvar preboot = prebootClient();');
    var deprecatedCode = inlineCode + '\n' + browserCode;
    return Promise.resolve(deprecatedCode);
}
exports.getBrowserCode = getBrowserCode;
/**
 * Main entry point for the server side version of preboot. The main purpose
 * is to generate inline code that can be inserted into the server view.
 *
 * @param customOptions PrebootOptions that override the defaults
 * @returns {string} Generated inline preboot code is returned
 */
function getInlineCode(customOptions) {
    var opts = assign({}, exports.defaultOptions, customOptions);
    // safety check to make sure options passed in are valid
    validateOptions(opts);
    // as long as we inline code caching isn't disabled and exists in cache, use the cache
    var optsKey = JSON.stringify(opts);
    if (!opts.noInlineCache && inlineCodeCache[optsKey]) {
        return inlineCodeCache[optsKey];
    }
    // two different possibilities depending on how client is calling preboot_node
    var minCodePath = path.normalize(__dirname + '/../../../__dist/preboot_inline.min.js');
    var inlineCode = (opts.uglify && fs.existsSync(minCodePath)) ?
        fs.readFileSync(minCodePath).toString() :
        preboot_inline_1.prebootstrap.toString();
    // generate the inline JavaScript from prebootstrap
    inlineCode += '\n ' + 'prebootstrap().init(' + stringifyWithFunctions(opts) + ');';
    // cache results as long as caching not disabled
    if (!opts.noInlineCache) {
        inlineCodeCache[optsKey] = inlineCode;
    }
    return inlineCode;
}
exports.getInlineCode = getInlineCode;
/**
 * Throw an error if issues with any options
 * @param opts
 */
function validateOptions(opts) {
    if ((!opts.appRoot || !opts.appRoot.length) &&
        (!opts.serverClientRoot || !opts.serverClientRoot.length)) {
        throw new Error('The appRoot is missing from preboot options. ' +
            'This is needed to find the root of your application. ' +
            'Set this value in the preboot options to be a selector for the root element of your app.');
    }
}
/**
 * For some reason, Object.assign() is not fully supporting in TypeScript, so
 * this is just a simple implementation of it
 *
 * @param target The target object
 * @param optionSets Any number of addition objects that are added on top of the target
 * @returns {Object} A new object that contains all the merged values
 */
function assign(target) {
    var optionSets = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        optionSets[_i - 1] = arguments[_i];
    }
    if (target === undefined || target === null) {
        throw new TypeError('Cannot convert undefined or null to object');
    }
    var output = Object(target);
    for (var index = 0; index < optionSets.length; index++) {
        var source = optionSets[index];
        if (source !== undefined && source !== null) {
            for (var nextKey in source) {
                if (source.hasOwnProperty(nextKey)) {
                    output[nextKey] = source[nextKey];
                }
            }
        }
    }
    return output;
}
exports.assign = assign;
/**
 * Stringify an object and include functions. This is needed since we are letting
 * users pass in options that include custom functions for things like the
 * freeze handler or action when an event occurs
 *
 * @param obj This is the object you want to stringify that includes some functions
 * @returns {string} The stringified version of an object
 */
function stringifyWithFunctions(obj) {
    var FUNC_START = 'START_FUNCTION_HERE';
    var FUNC_STOP = 'STOP_FUNCTION_HERE';
    // first stringify except mark off functions with markers
    var str = JSON.stringify(obj, function (_key, value) {
        // if the value is a function, we want to wrap it with markers
        if (!!(value && value.constructor && value.call && value.apply)) {
            return FUNC_START + value.toString() + FUNC_STOP;
        }
        else {
            return value;
        }
    });
    // now we use the markers to replace function strings with actual functions
    var startFuncIdx = str.indexOf(FUNC_START);
    var stopFuncIdx;
    var fn;
    while (startFuncIdx >= 0) {
        stopFuncIdx = str.indexOf(FUNC_STOP);
        // pull string out
        fn = str.substring(startFuncIdx + FUNC_START.length, stopFuncIdx);
        fn = fn.replace(/\\n/g, '\n');
        str = str.substring(0, startFuncIdx - 1) + fn + str.substring(stopFuncIdx + FUNC_STOP.length + 1);
        startFuncIdx = str.indexOf(FUNC_START);
    }
    return str;
}
exports.stringifyWithFunctions = stringifyWithFunctions;
//# sourceMappingURL=preboot_node.js.map