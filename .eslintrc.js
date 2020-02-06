module.exports = {
  env: {
    browser: true, //browser에서 실행가능한지 체크
    es6: true,
    node: true
  },
  extends: ["airbnb-base", "plugin:prettier-recommended"],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly"
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module"
  },
  rules: {
    "no-console": "off",
    "comma-dangle": ["error", "never"],
    quotes: ["error", "double"]
  }
};
