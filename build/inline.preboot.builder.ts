import 'reflect-metadata';
import { minify } from 'uglify-js';
import { getEventRecorderCode } from '../src/server';
import fs = require('fs');
import path = require('path');

const distDir = __dirname;
const filePath = path.join(distDir, '../lib/preboot.js');
const fileMinPath = path.join(distDir, '../lib/preboot.min.js');
const eventRecorderCode = getEventRecorderCode();
const eventRecorderModule = `module.exports = function () {
  ${eventRecorderCode}
};
`;
const eventRecorderCodeMin = minify(eventRecorderCode).code;
const eventRecorderModuleMin = `module.exports = function(){${eventRecorderCodeMin}}`;

fs.writeFileSync(filePath, eventRecorderModule);
fs.writeFileSync(fileMinPath, eventRecorderModuleMin);
