// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const { SpecReporter } = require('jasmine-spec-reporter');

exports.config = {
  useAllAngular2AppRoots: true,
  specs: ['./out-tsc/e2e/**/*.spec.js'],
  baseUrl: 'http://localhost:9393/',
  allScriptsTimeout: 11000,
  getPageTimeout: 11000,
  capabilities: {
    browserName: 'chrome',
    // For Travis
    chromeOptions: {
      binary: process.env.CHROME_BIN,
      args: ['--no-sandbox']
    }
  },
  directConnect: true,

  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 300000,
    print: function () { }
  },
  onPrepare() {
    jasmine.getEnv().addReporter(new SpecReporter({ spec: { displayStacktrace: true } }));
  }
};
