workspace(
    name = "preboot",
    managed_directories = {"@npm": ["node_modules"]},
)

load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")

# Add NodeJS rules
http_archive(
    name = "build_bazel_rules_nodejs",
    sha256 = "d14076339deb08e5460c221fae5c5e9605d2ef4848eee1f0c81c9ffdc1ab31c1",
    urls = ["https://github.com/bazelbuild/rules_nodejs/releases/download/1.6.1/rules_nodejs-1.6.1.tar.gz"],
)

load("@build_bazel_rules_nodejs//:index.bzl", "check_bazel_version", "node_repositories", "yarn_install")

# The minimum bazel version to use with this repo is v3.1.0.
check_bazel_version("3.0.0")

node_repositories(
    node_repositories = {
        "12.9.1-darwin_amd64": ("node-v12.9.1-darwin-x64.tar.gz", "node-v12.9.1-darwin-x64", "9aaf29d30056e2233fd15dfac56eec12e8342d91bb6c13d54fb5e599383dddb9"),
        "12.9.1-linux_amd64": ("node-v12.9.1-linux-x64.tar.xz", "node-v12.9.1-linux-x64", "680a1263c9f5f91adadcada549f0a9c29f1b26d09658d2b501c334c3f63719e5"),
        "12.9.1-windows_amd64": ("node-v12.9.1-win-x64.zip", "node-v12.9.1-win-x64", "6a4e54bda091bd02dbd8ff1b9f6671e036297da012a53891e3834d4bf4bed297"),
    },
    node_urls = ["https://nodejs.org/dist/v{version}/{filename}"],
    node_version = "12.9.1",
    # We do not need to define a specific yarn version as bazel will respect the .yarnrc file
    # and run the version of yarn defined at the set-path value.
    # Since bazel runs yarn from the working directory of the package.json, and our .yarnrc
    # file is in the same directory, it correctly discovers and respects it.  Additionally,
    # it ensures that the yarn environment variable to detect if yarn has already followed
    # the set-path value is reset.
)

yarn_install(
    name = "npm",
    # Redirects Yarn `stdout` output to `stderr`. This ensures that stdout is not accidentally
    # polluted when Bazel runs Yarn. Workaround until the upstream fix is available:
    # https://github.com/bazelbuild/bazel/pull/10611.
    args = ["1>&2"],
    # We add the postinstall patches file, and ngcc main fields update script here so
    # that Yarn will rerun whenever one of these files has been modified.
    data = [
        "//:tools/postinstall/apply-patches.js",
        "//:tools/postinstall/update-ngcc-main-fields.js",
    ],
    package_json = "//:package.json",
    quiet = False,
    yarn_lock = "//:yarn.lock",
)

# Install all bazel dependencies of the @ngdeps npm packages
load("@npm//:install_bazel_dependencies.bzl", "install_bazel_dependencies")

install_bazel_dependencies()

# Setup TypeScript Bazel workspace
load("@npm_bazel_typescript//:index.bzl", "ts_setup_workspace")

ts_setup_workspace()

# Fetch transitive dependencies which are needed to use the karma rules.
load("@npm_bazel_karma//:package.bzl", "npm_bazel_karma_dependencies")

npm_bazel_karma_dependencies()

# Setup web testing. We need to setup a browser because the web testing rules for TypeScript need
# a reference to a registered browser (ideally that's a hermetic version of a browser)
load("@io_bazel_rules_webtesting//web:repositories.bzl", "web_test_repositories")

web_test_repositories()

load("@io_bazel_rules_webtesting//web/versioned:browsers-0.3.2.bzl", "browser_repositories")

browser_repositories(
    chromium = True,
    firefox = True,
)
