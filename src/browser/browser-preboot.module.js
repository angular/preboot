"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
require("rxjs/add/operator/filter");
require("rxjs/add/operator/first");
var core_1 = require("@angular/core");
var event_replayer_1 = require("./event.replayer");
var window_1 = require("./window");
// only thing this does is replay events
var BrowserPrebootModule = BrowserPrebootModule_1 = (function () {
    function BrowserPrebootModule() {
    }
    // user can override the default preboot options by passing them in here
    BrowserPrebootModule.replayEvents = function (opts) {
        var shouldReplay = !opts || !opts.noReplay;
        return {
            ngModule: BrowserPrebootModule_1,
            providers: [
                { provide: window_1.WindowRef, useValue: window },
                event_replayer_1.EventReplayer,
                {
                    // run this once the app as bootstrapped
                    provide: core_1.APP_BOOTSTRAP_LISTENER,
                    // generate the inline preboot code and inject it into the document
                    useFactory: function (replayer) {
                        return function () {
                            // todo: add option for PrebootReplayOptions where user can dictate
                            // when events replayed
                            if (shouldReplay) {
                                replayer.replayAll();
                            }
                        };
                    },
                    multi: true,
                    // we need access to the document and renderer
                    deps: [event_replayer_1.EventReplayer]
                }
            ]
        };
    };
    return BrowserPrebootModule;
}());
BrowserPrebootModule = BrowserPrebootModule_1 = __decorate([
    core_1.NgModule()
], BrowserPrebootModule);
exports.BrowserPrebootModule = BrowserPrebootModule;
var BrowserPrebootModule_1;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJvd3Nlci1wcmVib290Lm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImJyb3dzZXItcHJlYm9vdC5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQSxvQ0FBa0M7QUFDbEMsbUNBQWlDO0FBQ2pDLHNDQUl1QjtBQUV2QixtREFBaUQ7QUFDakQsbUNBQXFDO0FBRXJDLHdDQUF3QztBQUV4QyxJQUFhLG9CQUFvQjtJQUFqQztJQW1DQSxDQUFDO0lBakNDLHdFQUF3RTtJQUNqRSxpQ0FBWSxHQUFuQixVQUFvQixJQUEyQjtRQUM3QyxJQUFNLFlBQVksR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7UUFFN0MsTUFBTSxDQUFDO1lBQ0wsUUFBUSxFQUFFLHNCQUFvQjtZQUM5QixTQUFTLEVBQUU7Z0JBQ1QsRUFBRSxPQUFPLEVBQUUsa0JBQVMsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFO2dCQUN4Qyw4QkFBYTtnQkFDYjtvQkFDRSx3Q0FBd0M7b0JBQ3hDLE9BQU8sRUFBRSw2QkFBc0I7b0JBRS9CLG1FQUFtRTtvQkFDbkUsVUFBVSxFQUFFLFVBQVMsUUFBdUI7d0JBQzFDLE1BQU0sQ0FBQzs0QkFFTCxtRUFBbUU7NEJBQ25FLHVCQUF1Qjs0QkFDdkIsRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztnQ0FDakIsUUFBUSxDQUFDLFNBQVMsRUFBRSxDQUFDOzRCQUN2QixDQUFDO3dCQUNILENBQUMsQ0FBQztvQkFDSixDQUFDO29CQUVELEtBQUssRUFBRSxJQUFJO29CQUVYLDhDQUE4QztvQkFDOUMsSUFBSSxFQUFFLENBQUMsOEJBQWEsQ0FBQztpQkFDdEI7YUFDRjtTQUNGLENBQUM7SUFDSixDQUFDO0lBQ0gsMkJBQUM7QUFBRCxDQUFDLEFBbkNELElBbUNDO0FBbkNZLG9CQUFvQjtJQURoQyxlQUFRLEVBQUU7R0FDRSxvQkFBb0IsQ0FtQ2hDO0FBbkNZLG9EQUFvQiJ9