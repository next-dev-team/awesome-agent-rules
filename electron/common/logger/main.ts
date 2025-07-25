import { app } from 'electron';
import type { LogMessage, PathVariables } from 'electron-log';
import logger from 'electron-log/main';
import path from 'node:path';
import { archiveLogFn } from './common';

let isInitialized = false;

const initMainLogger = () => {
  if (!isInitialized) {
    logger.initialize({ preload: true });

    logger.errorHandler.startCatching();
    logger.eventLogger.startLogging();
    logger.scope.defaultLabel = 'default';
    logger.scope.labelPadding = false;
    logger.transports.console.level = false;
    logger.transports.file.maxSize = 1024 * 1024 * 2;
    logger.transports.file.archiveLogFn = archiveLogFn;
    
    // Set version when app is ready
    if (app.isReady()) {
      logger.variables.version = app.getVersion();
    } else {
      app.on('ready', () => {
        logger.variables.version = app.getVersion();
        console.info(
          'app ready,platform:',
          `${process.platform}@${process.getSystemVersion()}`,
          'process.versions:',
          process.versions,
        );
      });
    }
    
    logger.transports.file.resolvePathFn = (
      variables: PathVariables,
      message?: LogMessage,
    ) => {
      const processType = message?.variables?.processType ?? 'main';
      const fileName = `${processType}.log`;
      return path.join(variables.libraryDefaultDir, fileName);
    };
    logger.transports.file.format =
      '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [v{version}] [{processType}] [{level}]{scope} {text}';

    isInitialized = true;
    Object.assign(console, logger.functions);
    console.log('initMainLogger success');
  } else {
    console.log('initMainLogger has initialized');
  }
  return logger;
};

const getMainLogger = () => {
  if (!isInitialized) {
    throw Error('getMainLogger err: no init');
  }
  return logger;
};

export { initMainLogger, getMainLogger };
