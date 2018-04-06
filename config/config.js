const path = require('path');
const rootPath = path.normalize(__dirname + '/..');
const env = process.env.NODE_ENV;
require('dotenv').config();

const config = {
  development: {
    root: rootPath,
    app: {
      name: '10k'
    },
    port: process.env.PORT,
    db: process.env.MONGODB
  },

  test: {
    root: rootPath,
    app: {
      name: '10k'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/10k-test'
  },

  production: {
    root: rootPath,
    app: {
      name: '10k'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/10k-production'
  }
};

module.exports = config.development;
