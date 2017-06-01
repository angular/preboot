"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
require("jasmine");
var src_1 = require("../../../src");
describe('UNIT TEST preboot.generator', function () {
    describe('stringifyWithFunctions()', function () {
        it('should do the same thing as stringify if no functions', function () {
            var obj = { foo: 'choo', woo: 'loo', zoo: 5 };
            var expected = JSON.stringify(obj);
            var actual = src_1.stringifyWithFunctions(obj);
            expect(actual).toEqual(expected);
        });
        it('should stringify an object with functions', function () {
            var obj = {
                blah: 'foo',
                zoo: function (blah) {
                    return blah + 1;
                }
            };
            var expected = '{"blah":"foo","zoo":function (';
            var actual = src_1.stringifyWithFunctions(obj);
            expect(actual.substring(0, 30)).toEqual(expected);
        });
    });
    describe('assign()', function () {
        it('should merge two objects', function () {
            var obj1 = { val1: 'foo', val2: 'choo' };
            var obj2 = { val2: 'moo', val3: 'zoo' };
            var expected = { val1: 'foo', val2: 'moo', val3: 'zoo' };
            var actual = src_1.assign(obj1, obj2);
            expect(actual).toEqual(expected);
        });
    });
    describe('validateOptions()', function () {
        it('should throw error if nothing passed in', function () {
            expect(function () { return src_1.validateOptions({}); }).toThrowError(/appRoot is missing/);
        });
    });
    describe('generatePrebootEventRecorderCode()', function () {
        it('should generate valid JavaScript by default', function () {
            var code = src_1.generatePrebootEventRecorderCode({ appRoot: 'app' });
            expect(code).toBeTruthy();
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlYm9vdC5nZW5lcmF0b3Iuc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInByZWJvb3QuZ2VuZXJhdG9yLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw0QkFBMEI7QUFDMUIsbUJBQWlCO0FBQ2pCLG9DQU1zQjtBQUd0QixRQUFRLENBQUMsNkJBQTZCLEVBQUU7SUFDdEMsUUFBUSxDQUFDLDBCQUEwQixFQUFFO1FBQ25DLEVBQUUsQ0FBQyx1REFBdUQsRUFBRTtZQUUxRCxJQUFNLEdBQUcsR0FBRyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUM7WUFDaEQsSUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNyQyxJQUFNLE1BQU0sR0FBRyw0QkFBc0IsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUMzQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ25DLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLDJDQUEyQyxFQUFFO1lBQzlDLElBQU0sR0FBRyxHQUFHO2dCQUNWLElBQUksRUFBRSxLQUFLO2dCQUNYLEdBQUcsRUFBRSxVQUFTLElBQVk7b0JBQ3hCLE1BQU0sQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO2dCQUNsQixDQUFDO2FBQ0YsQ0FBQztZQUNGLElBQU0sUUFBUSxHQUFHLGdDQUFnQyxDQUFDO1lBQ2xELElBQU0sTUFBTSxHQUFHLDRCQUFzQixDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzNDLE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNwRCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLFVBQVUsRUFBRTtRQUNuQixFQUFFLENBQUMsMEJBQTBCLEVBQUU7WUFDN0IsSUFBTSxJQUFJLEdBQUcsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsQ0FBQztZQUMzQyxJQUFNLElBQUksR0FBRyxFQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBQyxDQUFDO1lBQ3hDLElBQU0sUUFBUSxHQUFHLEVBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUMsQ0FBQztZQUN6RCxJQUFNLE1BQU0sR0FBRyxZQUFNLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ2xDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDbkMsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxtQkFBbUIsRUFBRTtRQUM1QixFQUFFLENBQUMseUNBQXlDLEVBQUU7WUFDNUMsTUFBTSxDQUFDLGNBQU0sT0FBQSxxQkFBZSxDQUFDLEVBQTBCLENBQUMsRUFBM0MsQ0FBMkMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1FBQy9GLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsb0NBQW9DLEVBQUU7UUFDN0MsRUFBRSxDQUFDLDZDQUE2QyxFQUFFO1lBQ2hELElBQU0sSUFBSSxHQUFHLHNDQUFnQyxDQUFDLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7WUFDbEUsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQzVCLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyJ9