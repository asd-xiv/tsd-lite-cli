module.exports = {
  "extends": ["@asd14/eslint-config/targets/node-ts"],
  "root": true,
  "rules": {
    // Delegate to TypeScript's noPropertyAccessFromIndexSignature
    "dot-notation": "off",

    // Disable relative imports since there's no build step and resolver
    "no-relative-import-paths/no-relative-import-paths": "off",

    // Allow importing devDependencies in config filles, tests, docs,
    // examples, etc.
    "import/no-extraneous-dependencies": [
      "error",
      {
        "devDependencies": [
          "**/*.+(test|test-d).+(ts|tsx)"
        ]
      }
    ]
  },
  "settings": {
    "import/cache": {
      "lifetime": 5
    }
  }
}
