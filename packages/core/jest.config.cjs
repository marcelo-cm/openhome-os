const path = require('path');
const { createJestConfig } = require('@openhome-os/jest-config');

module.exports = createJestConfig({
  rootDir: path.resolve(__dirname),
});
