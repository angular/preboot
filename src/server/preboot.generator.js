"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var uglify_js_1 = require("uglify-js");
var common_1 = require("../common");
var eventRecorder = require("./event.recorder");
var inlineCodeCache = {};
// exporting default options in case developer wants to use these + custom on
// top
exports.defaultOptions = {
    buffer: true,
    minify: true,
    // these are the default events are are listening for an transfering from
    // server view to client view
    eventSelectors: [
        // for recording changes in form elements
        {
            selector: 'input,textarea',
            events: ['keypress', 'keyup', 'keydown', 'input', 'change']
        },
        { selector: 'select,option', events: ['change'] },
        // when user hits return button in an input box
        {
            selector: 'input',
            events: ['keyup'],
            preventDefault: true,
            keyCodes: [13],
            freeze: true
        },
        // for tracking focus (no need to replay)
        {
            selector: 'input,textarea',
            events: ['focusin', 'focusout', 'mousedown', 'mouseup'],
            noReplay: true
        },
        // user clicks on a button
        {
            selector: 'input[type="submit"],button',
            events: ['click'],
            preventDefault: true,
            freeze: true
        }
    ]
};
/**
 * Main entry point for the server side version of preboot. The main purpose
 * is to generate inline code that can be inserted into the server view.
 *
 * @param customOptions PrebootRecordOptions that override the defaults
 * @returns {string} Generated inline preboot code is returned
 */
function generatePrebootEventRecorderCode(customOptions) {
    var opts = assign({}, exports.defaultOptions, customOptions);
    // safety check to make sure options passed in are valid
    validateOptions(opts);
    // use cache if exists and user hasn't disabled the cache
    var optsKey = JSON.stringify(opts);
    if (inlineCodeCache[optsKey]) {
        return inlineCodeCache[optsKey];
    }
    // generate the inline preboot code that will be injected into the document
    var eventRecorderFunctions = [];
    for (var funcName in eventRecorder) {
        if (eventRecorder.hasOwnProperty(funcName)) {
            var fn = eventRecorder[funcName].toString();
            var fnCleaned = fn.replace('common_1.', '');
            eventRecorderFunctions.push(fnCleaned);
        }
    }
    // this is common function used to get the node key
    eventRecorderFunctions.push(common_1.getNodeKeyForPreboot.toString());
    var eventRecorderCode = '\n\n' + eventRecorderFunctions.join('\n\n') + '\n\n';
    var inlinePrebootCode = opts.minify ? uglify_js_1.minify(eventRecorderCode).code : eventRecorderCode;
    var optsStr = stringifyWithFunctions(opts, opts.minify);
    var inlineCode = "(function(){" + inlinePrebootCode + "init(" + optsStr + ")})()";
    // cache results and return
    inlineCodeCache[optsKey] = inlineCode;
    return inlineCode;
}
exports.generatePrebootEventRecorderCode = generatePrebootEventRecorderCode;
/**
 * Throw an error if issues with any options
 * @param opts
 */
function validateOptions(opts) {
    if (!opts.appRoot || !opts.appRoot.length) {
        throw new Error('The appRoot is missing from preboot options. ' +
            'This is needed to find the root of your application. ' +
            'Set this value in the preboot options to be a selector for the root element of your app.');
    }
}
exports.validateOptions = validateOptions;
/**
 * Object.assign() is not fully supporting in TypeScript, so
 * this is just a simple implementation of it
 *
 * @param target The target object
 * @param optionSets Any number of addition objects that are added on top of the
 * target
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
 * Stringify an object and include functions. This is needed since we are
 * letting users pass in options that include custom functions for things like
 * the freeze handler or action when an event occurs
 *
 * @param obj This is the object you want to stringify that includes some
 * functions
 * @param minify If false, JSON outputed with 2 char indents
 * @returns {string} The stringified version of an object
 */
function stringifyWithFunctions(obj, minify) {
    if (minify === void 0) { minify = true; }
    var FUNC_START = 'START_FUNCTION_HERE';
    var FUNC_STOP = 'STOP_FUNCTION_HERE';
    var indent = minify ? undefined : 2;
    // first stringify except mark off functions with markers
    var str = JSON.stringify(obj, function (_key, value) {
        // if the value is a function, we want to wrap it with markers
        if (!!(value && value.constructor && value.call && value.apply)) {
            return FUNC_START + value.toString() + FUNC_STOP;
        }
        else {
            return value;
        }
    }, indent);
    // now we use the markers to replace function strings with actual functions
    var startFuncIdx = str.indexOf(FUNC_START);
    var stopFuncIdx;
    var fn;
    while (startFuncIdx >= 0) {
        stopFuncIdx = str.indexOf(FUNC_STOP);
        // pull string out
        fn = str.substring(startFuncIdx + FUNC_START.length, stopFuncIdx);
        fn = fn.replace(/\\n/g, '\n');
        str = str.substring(0, startFuncIdx - 1) + fn +
            str.substring(stopFuncIdx + FUNC_STOP.length + 1);
        startFuncIdx = str.indexOf(FUNC_START);
    }
    return str;
}
exports.stringifyWithFunctions = stringifyWithFunctions;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlYm9vdC5nZW5lcmF0b3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJwcmVib290LmdlbmVyYXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHVDQUFtQztBQUNuQyxvQ0FBdUU7QUFDdkUsZ0RBQWtEO0FBRWxELElBQU0sZUFBZSxHQUErQixFQUFFLENBQUM7QUFFdkQsNkVBQTZFO0FBQzdFLE1BQU07QUFDTyxRQUFBLGNBQWMsR0FBeUI7SUFDbEQsTUFBTSxFQUFFLElBQUk7SUFDWixNQUFNLEVBQUUsSUFBSTtJQUVaLHlFQUF5RTtJQUN6RSw2QkFBNkI7SUFDN0IsY0FBYyxFQUFFO1FBRWQseUNBQXlDO1FBQ3pDO1lBQ0UsUUFBUSxFQUFFLGdCQUFnQjtZQUMxQixNQUFNLEVBQUUsQ0FBQyxVQUFVLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsUUFBUSxDQUFDO1NBQzVEO1FBQ0QsRUFBQyxRQUFRLEVBQUUsZUFBZSxFQUFFLE1BQU0sRUFBRSxDQUFDLFFBQVEsQ0FBQyxFQUFDO1FBRS9DLCtDQUErQztRQUMvQztZQUNFLFFBQVEsRUFBRSxPQUFPO1lBQ2pCLE1BQU0sRUFBRSxDQUFDLE9BQU8sQ0FBQztZQUNqQixjQUFjLEVBQUUsSUFBSTtZQUNwQixRQUFRLEVBQUUsQ0FBQyxFQUFFLENBQUM7WUFDZCxNQUFNLEVBQUUsSUFBSTtTQUNiO1FBRUQseUNBQXlDO1FBQ3pDO1lBQ0UsUUFBUSxFQUFFLGdCQUFnQjtZQUMxQixNQUFNLEVBQUUsQ0FBQyxTQUFTLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRSxTQUFTLENBQUM7WUFDdkQsUUFBUSxFQUFFLElBQUk7U0FDZjtRQUVELDBCQUEwQjtRQUMxQjtZQUNFLFFBQVEsRUFBRSw2QkFBNkI7WUFDdkMsTUFBTSxFQUFFLENBQUMsT0FBTyxDQUFDO1lBQ2pCLGNBQWMsRUFBRSxJQUFJO1lBQ3BCLE1BQU0sRUFBRSxJQUFJO1NBQ2I7S0FDRjtDQUNGLENBQUM7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