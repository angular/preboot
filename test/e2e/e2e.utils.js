"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var protractor_1 = require("protractor");
function loadServerView() {
    protractor_1.browser.waitForAngularEnabled(false);
    return protractor_1.browser.get('http://localhost:4201/')
        .then(function () { return protractor_1.browser.refresh(); });
}
exports.loadServerView = loadServerView;
function loadClientView() {
    return loadClientScript()
        .then(function () { return protractor_1.browser.executeScript('bootstrapPrebootClient()'); });
}
exports.loadClientView = loadClientView;
function loadClientScript() {
    return new Promise(function (resolve) {
        protractor_1.browser.executeScript(function () {
            console.log('executeScript()');
            var scriptTag = document.createElement('script');
            scriptTag.type = 'text/javascript';
            scriptTag.src = '/e2e.browser.js';
            document.getElementsByTagName('head')[0].appendChild(scriptTag);
        });
        waitUntilExists(resolve);
    });
}
exports.loadClientScript = loadClientScript;
function waitUntilExists(done) {
    protractor_1.browser.executeScript(function () {
        return (typeof bootstrapPrebootClient !== 'undefined');
    })
        .then(function (keyExists) {
        if (keyExists) {
            done();
        }
        else {
            setTimeout(function () { return waitUntilExists(done); }, 10);
        }
    });
}
exports.waitUntilExists = waitUntilExists;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZTJlLnV0aWxzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZTJlLnV0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEseUNBQThDO0FBSTlDO0lBQ0ksb0JBQU8sQ0FBQyxxQkFBcUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNyQyxNQUFNLENBQUMsb0JBQU8sQ0FBQyxHQUFHLENBQUMsd0JBQXdCLENBQUM7U0FDekMsSUFBSSxDQUFDLGNBQU0sT0FBQSxvQkFBTyxDQUFDLE9BQU8sRUFBRSxFQUFqQixDQUFpQixDQUFDLENBQUM7QUFDckMsQ0FBQztBQUpELHdDQUlDO0FBRUQ7SUFDRSxNQUFNLENBQUMsZ0JBQWdCLEVBQUU7U0FDdEIsSUFBSSxDQUFDLGNBQU0sT0FBQSxvQkFBTyxDQUFDLGFBQWEsQ0FBQywwQkFBMEIsQ0FBQyxFQUFqRCxDQUFpRCxDQUFDLENBQUM7QUFDbkUsQ0FBQztBQUhELHdDQUdDO0FBRUQ7SUFDRSxNQUFNLENBQUMsSUFBSSxPQUFPLENBQUMsVUFBQyxPQUFPO1FBQ3pCLG9CQUFPLENBQUMsYUFBYSxDQUFDO1lBQ3BCLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsQ0FBQztZQUMvQixJQUFNLFNBQVMsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ25ELFNBQVMsQ0FBQyxJQUFJLEdBQUcsaUJBQWlCLENBQUM7WUFDbkMsU0FBUyxDQUFDLEdBQUcsR0FBRyxpQkFBaUIsQ0FBQztZQUNsQyxRQUFRLENBQUMsb0JBQW9CLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ2xFLENBQUMsQ0FBQyxDQUFDO1FBRUgsZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzNCLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQVpELDRDQVlDO0FBRUQseUJBQWdDLElBQWM7SUFDNUMsb0JBQU8sQ0FBQyxhQUFhLENBQUM7UUFDcEIsTUFBTSxDQUFDLENBQUMsT0FBTyxzQkFBc0IsS0FBSyxXQUFXLENBQUMsQ0FBQztJQUN6RCxDQUFDLENBQUM7U0FDQyxJQUFJLENBQUMsVUFBQyxTQUFrQjtRQUN2QixFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQ2QsSUFBSSxFQUFFLENBQUM7UUFDVCxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixVQUFVLENBQUMsY0FBTSxPQUFBLGVBQWUsQ0FBQyxJQUFJLENBQUMsRUFBckIsQ0FBcUIsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUM5QyxDQUFDO0lBQ0gsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDO0FBWEQsMENBV0MifQ==