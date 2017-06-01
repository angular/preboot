"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
require("jasmine");
var utils_1 = require("../../utils");
var src_1 = require("../../../src");
describe('UNIT TEST event.replayer', function () {
    describe('switchBuffer()', function () {
        it('will do nothing if nothing passed in', function () {
            var eventReplayer = new src_1.EventReplayer(utils_1.getMockWindow());
            var appData = {};
            eventReplayer.switchBuffer(appData);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZlbnQucmVwbGF5ZXIuc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImV2ZW50LnJlcGxheWVyLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw0QkFBMEI7QUFDMUIsbUJBQWlCO0FBQ2pCLHFDQUE0QztBQUM1QyxvQ0FBNkQ7QUFFN0QsUUFBUSxDQUFDLDBCQUEwQixFQUFFO0lBQ25DLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRTtRQUN6QixFQUFFLENBQUMsc0NBQXNDLEVBQUU7WUFDekMsSUFBTSxhQUFhLEdBQUcsSUFBSSxtQkFBYSxDQUFDLHFCQUFhLEVBQUUsQ0FBQyxDQUFDO1lBQ3pELElBQU0sT0FBTyxHQUFtQixFQUFFLENBQUM7WUFDbkMsYUFBYSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN0QyxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMifQ==