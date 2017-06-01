"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
exports.CURRENT_PLATFORM = new core_1.InjectionToken('CurrentPlatform');
var AppComponent = (function () {
    function AppComponent(platform) {
        this.platform = platform;
    }
    return AppComponent;
}());
AppComponent = __decorate([
    core_1.Component({
        selector: 'app-root',
        template: "\n    <h1>{{platform}}</h1>\n    <p>Here is something</p>\n    <input id=\"myTextBox\">\n    <select id=\"mySelect\">\n      <option></option>\n      <option id=\"myVal\">foo</option>\n      <option>moo</option>\n    </select>\n  ",
    }),
    __param(0, core_1.Inject(exports.CURRENT_PLATFORM)),
    __metadata("design:paramtypes", [String])
], AppComponent);
exports.AppComponent = AppComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZTJlLmFwcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImUyZS5hcHAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQSxzQ0FBa0U7QUFFckQsUUFBQSxnQkFBZ0IsR0FBRyxJQUFJLHFCQUFjLENBQVMsaUJBQWlCLENBQUMsQ0FBQztBQWU5RSxJQUFhLFlBQVk7SUFDdkIsc0JBQThDLFFBQWdCO1FBQWhCLGFBQVEsR0FBUixRQUFRLENBQVE7SUFBRyxDQUFDO0lBQ3BFLG1CQUFDO0FBQUQsQ0FBQyxBQUZELElBRUM7QUFGWSxZQUFZO0lBYnhCLGdCQUFTLENBQUM7UUFDVCxRQUFRLEVBQUUsVUFBVTtRQUNwQixRQUFRLEVBQUUsd09BU1Q7S0FDRixDQUFDO0lBRWMsV0FBQSxhQUFNLENBQUMsd0JBQWdCLENBQUMsQ0FBQTs7R0FEM0IsWUFBWSxDQUV4QjtBQUZZLG9DQUFZIn0=