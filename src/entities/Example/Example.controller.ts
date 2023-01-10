import { Request, Router, Response, NextFunction, response } from 'express';
import { iController } from '$libs/interfaces/controller.interface';
import HttpException from '$libs/exceptions/http.exception';

import validate from './Example.validation';
import ExampleService from './Example.service';
import { validationMiddleware } from '$middleware/validation.middleware';

class ExampleController implements iController {
  public path = '/examples';
  public router = Router();
  private service: ExampleService;

  constructor() {
    this.initializeRoutes();
    this.service = new ExampleService();
  }

  private initializeRoutes(): void {
    this.router
      .route(`${this.path}/`)
      .get(validationMiddleware(validate.findFiltered, 'query'), this.getAll);
    this.router.route(`${this.path}/:id`).get(this.getById);
    this.router
      .route(`${this.path}/`)
      .post(validationMiddleware(validate.create, 'body'), this.create);
    this.router.route(`${this.path}/:id`).delete(this.delete);
  }

  private getAll = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { text, min, max } = req.query;
      let response;
      if (!text && !min && !max) {
        response = await this.service.fetchAll();
      } else {
        let parsedText = null;
        let parsedMin = null;
        let parsedMax = null;
        if (text) parsedText = text.toString();
        if (min) parsedMin = Number(min);
        if (max) parsedMax = Number(max);

        response = await this.service.fetchFiltered(
          parsedText,
          parsedMin,
          parsedMax
        );
      }
      res.status(200).json({
        success: true,
        response,
      });
    } catch (err: any) {
      next(new HttpException(err.status, err.message));
    }
  };

  private getById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { id } = req.params;
      const data = await this.service.fetchById(id);
      res.status(200).json({
        success: true,
        data,
      });
    } catch (err: any) {
      next(new HttpException(err.status, err.message));
    }
  };

  private create = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { text, number } = req.body;
      const data = await this.service.create(number, text);
      res.status(201).json({
        success: true,
        message: 'Entity created successfully',
        data,
      });
    } catch (err: any) {
      next(new HttpException(err.status, err.message));
    }
  };

  private delete = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { id } = req.params;
      await this.service.delete(id);
      res.status(200).json({
        success: true,
        message: `Example ${id} deleted`,
      });
    } catch (err: any) {
      next(new HttpException(err.status, err.message));
    }
  };
}

export default ExampleController;
