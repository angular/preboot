import { PrebootOptions } from '../common/preboot.interfaces';
import { getNodeKeyForPreboot } from '../common/get-node-key';

import {
  init,
  waitUntilReady,
  start,
  createOverlay,
  getAppRoots,
  handleEvents,
  createListenHandler,
  getSelection,
  createBuffer
} from './event.recorder';

const eventRecorder = {
  waitUntilReady,
  start,
  createOverlay,
  getAppRoots,
  handleEvents,
  createListenHandler,
  getSelection,
  createBuffer
};

declare var require: any;

// exporting default options in case developer wants to use these + custom on
// top
export const defaultOptions = <PrebootOptions>{
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

    // when user submit form (press enter, click on button/input[type="submit"])
    {
      selector: 'form',
      events: ['submit'],
      preventDefault: true,
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
      selector: 'button',
      events: ['click'],
      preventDefault: true,
      freeze: true
    }
  ]
};

/**
 * Get the event recorder code based on all functions in event.recorder.ts
 * and the getNodeKeyForPreboot function.
 */
export function getEventRecorderCode(): string {
  const eventRecorderFunctions: string[] = [];

  for (const funcName in eventRecorder) {
    if (eventRecorder.hasOwnProperty(funcName)) {
      const fn = (<any>eventRecorder)[funcName].toString();
      const fnCleaned = fn.replace('common_1.', '');
      eventRecorderFunctions.push(fnCleaned);
    }
  }

  // this is common function used to get the node key
  eventRecorderFunctions.push(getNodeKeyForPreboot.toString());

  // add new line characters for readability
  return '\n\n' + eventRecorderFunctions.join('\n\n') + '\n\n';
}


/**
 * Used by the server side version of preboot. The main purpose
 * is to get the inline code that can be inserted into the server view.
 *
 * @param customOptions PrebootRecordOptions that override the defaults
 * @returns Generated inline preboot code is returned
 */
export function getInlinePrebootCode(customOptions?: PrebootOptions): string {
  const opts = <PrebootOptions>assign({}, defaultOptions, customOptions);

  // safety check to make sure options passed in are valid
  validateOptions(opts);

  const optsStr = stringifyWithFunctions(opts);
  const scriptCode = getEventRecorderCode();

  // TODO re-add minification option?

  // wrap inline preboot code with a self executing function in order to create scope
  const initStr = init.toString();
  return `(function() {
      ${scriptCode}
      (${initStr.replace('common_1.', '')}
      )(${optsStr})
    })()`;
}

/**
 * Throw an error if issues with any options
 * @param opts
 */
export function validateOptions(opts: PrebootOptions) {
  if (!opts.appRoot || !opts.appRoot.length) {
    throw new Error(
      'The appRoot is missing from preboot options. ' +
        'This is needed to find the root of your application. ' +
        'Set this value in the preboot options to be a selector for the root element of your app.'
    );
  }
}

/**
 * Object.assign() is not fully supporting in TypeScript, so
 * this is just a simple implementation of it
 *
 * @param target The target object
 * @param optionSets Any number of addition objects that are added on top of the
 * target
 * @returns A new object that contains all the merged values
 */
export function assign(target: Object, ...optionSets: any[]): Object {
  if (target === undefined || target === null) {
    throw new TypeError('Cannot convert undefined or null to object');
  }

  const output = Object(target);
  for (let index = 0; index < optionSets.length; index++) {
    const source = optionSets[index];
    if (source !== undefined && source !== null) {
      for (const nextKey in source) {
        if (source.hasOwnProperty && source.hasOwnProperty(nextKey)) {
          output[nextKey] = source[nextKey];
        }
      }
    }
  }

  return output;
}

/**
 * Stringify an object and include functions. This is needed since we are
 * letting users pass in options that include custom functions for things like
 * the freeze handler or action when an event occurs
 *
 * @param obj This is the object you want to stringify that includes some
 * functions
 * @returns The stringified version of an object
 */
export function stringifyWithFunctions(obj: Object): string {
  const FUNC_START = 'START_FUNCTION_HERE';
  const FUNC_STOP = 'STOP_FUNCTION_HERE';

  // first stringify except mark off functions with markers
  let str = JSON.stringify(obj, function(_key, value) {
    // if the value is a function, we want to wrap it with markers
    if (!!(value && value.constructor && value.call && value.apply)) {
      return FUNC_START + value.toString() + FUNC_STOP;
    } else {
      return value;
    }
  });

  // now we use the markers to replace function strings with actual functions
  let startFuncIdx = str.indexOf(FUNC_START);
  let stopFuncIdx: number;
  let fn: string;
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
