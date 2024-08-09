module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:@typescript-eslint/stylistic'],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error'],
    '@typescript-eslint/explicit-function-return-type': 'warn',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-confusing-void-expression': 'error',
    '@typescript-eslint/no-mixed-enums': 'error',
    '@typescript-eslint/prefer-function-type': 'off',
    '@typescript-eslint/prefer-literal-enum-member': 'error',
    'linebreak-style': 'off',
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'variable',
        format: ['UPPER_CASE', 'camelCase'],
      },

      {
        selector: ['function', 'classMethod', 'classProperty', 'parameter'],
        format: ['camelCase'],
      },
      {
        selector: ['class', 'interface'],
        format: ['PascalCase'],
      },
    ],
  },
};
