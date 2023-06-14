module.exports = {
  env: {
    amd: true,
    node: true,
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'eslint-config-prettier',
  ],
  overrides: [],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'eslint-plugin-prettier'],
  rules: {
    'prettier/prettier': 2,
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['warn'],
    '@typescript-eslint/no-var-requires': 0,
    semi: ['error', 'never'],
    quotes: ['error', 'single'],
    indent: ['error', 2, { SwitchCase: 1 }],
  },
}
