import {
  assign, getEventRecorderCode, getInlinePrebootCode, stringifyWithFunctions,
  validateOptions
} from './inline.preboot.code';
import {PrebootOptions} from '../common/preboot.interfaces';

describe('UNIT TEST inline.preboot.code', function() {
  describe('stringifyWithFunctions()', function() {
    it('should do the same thing as stringify if no functions', function
    () {
      const obj = { foo: 'choo', woo: 'loo', zoo: 5 };
      const expected = JSON.stringify(obj);
      const actual = stringifyWithFunctions(obj);
      expect(actual).toEqual(expected);
    });

    it('should stringify an object with functions', function() {
      const obj = {
        blah: 'foo',
        zoo: function(blah: number) {
          return blah + 1;
        }
      };
      const expected = '{"blah":"foo","zoo":function (';
      const actual = stringifyWithFunctions(obj);
      expect(actual.substring(0, 30)).toEqual(expected);
    });
  });

  describe('assign()', function() {
    it('should merge two objects', function () {
      const obj1 = { val1: 'foo', val2: 'choo' };
      const obj2 = {val2: 'moo', val3: 'zoo'};
      const expected = {val1: 'foo', val2: 'moo', val3: 'zoo'};
      const actual = assign(obj1, obj2);
      expect(actual).toEqual(expected);
    });
  });

  describe('validateOptions()', function() {
    it('should throw error if nothing passed in', function() {
      expect(() => validateOptions({} as PrebootOptions)).toThrowError(/appRoot is missing/);
    });
  });

  describe('getEventRecorderCode()', function() {
    it('should generate valid JavaScript by default', function() {
      const code = getEventRecorderCode();
      expect(code).toBeTruthy();
    });
  });

  describe('getInlinePrebootCode()', function () {
    it('should generate valid JavaScript minified', function () {
      const code = getInlinePrebootCode({ appRoot: 'foo' });
      expect(code).toBeTruthy();
    });

    it('should generate valid JavaScript not minified', function () {
      const code = getInlinePrebootCode({ appRoot: 'foo', minify: false });
      expect(code).toBeTruthy();
    });
  });
});
