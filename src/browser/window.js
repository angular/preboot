"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WindowRef = (function () {
    function WindowRef() {
    }
    WindowRef.prototype.getComputedStyle = function (node) {
        return {
            node: node,
            getPropertyValue: function (prop) {
                return prop;
            }
        };
    };
    return WindowRef;
}());
exports.WindowRef = WindowRef;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2luZG93LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsid2luZG93LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUE7SUFBQTtJQVlBLENBQUM7SUFSQyxvQ0FBZ0IsR0FBaEIsVUFBa0IsSUFBYTtRQUM3QixNQUFNLENBQUM7WUFDTCxJQUFJLEVBQUUsSUFBSTtZQUNWLGdCQUFnQixFQUFFLFVBQUMsSUFBWTtnQkFDN0IsTUFBTSxDQUFDLElBQUksQ0FBQztZQUNkLENBQUM7U0FDZSxDQUFDO0lBQ3JCLENBQUM7SUFDSCxnQkFBQztBQUFELENBQUMsQUFaRCxJQVlDO0FBWlksOEJBQVMifQ==