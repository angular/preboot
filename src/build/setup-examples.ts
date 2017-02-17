import { getInlineCode } from '../node/preboot_node';
import { PrebootOptions } from '../preboot_interfaces';

var fs = require('fs');
var path = require('path');

/**
 * The purpose of this module is to remove move the examples over to
 * dist with the injected inline preboot code attached
 */

function setupExample(name: string, opts: PrebootOptions) {
    let inlineCode = getInlineCode(opts);
    let fileName = 'preboot_buffer_' + name + '.html';
    let targetPath = path.join(process.cwd(), '__dist', fileName);
    let sourcePath = path.join(process.cwd(), 'examples', fileName);
    let fileContents = fs.readFileSync(sourcePath, { encoding: 'utf8' });
    let newContents = fileContents.replace(/\/\/prebootInlineHere/, inlineCode);

    fs.writeFileSync(targetPath, newContents, { encoding: 'utf8' });
}

setupExample('auto', {
    buffer: true,
    appRoot: 'app'
});
setupExample('manual', {
    buffer: false,
    uglify: true,
    serverClientRoot: [
        { serverSelector: '.viewMainServer', clientSelector: '.viewMainClient' },
        { serverSelector: '#viewSideServer', clientSelector: '#viewSideClient' }
    ]
});
setupExample('none', {
    buffer: false,
    appRoot: 'app'
});
