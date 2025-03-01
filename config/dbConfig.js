let path = require("path");
let fixture = path.join(__dirname, "../.env");
let dotenv = require('dotenv').config({ path: fixture })
let config = dotenv.parsed
module.exports = {
  JWT_SECRET: process.env.JWT_SECRET ? process.env.JWT_SECRET : config?.JWT_SECRET,
  EXPIRES_IN: process.env.EXPIRES_IN ? process.env.EXPIRES_IN : config?.EXPIRES_IN,
  WHITELIST: process.env.WHITELIST ? process.env.WHITELIST : config?.WHITELIST,
  PORT: process.env.PORT ? process.env.PORT : config?.PORT,
  HOST: process.env.HOST ? process.env.HOST : config?.HOST,
  NODE_ENV: process.env.NODE_ENV ? process.env.NODE_ENV : config?.NODE_ENV,
  API_VERSION: process.env.API_VERSION ? process.env.API_VERSION : config?.API_VERSION,
};

