module.exports = {
  testEnvironment: 'jsdom',
  transformIgnorePatterns: [
    '/node_modules/(?!axios)/'
  ],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
};
