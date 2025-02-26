// backend/handler.js
const serverless = require('serverless-http');
const app = require('./index');

module.exports.app = serverless(app);