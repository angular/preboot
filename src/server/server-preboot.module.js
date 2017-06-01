"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var platform_server_1 = require("@angular/platform-server");
var preboot_generator_1 = require("./preboot.generator");
// only thing this does is modify the document
var ServerPrebootModule = ServerPrebootModule_1 = (function () {
    function ServerPrebootModule() {
    }
    // user can override the default preboot options by passing them in here
    ServerPrebootModule.recordEvents = function (opts) {
        return {
            ngModule: ServerPrebootModule_1,
            providers: [{
                    // this likely will never be injected but need something to run the
                    // factory function
                    provide: core_1.APP_BOOTSTRAP_LISTENER,
                    // generate the inline preboot code and inject it into the document
                    useFactory: function (state, rendererFactory) {
                        return function () {
                            var doc = state.getDocument();
                            var prebootEventRecorderCode = preboot_generator_1.generatePrebootEventRecorderCode(opts);
                            addInlineCodeToDocument(prebootEventRecorderCode, doc, rendererFactory);
                        };
                    },
                    multi: true,
                    // we need access to the document and renderer
                    deps: [platform_server_1.PlatformState, core_1.RendererFactory2]
                }]
        };
    };
    return ServerPrebootModule;
}());
ServerPrebootModule = ServerPrebootModule_1 = __decorate([
    core_1.NgModule()
], ServerPrebootModule);
exports.ServerPrebootModule = ServerPrebootModule;
function addInlineCodeToDocument(inlineCode, doc, rendererFactory) {
    var renderType = { id: '-1', encapsulation: core_1.ViewEncapsulation.None, styles: [], data: {} };
    var renderer = rendererFactory.createRenderer(doc, renderType);
    var script = renderer.createElement('script');
    renderer.setValue(script, inlineCode);
    renderer.appendChild(doc.head, script);
}
exports.addInlineCodeToDocument = addInlineCodeToDocument;
var ServerPrebootModule_1;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmVyLXByZWJvb3QubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic2VydmVyLXByZWJvb3QubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUEsc0NBUXVCO0FBQ3ZCLDREQUF5RDtBQUV6RCx5REFBdUU7QUFFdkUsOENBQThDO0FBRTlDLElBQWEsbUJBQW1CO0lBQWhDO0lBNEJBLENBQUM7SUExQkMsd0VBQXdFO0lBQ2pFLGdDQUFZLEdBQW5CLFVBQW9CLElBQTJCO1FBQzdDLE1BQU0sQ0FBQztZQUNMLFFBQVEsRUFBRSxxQkFBbUI7WUFDN0IsU0FBUyxFQUFFLENBQUM7b0JBRVYsbUVBQW1FO29CQUNuRSxtQkFBbUI7b0JBQ25CLE9BQU8sRUFBRSw2QkFBc0I7b0JBRS9CLG1FQUFtRTtvQkFDbkUsVUFBVSxFQUFFLFVBQVUsS0FBb0IsRUFBRSxlQUFpQzt3QkFDM0UsTUFBTSxDQUFDOzRCQUNMLElBQU0sR0FBRyxHQUFHLEtBQUssQ0FBQyxXQUFXLEVBQUUsQ0FBQzs0QkFDaEMsSUFBTSx3QkFBd0IsR0FBRyxvREFBZ0MsQ0FBQyxJQUFJLENBQUMsQ0FBQzs0QkFDeEUsdUJBQXVCLENBQUMsd0JBQXdCLEVBQUUsR0FBRyxFQUFFLGVBQWUsQ0FBQyxDQUFDO3dCQUMxRSxDQUFDLENBQUM7b0JBQ0osQ0FBQztvQkFFRCxLQUFLLEVBQUUsSUFBSTtvQkFFWCw4Q0FBOEM7b0JBQzlDLElBQUksRUFBRSxDQUFDLCtCQUFhLEVBQUUsdUJBQWdCLENBQUM7aUJBQ3hDLENBQUM7U0FDSCxDQUFDO0lBQ0osQ0FBQztJQUNILDBCQUFDO0FBQUQsQ0FBQyxBQTVCRCxJQTRCQztBQTVCWSxtQkFBbUI7SUFEL0IsZUFBUSxFQUFFO0dBQ0UsbUJBQW1CLENBNEIvQjtBQTVCWSxrREFBbUI7QUE4QmhDLGlDQUF3QyxVQUFrQixFQUFFLEdBQWEsRUFBRSxlQUFpQztJQUMxRyxJQUFNLFVBQVUsR0FBa0IsRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLGFBQWEsRUFBRSx3QkFBaUIsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLENBQUM7SUFDNUcsSUFBTSxRQUFRLEdBQUcsZUFBZSxDQUFDLGNBQWMsQ0FBQyxHQUFHLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFDakUsSUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNoRCxRQUFRLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUMsQ0FBQztJQUN0QyxRQUFRLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDekMsQ0FBQztBQU5ELDBEQU1DIn0=