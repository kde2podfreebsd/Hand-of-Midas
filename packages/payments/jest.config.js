module.exports = {
  testEnvironment: 'node',
  testTimeout: 20000,
  preset: 'ts-jest',
  rootDir: './',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  modulePaths: ['<rootDir>'],
  moduleNameMapper: {
    '^@contracts/(.*)$': '<rootDir>/ruscamp-contracts/$1',
    '^@common/(.*)$': '<rootDir>/src/common/$1',
    '^@infrastructure/(.*)$': '<rootDir>/src/infrastructure/$1',
    '^@controllers/(.*)$': '<rootDir>/src/controllers/$1',
    '^@features/(.*)$': '<rootDir>/src/features/$1',
    '^@queries/(.*)$': '<rootDir>/src/queries/$1',
  },
  testPathIgnorePatterns: ['/node_modules./', '/(coverage|dist|lib|tmp)./'],
};
