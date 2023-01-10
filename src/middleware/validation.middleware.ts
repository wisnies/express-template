import { Request, RequestHandler, Response, NextFunction } from 'express';
import { Schema, ValidationErrorItem } from 'joi';

export const validationMiddleware = (
  schema: Schema,
  target: 'body' | 'query'
): RequestHandler => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const validationOptions = {
      abortEarly: false,
      allowUnknown: true,
      stripUnknown: true,
    };

    try {
      if (target === 'body') {
        const value = await schema.validateAsync(req.body, validationOptions);
        req.body = value;
      } else if (target === 'query') {
        const value = await schema.validateAsync(req.query, validationOptions);
        req.query = value;
      } else {
        throw new Error('Invalid validation target');
      }
      next();
    } catch (error: any) {
      const errors: string[] = [];
      error.details.forEach((error: ValidationErrorItem) => {
        errors.push(error.message);
      });

      res.status(400).json({
        success: false,
        errors,
      });
    }
  };
};
