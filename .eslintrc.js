module.exports = {
    parser: '@typescript-eslint/parser',
    extends: [
      'plugin:react/recommended',
      'plugin:@typescript-eslint/recommended'
    ],
    plugins: ['@typescript-eslint', 'react'],
    env: {
      browser: true,
      node: true,
      es6: true
    },
    settings: {
      react: {
        version: 'detect'
      }
    },
    rules: {
      // Customize your rules as needed
    }
  };