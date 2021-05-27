export default {
  input: "compiler/src/index.js",
  output: {
    file: "dist/index.js",
    format: "umd",
    name: "angularPluggable",
    globals: {
      "@angular/core": "ng.core",
      "@angular/common": "ng.common",
      rxjs: "rxjs",
      semver: "semver",
    },
  },
  plugins: [],
  external: ["@angular/core", "@angular/common", "rxjs", "semver"],
  onwarn: function (warning) {
    if (
      warning.code === "THIS_IS_UNDEFINED" ||
      warning.code === "UNUSED_EXTERNAL_IMPORT"
    ) {
      return;
    }

    console.warn(warning.code, warning.message);
  },
};
