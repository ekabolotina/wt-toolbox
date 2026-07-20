const js = require('@eslint/js');

module.exports = [
  { ignores: ['dist/', 'node_modules/'] },
  js.configs.recommended,
  require('eslint-config-prettier'),
  {
    languageOptions: {
      sourceType: 'module',
      ecmaVersion: 'latest',
      globals: {
        chrome: 'readonly',
        document: 'readonly',
        URL: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        fetch: 'readonly',
        console: 'readonly',
        window: 'readonly',
        self: 'readonly',
      },
    },
    rules: {
      curly: 'error',
      'padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
        { blankLine: 'any', prev: ['const', 'let', 'var'], next: ['const', 'let', 'var'] },
        { blankLine: 'always', prev: 'if', next: '*' },
        { blankLine: 'always', prev: '*', next: 'return' },
      ],
    },
  },
  {
    files: ['eslint.config.js'],
    languageOptions: {
      sourceType: 'script',
      ecmaVersion: 'latest',
      globals: {
        require: 'readonly',
        module: 'readonly',
      },
    },
  },
];
