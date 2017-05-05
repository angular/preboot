var fs = require('fs');
var path = require('path');

/**
 * The purpose of this module is to remove the "export" line from the generated
 * JavaScript files in __build so that we can actually stick the JavaScript
 * directly in the browser.
 */

function stripExportFromFile(fileName: string) {
    let fullPath = path.join(process.cwd(), '__dist', fileName + '.js');
    let fileContents = fs.readFileSync(fullPath, { encoding: 'utf8' });
    let newContents = fileContents
        .replace(/"use strict";/, '')
        .replace(/Object.defineProperty.*;/, '')
        .replace(/exports\..*;/, '');

    fs.writeFileSync(fullPath, newContents, { encoding: 'utf8' });
}

stripExportFromFile('preboot_inline');
stripExportFromFile('preboot_inline.min');
stripExportFromFile('preboot_browser');
stripExportFromFile('preboot_browser.min');
