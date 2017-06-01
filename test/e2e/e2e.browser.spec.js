"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var protractor_1 = require("protractor");
var e2e_server_1 = require("./e2e.server");
var e2e_utils_1 = require("./e2e.utils");
describe('e2e test preboot', function () {
    beforeAll(e2e_server_1.startServer);
    afterAll(e2e_server_1.stopServer);
    it('should validate server view', function () {
        e2e_utils_1.loadServerView()
            .then(function () { return protractor_1.element(protractor_1.by.css('h1')).getText(); })
            .then(function (text) { return expect(text).toEqual('server view'); });
    });
    it('should validate basic client view', function () {
        e2e_utils_1.loadServerView()
            .then(function () { return e2e_utils_1.loadClientView(); })
            .then(function () { return protractor_1.element(protractor_1.by.css('h1')).getText(); })
            .then(function (text) { return expect(text).toEqual('client view'); });
    });
    it('should validate typing input to a text box', function () {
        var input = 'foo man choo';
        e2e_utils_1.loadServerView()
            .then(function () { return protractor_1.element(protractor_1.by.css('#myTextBox')).click(); })
            .then(function () { return protractor_1.browser.actions().sendKeys(input).perform(); })
            .then(function () { return e2e_utils_1.loadClientView(); })
            .then(function () { return protractor_1.element(protractor_1.by.css('#myTextBox')).getAttribute('value'); })
            .then(function (actual) { return expect(actual).toEqual(input); });
    });
    it('should validate choosing from a select', function () {
        var expected = 'foo';
        e2e_utils_1.loadServerView()
            .then(function () { return protractor_1.element(protractor_1.by.css('#mySelect')).click(); })
            .then(function () { return protractor_1.element(protractor_1.by.css('#myVal')).click(); })
            .then(function () { return e2e_utils_1.loadClientView(); })
            .then(function () { return protractor_1.element(protractor_1.by.css('#mySelect')).element(protractor_1.by.css('option:checked')).getText(); })
            .then(function (actual) { return expect(actual).toEqual(expected); });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZTJlLmJyb3dzZXIuc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImUyZS5icm93c2VyLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx5Q0FBa0Q7QUFDbEQsMkNBQXVEO0FBQ3ZELHlDQUE2RDtBQUU3RCxRQUFRLENBQUMsa0JBQWtCLEVBQUU7SUFFM0IsU0FBUyxDQUFDLHdCQUFXLENBQUMsQ0FBQztJQUN2QixRQUFRLENBQUMsdUJBQVUsQ0FBQyxDQUFDO0lBRXJCLEVBQUUsQ0FBQyw2QkFBNkIsRUFBRTtRQUNoQywwQkFBYyxFQUFFO2FBQ2IsSUFBSSxDQUFDLGNBQU0sT0FBQSxvQkFBTyxDQUFDLGVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsRUFBL0IsQ0FBK0IsQ0FBQzthQUMzQyxJQUFJLENBQUMsVUFBQSxJQUFJLElBQUksT0FBQSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxFQUFuQyxDQUFtQyxDQUFDLENBQUM7SUFDdkQsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsbUNBQW1DLEVBQUU7UUFDdEMsMEJBQWMsRUFBRTthQUNiLElBQUksQ0FBQyxjQUFNLE9BQUEsMEJBQWMsRUFBRSxFQUFoQixDQUFnQixDQUFDO2FBQzVCLElBQUksQ0FBQyxjQUFNLE9BQUEsb0JBQU8sQ0FBQyxlQUFFLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLEVBQS9CLENBQStCLENBQUM7YUFDM0MsSUFBSSxDQUFDLFVBQUEsSUFBSSxJQUFJLE9BQUEsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsRUFBbkMsQ0FBbUMsQ0FBQyxDQUFDO0lBQ3ZELENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLDRDQUE0QyxFQUFFO1FBQy9DLElBQU0sS0FBSyxHQUFHLGNBQWMsQ0FBQztRQUU3QiwwQkFBYyxFQUFFO2FBQ2IsSUFBSSxDQUFDLGNBQU0sT0FBQSxvQkFBTyxDQUFDLGVBQUUsQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBckMsQ0FBcUMsQ0FBQzthQUNqRCxJQUFJLENBQUMsY0FBTSxPQUFBLG9CQUFPLENBQUMsT0FBTyxFQUFFLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUEzQyxDQUEyQyxDQUFDO2FBQ3ZELElBQUksQ0FBQyxjQUFNLE9BQUEsMEJBQWMsRUFBRSxFQUFoQixDQUFnQixDQUFDO2FBQzVCLElBQUksQ0FBQyxjQUFNLE9BQUEsb0JBQU8sQ0FBQyxlQUFFLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxFQUFuRCxDQUFtRCxDQUFDO2FBQy9ELElBQUksQ0FBQyxVQUFBLE1BQU0sSUFBSSxPQUFBLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQTdCLENBQTZCLENBQUMsQ0FBQztJQUNuRCxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyx3Q0FBd0MsRUFBRTtRQUMzQyxJQUFNLFFBQVEsR0FBRyxLQUFLLENBQUM7UUFFdkIsMEJBQWMsRUFBRTthQUNiLElBQUksQ0FBQyxjQUFNLE9BQUEsb0JBQU8sQ0FBQyxlQUFFLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQXBDLENBQW9DLENBQUM7YUFDaEQsSUFBSSxDQUFDLGNBQU0sT0FBQSxvQkFBTyxDQUFDLGVBQUUsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBakMsQ0FBaUMsQ0FBQzthQUM3QyxJQUFJLENBQUMsY0FBTSxPQUFBLDBCQUFjLEVBQUUsRUFBaEIsQ0FBZ0IsQ0FBQzthQUM1QixJQUFJLENBQUMsY0FBTSxPQUFBLG9CQUFPLENBQUMsZUFBRSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxlQUFFLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsRUFBeEUsQ0FBd0UsQ0FBQzthQUNwRixJQUFJLENBQUMsVUFBQSxNQUFNLElBQUksT0FBQSxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxFQUFoQyxDQUFnQyxDQUFDLENBQUM7SUFDdEQsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyJ9