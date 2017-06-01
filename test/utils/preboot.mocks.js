"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var src_1 = require("../../src");
function getMockWindow() {
    return {
        prebootData: {},
        document: {
            addEventListener: function () { }
        }
    };
}
exports.getMockWindow = getMockWindow;
function getMockOptions() {
    return src_1.assign({}, src_1.defaultOptions, {
        window: getMockWindow()
    });
}
exports.getMockOptions = getMockOptions;
function getMockElement() {
    return {
        cloneNode: function () { return { style: {} }; },
        parentNode: {
            insertBefore: function () { }
        }
    };
}
exports.getMockElement = getMockElement;
// add in parent nodes for children
function addParent(anode) {
    if (anode && anode.childNodes) {
        for (var _i = 0, _a = anode.childNodes; _i < _a.length; _i++) {
            var childNode = _a[_i];
            childNode.parentNode = anode;
            addParent(childNode);
        }
    }
}
exports.addParent = addParent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlYm9vdC5tb2Nrcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInByZWJvb3QubW9ja3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxpQ0FBMEY7QUFFMUY7SUFDRSxNQUFNLENBQVU7UUFDZCxXQUFXLEVBQUUsRUFBRTtRQUNmLFFBQVEsRUFBRTtZQUNSLGdCQUFnQixFQUFFLGNBQWEsQ0FBQztTQUNqQztLQUNGLENBQUM7QUFDSixDQUFDO0FBUEQsc0NBT0M7QUFFRDtJQUNFLE1BQU0sQ0FBd0IsWUFBTSxDQUFDLEVBQUUsRUFBRSxvQkFBYyxFQUFFO1FBQ3ZELE1BQU0sRUFBRSxhQUFhLEVBQUU7S0FDeEIsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUpELHdDQUlDO0FBRUQ7SUFDRSxNQUFNLENBQUM7UUFDTCxTQUFTLEVBQUUsY0FBUSxNQUFNLENBQUMsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQzFDLFVBQVUsRUFBRTtZQUNWLFlBQVksRUFBRSxjQUFhLENBQUM7U0FDN0I7S0FDZ0IsQ0FBQztBQUN0QixDQUFDO0FBUEQsd0NBT0M7QUFFRCxtQ0FBbUM7QUFDbkMsbUJBQTBCLEtBQWM7SUFDdEMsRUFBRSxDQUFDLENBQUMsS0FBSyxJQUFJLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1FBQzlCLEdBQUcsQ0FBQyxDQUFvQixVQUFnQixFQUFoQixLQUFBLEtBQUssQ0FBQyxVQUFVLEVBQWhCLGNBQWdCLEVBQWhCLElBQWdCO1lBQW5DLElBQU0sU0FBUyxTQUFBO1lBQ2xCLFNBQVMsQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO1lBQzdCLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQztTQUN0QjtJQUNILENBQUM7QUFDSCxDQUFDO0FBUEQsOEJBT0MifQ==