"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
require("jasmine");
var src_1 = require("../../../src");
var utils_1 = require("../../utils");
describe('UNIT TEST get-node-key', function () {
    describe('getNodeKeyForPreboot()', function () {
        it('should generate a default name', function () {
            var nodeContext = {
                root: {
                    serverSelector: '#myApp',
                    clientSelector: '#myApp',
                    serverNode: {},
                    clientNode: {},
                },
                node: {}
            };
            var expected = 'unknown_#myApp';
            var actual = src_1.getNodeKeyForPreboot(nodeContext);
            expect(actual).toEqual(expected);
        });
        it('should generate a name for a deeply nested element', function () {
            var node = { nodeName: 'foo' };
            var nodeContext = {
                root: {
                    serverSelector: '#myApp',
                    serverNode: {
                        childNodes: [{}, {}, { childNodes: [{}, { childNodes: [{}, {}, {}, node] }] }]
                    },
                    clientNode: {}
                },
                node: node
            };
            // add parent references to the rootServerNode tree
            utils_1.addParent(nodeContext.root.serverNode);
            var expected = 'foo_#myApp_s3_s2_s4';
            var actual = src_1.getNodeKeyForPreboot(nodeContext);
            expect(actual).toEqual(expected);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0LW5vZGUta2V5LnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJnZXQtbm9kZS1rZXkuc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDRCQUEwQjtBQUMxQixtQkFBaUI7QUFDakIsb0NBQWlFO0FBQ2pFLHFDQUF3QztBQUV4QyxRQUFRLENBQUMsd0JBQXdCLEVBQUU7SUFDakMsUUFBUSxDQUFDLHdCQUF3QixFQUFFO1FBQ2pDLEVBQUUsQ0FBQyxnQ0FBZ0MsRUFBRTtZQUNuQyxJQUFNLFdBQVcsR0FBZ0I7Z0JBQy9CLElBQUksRUFBRTtvQkFDSixjQUFjLEVBQUUsUUFBUTtvQkFDeEIsY0FBYyxFQUFFLFFBQVE7b0JBQ3hCLFVBQVUsRUFBRSxFQUFFO29CQUNkLFVBQVUsRUFBRSxFQUFFO2lCQUNmO2dCQUNELElBQUksRUFBRSxFQUFFO2FBQ1QsQ0FBQztZQUNGLElBQU0sUUFBUSxHQUFHLGdCQUFnQixDQUFDO1lBQ2xDLElBQU0sTUFBTSxHQUFHLDBCQUFvQixDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQ2pELE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDbkMsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsb0RBQW9ELEVBQUU7WUFDdkQsSUFBTSxJQUFJLEdBQUcsRUFBQyxRQUFRLEVBQUUsS0FBSyxFQUFDLENBQUM7WUFDL0IsSUFBTSxXQUFXLEdBQWdCO2dCQUMvQixJQUFJLEVBQUU7b0JBQ0osY0FBYyxFQUFFLFFBQVE7b0JBQ3hCLFVBQVUsRUFBRTt3QkFDVixVQUFVLEVBQ04sQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUMsVUFBVSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUMsVUFBVSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUM7cUJBQ25FO29CQUNELFVBQVUsRUFBRSxFQUFFO2lCQUNmO2dCQUNELElBQUksRUFBRSxJQUFJO2FBQ1gsQ0FBQztZQUVGLG1EQUFtRDtZQUNuRCxpQkFBUyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7WUFFdkMsSUFBTSxRQUFRLEdBQUcscUJBQXFCLENBQUM7WUFDdkMsSUFBTSxNQUFNLEdBQUcsMEJBQW9CLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDakQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNuQyxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMifQ==