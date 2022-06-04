const rootConfig = require('../jest.config');

module.exports = {
    ...rootConfig,

    globalSetup: '<rootDir>/tests/globalSetup.ts'
};
