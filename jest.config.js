module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testRegex: '.spec.ts$',
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },
};
