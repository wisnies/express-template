import { Request, Response, NextFunction } from 'express';
import HttpException from '$libs/exceptions/http.exception';

export const errorMiddleware = (
  error: HttpException,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const status = error.status || 500;
  const message = error.message || '"message" Ups, something went wrong...';

  res.status(status).json({
    success: false,
    status,
    errors: [message],
  });
};
