// middleware/logger.js

import fs from 'fs';
import path from 'path';

const logFilePath = path.join(path.resolve(), 'server.log');

function writeLog(level, message, stack = '') {
  const time = new Date().toISOString();
  const log = `[${time}] [${level.toUpperCase()}]: ${message}\n${stack ? stack + '\n' : ''}`;

  console.log(log); // Optional: remove in production

  fs.appendFile(logFilePath, log + '\n', err => {
    if (err) console.error('Failed to write to log file:', err);
  });
}

// Export logger with multiple levels
export const logger = {
  info: (msg) => writeLog('info', msg),
  warn: (msg) => writeLog('warn', msg),
  error: (msg, stack) => writeLog('error', msg, stack),
  fatal: (msg, stack) => writeLog('fatal', msg, stack),
};
