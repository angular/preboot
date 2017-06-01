"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
require("zone.js");
require("zone.js/dist/long-stack-trace-zone.js");
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var browser_1 = require("../../src/browser");
var e2e_app_1 = require("./e2e.app");
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    core_1.NgModule({
        declarations: [e2e_app_1.AppComponent],
        imports: [
            platform_browser_1.BrowserModule,
            browser_1.BrowserPrebootModule.replayEvents()
        ],
        providers: [
            { provide: e2e_app_1.CURRENT_PLATFORM, useValue: 'client view' }
        ],
        bootstrap: [e2e_app_1.AppComponent]
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZTJlLmJyb3dzZXIubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZTJlLmJyb3dzZXIubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUEsNEJBQTBCO0FBQzFCLG1CQUFpQjtBQUNqQixpREFBK0M7QUFFL0Msc0NBQXlDO0FBQ3pDLDhEQUEwRDtBQUMxRCw2Q0FBeUQ7QUFDekQscUNBQTJEO0FBYTNELElBQWEsU0FBUztJQUF0QjtJQUF5QixDQUFDO0lBQUQsZ0JBQUM7QUFBRCxDQUFDLEFBQTFCLElBQTBCO0FBQWIsU0FBUztJQVhyQixlQUFRLENBQUM7UUFDUixZQUFZLEVBQUUsQ0FBQyxzQkFBWSxDQUFDO1FBQzVCLE9BQU8sRUFBRTtZQUNQLGdDQUFhO1lBQ2IsOEJBQW9CLENBQUMsWUFBWSxFQUFFO1NBQ3BDO1FBQ0QsU0FBUyxFQUFFO1lBQ1QsRUFBRSxPQUFPLEVBQUUsMEJBQWdCLEVBQUUsUUFBUSxFQUFFLGFBQWEsRUFBRTtTQUN2RDtRQUNELFNBQVMsRUFBRSxDQUFDLHNCQUFZLENBQUM7S0FDMUIsQ0FBQztHQUNXLFNBQVMsQ0FBSTtBQUFiLDhCQUFTIn0=