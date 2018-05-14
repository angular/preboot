""" List of all preboot components / subpackages.
"""

NG_VERSION = "^6.0.0"

PKG_GROUP_REPLACEMENTS = {
    "0.0.0-NG": NG_VERSION
}

# Base rollup globals for dependencies and the root entry-point.
PREBOOT_ROLLUP_GLOBALS = {
  'tslib': 'tslib',
  'preboot': 'preboot',
  'preboot/api': 'preboot.api',
  'preboot/common': 'preboot.common',
  'preboot/angular': 'preboot.angular',
}
