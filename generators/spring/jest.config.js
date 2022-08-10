const rootConfig = require('../jest.base');

module.exports = {
    ...rootConfig,

    globalSetup: process.env.LOCAL ? '<rootDir>/tests/globalSetupLocal.ts' : '<rootDir>/tests/globalSetup.ts'
};
