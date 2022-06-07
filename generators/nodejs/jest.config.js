const rootConfig = require('../jest.base');

module.exports = {
    ...rootConfig,

    globalSetup: '<rootDir>/tests/globalSetup.ts'
};
