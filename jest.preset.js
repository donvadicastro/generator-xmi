module.exports = {
    testMatch: ['**/+(*.)+(spec|test).+(ts|js)?(x)'],
    testPathIgnorePatterns: ['output', 'dist'],
    moduleFileExtensions: ['ts', 'js', 'mjs', 'html'],
    coverageReporters: ['html'],
    transform: {
        '^.+\\.(ts|js|html)$': 'ts-jest',
    },
    testEnvironment: 'jsdom',
};
