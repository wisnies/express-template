import 'dotenv/config';
import 'module-alias/register';
import { validateEnv } from '$utils/functions/validateEnv';

import App from './App';

validateEnv();

const app = new App([], Number(process.env.PORT));

const server = app.listen();

process.on('unhandledRejection', (err): void => {
  console.error(`Server: ${err}`);
  server.close(() => process.exit(1));
});
