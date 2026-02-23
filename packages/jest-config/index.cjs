function createJestConfig({ rootDir }) {
  return {
    clearMocks: true,
    coverageProvider: 'v8',
    testEnvironment: 'node',
    rootDir,
    testMatch: [
      '**/__tests__/**/*.test.[jt]s?(x)',
      '**/__tests__/**/*.spec.[jt]s?(x)',
    ],
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    moduleNameMapper: {
      '^@openhome-os/core/(.*)$': '<rootDir>/src/$1',
      '^@/(.*)$': '<rootDir>/src/$1',
    },
    transform: {
      '^.+\\.(t|j)sx?$': [
        '@swc/jest',
        {
          jsc: { parser: { syntax: 'typescript', tsx: true } },
          module: { type: 'commonjs' },
        },
      ],
    },
    transformIgnorePatterns: [],
  };
}

module.exports = { createJestConfig };
