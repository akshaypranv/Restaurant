const app = require('./app');
const config = require('./config/config');

const server = app.listen(config.PORT, () => {
  console.log(`[Server] Silvertip Cafe backend running in [${config.NODE_ENV}] mode on port ${config.PORT}`);
});

// Handle graceful shutdown
const gracefulShutdown = () => {
  console.log('[Server] Gracefully shutting down...');
  server.close(() => {
    console.log('[Server] Http server closed.');
    process.exit(0);
  });
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
