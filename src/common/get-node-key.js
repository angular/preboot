"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Attempt to generate key from node position in the DOM
 *
 * NOTE: this function is duplicated in preboot_inline.ts and must be
 * kept in sync. It is duplicated for right now since we are trying
 * to keep all inline code separated and distinct (i.e. without imports)
 */
function getNodeKeyForPreboot(nodeContext) {
    var ancestors = [];
    var root = nodeContext.root;
    var node = nodeContext.node;
    var temp = node;
    // walk up the tree from the target node up to the root
    while (temp && temp !== root.serverNode && temp !== root.clientNode) {
        ancestors.push(temp);
        temp = temp.parentNode;
    }
    // note: if temp doesn't exist here it means root node wasn't found
    if (temp) {
        ancestors.push(temp);
    }
    // now go backwards starting from the root, appending the appName to unique
    // identify the node later..
    var name = node.nodeName || 'unknown';
    var key = name + '_' + root.serverSelector;
    var len = ancestors.length;
    for (var i = (len - 1); i >= 0; i--) {
        temp = ancestors[i];
        if (temp.childNodes && i > 0) {
            for (var j = 0; j < temp.childNodes.length; j++) {
                if (temp.childNodes[j] === ancestors[i - 1]) {
                    key += '_s' + (j + 1);
                    break;
                }
            }
        }
    }
    return key;
}
exports.getNodeKeyForPreboot = getNodeKeyForPreboot;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0LW5vZGUta2V5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZ2V0LW5vZGUta2V5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUE7Ozs7OztHQU1HO0FBQ0gsOEJBQXFDLFdBQXdCO0lBQzNELElBQU0sU0FBUyxHQUFjLEVBQUUsQ0FBQztJQUNoQyxJQUFNLElBQUksR0FBRyxXQUFXLENBQUMsSUFBSSxDQUFDO0lBQzlCLElBQU0sSUFBSSxHQUFHLFdBQVcsQ0FBQyxJQUFJLENBQUM7SUFDOUIsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDO0lBRWhCLHVEQUF1RDtJQUN2RCxPQUFPLElBQUksSUFBSSxJQUFJLEtBQUssSUFBSSxDQUFDLFVBQVUsSUFBSSxJQUFJLEtBQUssSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQ3BFLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDckIsSUFBSSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7SUFDekIsQ0FBQztJQUVELG1FQUFtRTtJQUNuRSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ1QsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN2QixDQUFDO0lBRUQsMkVBQTJFO0lBQzNFLDRCQUE0QjtJQUM1QixJQUFNLElBQUksR0FBRyxJQUFJLENBQUMsUUFBUSxJQUFJLFNBQVMsQ0FBQztJQUN4QyxJQUFJLEdBQUcsR0FBRyxJQUFJLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUM7SUFDM0MsSUFBTSxHQUFHLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQztJQUU3QixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7UUFDcEMsSUFBSSxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVwQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzdCLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztnQkFDaEQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsS0FBSyxTQUFTLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDNUMsR0FBRyxJQUFJLElBQUksR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztvQkFDdEIsS0FBSyxDQUFDO2dCQUNSLENBQUM7WUFDSCxDQUFDO1FBQ0gsQ0FBQztJQUNILENBQUM7SUFFRCxNQUFNLENBQUMsR0FBRyxDQUFDO0FBQ2IsQ0FBQztBQXJDRCxvREFxQ0MifQ==