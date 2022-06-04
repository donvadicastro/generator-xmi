const rootConfig = require('../jest.config');

module.exports = {
    ...rootConfig,

    testTimeout: 30_000,
    globalSetup: '<rootDir>/tests/globalSetup.ts'
};
