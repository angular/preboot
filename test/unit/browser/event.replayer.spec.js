"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
require("jasmine");
var utils_1 = require("../../utils");
var src_1 = require("../../../src");
describe('UNIT TEST event.replayer', function () {
    describe('switchBuffer()', function () {
        it('will do nothing if nothing passed in', function () {
            var eventReplayer = new src_1.EventReplayer();
            var appData = {};
            eventReplayer.setWindow(utils_1.getMockWindow());
            eventReplayer.switchBuffer(appData);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZlbnQucmVwbGF5ZXIuc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImV2ZW50LnJlcGxheWVyLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw0QkFBMEI7QUFDMUIsbUJBQWlCO0FBQ2pCLHFDQUE0QztBQUM1QyxvQ0FBNkQ7QUFFN0QsUUFBUSxDQUFDLDBCQUEwQixFQUFFO0lBQ25DLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRTtRQUN6QixFQUFFLENBQUMsc0NBQXNDLEVBQUU7WUFDekMsSUFBTSxhQUFhLEdBQUcsSUFBSSxtQkFBYSxFQUFFLENBQUM7WUFDMUMsSUFBTSxPQUFPLEdBQW1CLEVBQUUsQ0FBQztZQUVuQyxhQUFhLENBQUMsU0FBUyxDQUFDLHFCQUFhLEVBQUUsQ0FBQyxDQUFDO1lBQ3pDLGFBQWEsQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDdEMsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIn0=