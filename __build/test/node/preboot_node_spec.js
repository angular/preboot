"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var preboot_test_utils_1 = require("../preboot_test_utils");
var preboot_node_1 = require("../../src/node/preboot_node");
describe('node unit test for preboot_node', function () {
    describe('assign()', function () {
        it('should merge two objects', function () {
            var obj1 = { val1: 'foo', val2: 'choo' };
            var obj2 = { val2: 'moo', val3: 'zoo' };
            var expected = { val1: 'foo', val2: 'moo', val3: 'zoo' };
            var actual = preboot_node_1.assign(obj1, obj2);
            expect(actual).toEqual(expected);
        });
    });
    describe('stringifyWithFunctions()', function () {
        it('should do the same thing as stringify if no functions', function () {
            var obj = { foo: 'choo', woo: 'loo', zoo: 5 };
            var expected = JSON.stringify(obj);
            var actual = preboot_node_1.stringifyWithFunctions(obj);
            expect(actual).toEqual(expected);
        });
        it('should stringify an object with functions', function () {
            var obj = { blah: 'foo', zoo: function (blah) {
                    return blah + 1;
                } };
            var expected = '{"blah":"foo","zoo":function (';
            var actual = preboot_node_1.stringifyWithFunctions(obj);
            expect(actual.substring(0, 30)).toEqual(expected);
        });
    });
    describe('getInlineCode()', function () {
        it('should generate valid JavaScript by default', function () {
            var code = preboot_node_1.getInlineCode({
                window: preboot_test_utils_1.getMockWindow(),
                appRoot: 'app'
            });
            // code should exist
            expect(code).toBeTruthy();
            /* tslint:disable:no-eval */
            // try to eval the code (if error, then test will fail)
            eval(code);
        });
    });
});
//# sourceMappingURL=preboot_node_spec.js.map