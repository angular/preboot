workspace(name = "preboot")

#
# Download Bazel toolchain dependencies as needed by build actions
#

http_archive(
    name = "build_bazel_rules_nodejs",
    urls = ["https://github.com/bazelbuild/rules_nodejs/archive/0.11.2.zip"],
    strip_prefix = "rules_nodejs-0.11.2",
    sha256 = "c00d5381adeefb56e0ef959a7b168cae628535dab933cfad1c2cd1870cd7c9de",
)

http_archive(
    name = "bazel_skylib",
    urls = ["https://github.com/bazelbuild/bazel-skylib/archive/0.3.1.zip"],
    strip_prefix = "bazel-skylib-0.3.1",
    sha256 = "95518adafc9a2b656667bbf517a952e54ce7f350779d0dd95133db4eb5c27fb1",
)

http_archive(
    name = "io_bazel_rules_webtesting",
    url = "https://github.com/bazelbuild/rules_webtesting/archive/7ffe970bbf380891754487f66c3d680c087d67f2.zip",
    strip_prefix = "rules_webtesting-7ffe970bbf380891754487f66c3d680c087d67f2",
    sha256 = "4fb0dca8c9a90547891b7ef486592775a523330fc4555c88cd8f09270055c2ce",
)

http_archive(
    name = "build_bazel_rules_typescript",
    url = "https://github.com/bazelbuild/rules_typescript/archive/1d9a4b0087f307e31af91e2b221a6447288994c6.zip",
    strip_prefix = "rules_typescript-1d9a4b0087f307e31af91e2b221a6447288994c6",
    sha256 = "e17ac3f33d5d3cd2a0c385c4fd28b814d0ad46c6c67ccaef97160be99d7a24eb",
)

http_archive(
    name = "io_bazel_rules_go",
    url = "https://github.com/bazelbuild/rules_go/releases/download/0.10.3/rules_go-0.10.3.tar.gz",
    sha256 = "feba3278c13cde8d67e341a837f69a029f698d7a27ddbb2a202be7a10b22142a",
)

# This commit matches the version of buildifier in angular/ngcontainer
# If you change this, also check if it matches the version in the angular/ngcontainer
# version in /.circleci/config.yml
BAZEL_BUILDTOOLS_VERSION = "82b21607e00913b16fe1c51bec80232d9d6de31c"

http_archive(
    name = "com_github_bazelbuild_buildtools",
    url = "https://github.com/bazelbuild/buildtools/archive/%s.zip" % BAZEL_BUILDTOOLS_VERSION,
    strip_prefix = "buildtools-%s" % BAZEL_BUILDTOOLS_VERSION,
    sha256 = "edb24c2f9c55b10a820ec74db0564415c0cf553fa55e9fc709a6332fb6685eff",
)

# Fetching the Bazel source code allows us to compile the Skylark linter
http_archive(
    name = "io_bazel",
    url = "https://github.com/bazelbuild/bazel/archive/968f87900dce45a7af749a965b72dbac51b176b3.zip",
    strip_prefix = "bazel-968f87900dce45a7af749a965b72dbac51b176b3",
    sha256 = "e373d2ae24955c1254c495c9c421c009d88966565c35e4e8444c082cb1f0f48f",
)


#
# Load and install our dependencies downloaded above.
#

load("@build_bazel_rules_nodejs//:defs.bzl", "check_bazel_version", "node_repositories")

check_bazel_version("0.15.0")
node_repositories(
  package_json = ["//:package.json"],
  preserve_symlinks = True,
)

load("@io_bazel_rules_go//go:def.bzl", "go_rules_dependencies", "go_register_toolchains")

go_rules_dependencies()
go_register_toolchains()

load("@io_bazel_rules_webtesting//web:repositories.bzl", "browser_repositories", "web_test_repositories")

web_test_repositories()
browser_repositories(
    chromium = True,
    firefox = True,
)

load("@build_bazel_rules_typescript//:defs.bzl", "ts_setup_workspace")

ts_setup_workspace()


# Add Angular rules
local_repository(
  name = "angular",
  path = "node_modules/@angular/bazel",
)

# Add rxjs
local_repository(
  name = "rxjs",
  path = "node_modules/rxjs/src",
)


load("@angular//:index.bzl", "ng_setup_workspace")

ng_setup_workspace()
