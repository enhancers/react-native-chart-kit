module.exports = {
  preset: 'react-native',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  setupFiles: ['./jest-setup/setup.tsx'],
  testPathIgnorePatterns: ['node_modules', 'dist'],
};
