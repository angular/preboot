"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var platform_browser_dynamic_1 = require("@angular/platform-browser-dynamic");
var e2e_browser_module_1 = require("./e2e.browser.module");
// here we are adding the client bootstrap as a function on the window
window.bootstrapPrebootClient = function () {
    return platform_browser_dynamic_1.platformBrowserDynamic().bootstrapModule(e2e_browser_module_1.AppModule);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZTJlLmJyb3dzZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJlMmUuYnJvd3Nlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDhFQUEyRTtBQUMzRSwyREFBaUQ7QUFFakQsc0VBQXNFO0FBQ2hFLE1BQU8sQ0FBQyxzQkFBc0IsR0FBRztJQUNyQyxNQUFNLENBQUMsaURBQXNCLEVBQUUsQ0FBQyxlQUFlLENBQUMsOEJBQVMsQ0FBQyxDQUFDO0FBQzdELENBQUMsQ0FBQyJ9