module.exports = {
  root: true,
  extends: ["xo-space", "plugin:prettier/recommended"],
  plugins: ["prettier"],
  rules: {
    "prettier/prettier": "error",
  },
  env: {
    browser: true,
  },
};
