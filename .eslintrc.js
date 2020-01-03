//@ts-nocheck

module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'eslint-config-react-app',
    '@react-native-community',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'import', 'jsx-a11y'],
};
