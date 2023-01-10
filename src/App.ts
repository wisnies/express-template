import express, { Application } from 'express';
import compression from 'compression';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { iController } from '$libs/interfaces/controller.interface';
import { errorMiddleware } from '$middleware/error.middleware';

class App {
  public express: Application;
  public port: number;

  constructor(controllers: iController[], port: number) {
    this.express = express();
    this.port = port;

    this.initializeDatabaseConnection();
    this.initializeMiddleware();
    this.initializeControllers(controllers);
    this.initializeErrorHandling();
  }

  private initializeMiddleware(): void {
    this.express.use(compression());
    this.express.use(cors());
    this.express.use(helmet());
    this.express.use(morgan('dev'));
    this.express.use(express.json());
    this.express.use(
      express.urlencoded({
        limit: '1mb',
        extended: false,
      })
    );
  }

  private initializeControllers(controllers: iController[]): void {
    controllers.forEach((controller) => {
      this.express.use('/api', controller.router);
    });
  }

  private async initializeDatabaseConnection(): Promise<void> {}

  private initializeErrorHandling(): void {
    this.express.use(errorMiddleware);
  }

  public listen() {
    return this.express.listen(this.port, () => {
      console.info(`App listening at http://localhost:${this.port}/api`);
    });
  }
}

export default App;
