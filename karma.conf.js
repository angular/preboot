module.exports = function (config) {

  config.set({
    basePath: __dirname,
    frameworks: ['jasmine'],

    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-sourcemap-loader'),
    ],

    client: {
      jasmine: {
        // Always execute the tests in a random order to ensure that tests don't depend
        // accidentally on other tests.
        random: true
      }
    },

    customLaunchers: {
      // From the CLI. Not used here but interesting
      // chrome setup for travis CI using chromium
      Chrome_travis_ci: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    },

    files: [
      {pattern: 'node_modules/core-js/client/core.js', included: true, watched: false},
      {pattern: 'node_modules/tslib/tslib.js', included: true, watched: false},
      {pattern: 'node_modules/systemjs/dist/system.src.js', included: true, watched: false},
      {pattern: 'node_modules/zone.js/dist/zone.js', included: true, watched: false},
      {pattern: 'node_modules/zone.js/dist/proxy.js', included: true, watched: false},
      {pattern: 'node_modules/zone.js/dist/sync-test.js', included: true, watched: false},
      {pattern: 'node_modules/zone.js/dist/jasmine-patch.js', included: true, watched: false},
      {pattern: 'node_modules/zone.js/dist/async-test.js', included: true, watched: false},
      {pattern: 'node_modules/zone.js/dist/fake-async-test.js', included: true, watched: false},

      {pattern: 'node_modules/@angular/**/*', included: false, watched: false},
      {pattern: 'node_modules/rxjs/**/*', included: false, watched: false},

      {pattern: 'karma-test-shim.js', included: true, watched: false},
      {pattern: 'out-tsc/spec/**/*', included: false, watched: true},
    ],

    exclude: [],
    preprocessors: {
      'out-tsc/spec/**/*.js': ['sourcemap']
    },
    reporters: ['progress', 'kjhtml'],

    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['Chrome'],
    singleRun: false
  })
};
