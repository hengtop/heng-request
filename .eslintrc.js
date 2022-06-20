const path = require("path");
const resolve = (_path) => path.resolve(__dirname, _path);
const DOMGlobals = ["window", "document"];
const NodeGlobals = ["module", "require"];

module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  parser: "@typescript-eslint/parser", // 配置ts解析器
  parserOptions: {
    project: resolve("./tsconfig.json"),
    tsconfigRootDir: resolve("src/*"),
    sourceType: "module",
  },
  ignorePatterns: ["dist", "rollup.config.js", "demo"],
  // plugins: ['prettier'],
  rules: {
    indent: ["error", 2],
    "no-unused-vars": "off",
    "no-restricted-globals": ["error", ...DOMGlobals, ...NodeGlobals],
    "no-console": "off",
  },
};
