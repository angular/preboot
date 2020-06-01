import {
  assign,
  getEventRecorderCode,
  getInlineDefinition,
  getInlineInvocation,
  stringifyWithFunctions,
  validateOptions
} from './inline.preboot.code';
import {PrebootOptions} from '../common/preboot.interfaces';

describe('UNIT TEST inline.preboot.code', () => {
  describe('stringifyWithFunctions()', () => {
    it('should do the same thing as stringify if no functions', () => {
      const obj = { foo: 'choo', woo: 'loo', zoo: 5 };
      const expected = JSON.stringify(obj);
      const actual = stringifyWithFunctions(obj);
      expect(actual).toEqual(expected);
    });

    it('should stringify an object with functions', () => {
      const obj = {
        blah: 'foo',
        zoo: (blah: number) => blah + 1,
      };
      const expected = '{"blah":"foo","zoo":function (';
      const actual = stringifyWithFunctions(obj);
      expect(actual.substring(0, 30)).toEqual(expected);
    });
  });

  describe('assign()', () => {
    it('should merge two objects', () => {
      const obj1 = { val1: 'foo', val2: 'choo' };
      const obj2 = { val2: 'moo', val3: 'zoo' };
      const expected = { val1: 'foo', val2: 'moo', val3: 'zoo' };
      const actual = assign(obj1, obj2);
      expect(actual).toEqual(expected);
    });
  });

  describe('validateOptions()', () => {
    it('should throw error if nothing passed in', () => {
      expect(() => validateOptions({} as PrebootOptions)).toThrowError(/appRoot is missing/);
    });
  });

  describe('getEventRecorderCode()', () => {
    it('should generate valid JavaScript by default', () => {
      const code = getEventRecorderCode();
      expect(code).toBeTruthy();
    });
  });

  describe('getInlineDefinition()', () => {
    it('should generate valid JavaScript', () => {
      const code = getInlineDefinition({ appRoot: 'foo' });
      expect(code).toBeTruthy();
    });
  });

  describe('getInlineInvocation()', () => {
    it('should generate valid JavaScript', () => {
      const code = getInlineInvocation();
      expect(code).toBeTruthy();
    });
  });
});
