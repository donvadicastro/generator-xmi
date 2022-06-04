module.exports = {
    displayName: 'generator',
    roots: [ '<rootDir>' ],
    globals: {
        'ts-jest': {
            tsconfig: '<rootDir>/tsconfig.spec.json',
        },
    },
    transform: {
        '^.+\\.tsx?$': 'ts-jest'
    },
    reporters: ['default', 'summary'],
    moduleFileExtensions: ['ts', 'js', 'html'],
    coverageDirectory: '../coverage/generators'
};
