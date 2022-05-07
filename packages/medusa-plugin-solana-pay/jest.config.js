module.exports = {
  transform: {
    "^.+\\.[jt]s?$": `../../jest-transformer.js`,
  },
  testEnvironment: `node`,
  moduleFileExtensions: [`js`, `jsx`, `ts`, `tsx`, `json`],
}
