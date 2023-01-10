import { Router } from 'express';

export interface iController {
  path: string;
  router: Router;
}
