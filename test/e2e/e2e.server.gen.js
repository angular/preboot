"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
require("zone.js");
require("zone.js/dist/long-stack-trace-zone.js");
var core_1 = require("@angular/core");
var compiler_1 = require("@angular/compiler");
var platform_server_1 = require("@angular/platform-server");
var e2e_server_module_1 = require("./e2e.server.module");
var fs = require("fs");
var path = require("path");
// get the JIT compiler (not exposed publically, so need to inject it)
var injector = core_1.ReflectiveInjector.resolveAndCreate([compiler_1.COMPILER_PROVIDERS]);
var jitCompiler = injector.get(compiler_1.JitCompiler);
// use the JIT compiler to turn our AppModule into a factory
jitCompiler.compileModuleAsync(e2e_server_module_1.AppModule)
    .then(function (factory) { return platform_server_1.renderModuleFactory(factory, {
    url: '/',
    document: "\n      <html>\n        <head>\n          <title>Preboot Test</title>\n        </head>\n        <body>\n          <app-root></app-root>\n        </body>\n      </html>\n    "
}); })
    .then(function (html) {
    var filePath = path.join(process.cwd(), 'test/e2e/dist/index.html');
    fs.writeFileSync(filePath, html);
})
    .catch(console.error);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZTJlLnNlcnZlci5nZW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJlMmUuc2VydmVyLmdlbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDRCQUEwQjtBQUMxQixtQkFBaUI7QUFDakIsaURBQStDO0FBQy9DLHNDQUFvRTtBQUNwRSw4Q0FBb0U7QUFDcEUsNERBQStEO0FBQy9ELHlEQUFnRDtBQUVoRCx1QkFBeUI7QUFDekIsMkJBQTZCO0FBRTdCLHNFQUFzRTtBQUN0RSxJQUFNLFFBQVEsR0FBRyx5QkFBa0IsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLDZCQUFrQixDQUFDLENBQUMsQ0FBQztBQUMzRSxJQUFNLFdBQVcsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLHNCQUFXLENBQUMsQ0FBQztBQUU5Qyw0REFBNEQ7QUFDNUQsV0FBVyxDQUFDLGtCQUFrQixDQUFDLDZCQUFTLENBQUM7S0FHdEMsSUFBSSxDQUFDLFVBQUMsT0FBc0MsSUFBSyxPQUFBLHFDQUFtQixDQUFDLE9BQU8sRUFBRTtJQUM3RSxHQUFHLEVBQUUsR0FBRztJQUNSLFFBQVEsRUFBRSwrS0FTVDtDQUNGLENBQUMsRUFaZ0QsQ0FZaEQsQ0FBQztLQUNGLElBQUksQ0FBQyxVQUFDLElBQVk7SUFDakIsSUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsMEJBQTBCLENBQUMsQ0FBQztJQUN0RSxFQUFFLENBQUMsYUFBYSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUNuQyxDQUFDLENBQUM7S0FDRCxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDIn0=