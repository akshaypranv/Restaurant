// Vercel Serverless Function entry point
// Wraps the Express app for Vercel's serverless runtime
const app = require('../server/app');

module.exports = app;
