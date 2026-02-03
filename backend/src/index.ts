import 'dotenv/config.js';
import { createApp, startServer } from './app.js';
import { logger } from '@config/logger.js';

async function main(): Promise<void> {
  try {
    const app = createApp();
    await startServer(app);
  } catch (error) {
    logger.error('Error iniciando servidor:', error);
    process.exit(1);
  }
}

main();
