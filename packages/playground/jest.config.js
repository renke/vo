module.exports = {
  testEnvironment: "node",

  // extensionsToTreatAsEsm: [".ts"],
  testMatch: ["<rootDir>/src/**/*.test.ts"],

  preset: "ts-jest/presets/default-esm",
  // preset: "ts-jest/presets/default",

  globals: {
    "ts-jest": {
      useESM: false,
      // useESM: true
      // isolatedModules: true,
    },
  },

  // moduleNameMapper: {
  //   "(.*)\\.js$": "$1",
  // },
};
