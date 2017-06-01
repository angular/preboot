"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var platform_server_1 = require("@angular/platform-server");
var server_1 = require("../../src/server");
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
            platform_browser_1.BrowserModule.withServerTransition({ appId: 'foo' }),
            platform_server_1.ServerModule,
            server_1.ServerPrebootModule.recordEvents({ appRoot: 'app-root', minify: false })
        ],
        providers: [
            { provide: e2e_app_1.CURRENT_PLATFORM, useValue: 'server view' }
        ],
        bootstrap: [e2e_app_1.AppComponent]
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZTJlLnNlcnZlci5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJlMmUuc2VydmVyLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLHNDQUF5QztBQUN6Qyw4REFBMEQ7QUFDMUQsNERBQXdEO0FBQ3hELDJDQUF1RDtBQUN2RCxxQ0FBMkQ7QUFjM0QsSUFBYSxTQUFTO0lBQXRCO0lBQXlCLENBQUM7SUFBRCxnQkFBQztBQUFELENBQUMsQUFBMUIsSUFBMEI7QUFBYixTQUFTO0lBWnJCLGVBQVEsQ0FBQztRQUNSLFlBQVksRUFBRSxDQUFDLHNCQUFZLENBQUM7UUFDNUIsT0FBTyxFQUFFO1lBQ1AsZ0NBQWEsQ0FBQyxvQkFBb0IsQ0FBQyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsQ0FBQztZQUNwRCw4QkFBWTtZQUNaLDRCQUFtQixDQUFDLFlBQVksQ0FBQyxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxDQUFDO1NBQ3pFO1FBQ0QsU0FBUyxFQUFFO1lBQ1QsRUFBRSxPQUFPLEVBQUUsMEJBQWdCLEVBQUUsUUFBUSxFQUFFLGFBQWEsRUFBRTtTQUN2RDtRQUNELFNBQVMsRUFBRSxDQUFDLHNCQUFZLENBQUM7S0FDMUIsQ0FBQztHQUNXLFNBQVMsQ0FBSTtBQUFiLDhCQUFTIn0=