#!/usr/bin/env node

/**
 * Script that simplifies the workflow of running unit tests for a component
 * using Bazel.
 *
 * Supported command line flags:
 *
 *   --local    | If specified, no browser will be launched.
 *   --firefox  | Instead of Chrome being used for tests, Firefox will be used.
 *   --no-watch | Watch mode is enabled by default. This flag opts-out to standard Bazel.
 */

const minimist = require('minimist');
const shelljs = require('shelljs');
const chalk = require('chalk');
const path = require('path');
const args = process.argv.slice(2);

// Path to the project directory.
const projectDir = path.join(__dirname, '../');

// ShellJS should exit if any command fails.
shelljs.set('-e');
shelljs.cd(projectDir);

// Extracts the supported command line options.
const {firefox, watch, 'view-engine': viewEngine} = minimist(args, {
  boolean: ['local', 'firefox', 'watch', 'view-engine'],
  default: {watch: true, 'view-engine': false},
});

const browserName = firefox ? 'firefox-local' : 'chromium-local';
const configFlag = viewEngine ? '--config=view-engine' : '';

// `ibazel` doesn't allow us to filter tests and build targets as it only allows
// a subset of Bazel flags to be passed through. We temporarily always use `bazel`
// instead of ibazel until https://github.com/bazelbuild/bazel-watcher/pull/382 lands.
if (watch) {
  console.warn(chalk.yellow('Unable to run all component tests in watch mode.'));
  console.warn(chalk.yellow('Tests will be run in non-watch mode..'));
}
shelljs.exec(
  `yarn -s bazel test --test_tag_filters=-e2e,browser:${browserName} ` +
  `--build_tag_filters=browser:${browserName} --build_tests_only ${configFlag} //src/...`);
return;
