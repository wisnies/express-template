const fs = require('fs');
const path = require('path');

async function createEntity() {
  let found;
  const entityName = process.argv[2];
  if (!entityName) {
    console.error('Please provide valid entity name');
    console.info(' * use npm run / yarn entity:create --name');
    console.info(' * --name can contain only letters *');
    console.info(' * --name must start  with an uppercase letter *');
    console.info(' * --name must end with a lowercase letter *');
    return;
  }
  const regexp = RegExp('^[A-Z]+[a-zA-Z]+[a-z]$');
  if (!regexp.test(entityName)) {
    console.error(`Entity "${entityName}" is not avalid entity name`);
    console.info(' * --name can contain only letters *');
    console.info(' * --name must start  with an uppercase letter *');
    console.info(' * --name must end with a lowercase letter *');
    return;
  }
  const entityDir = path.join(__dirname, '..', 'src', 'entities', entityName);
  await fs.exists(entityDir, async (exists: boolean) => {
    exists ? (found = true) : (found = false);
    if (!found) {
      await createDir(entityName, entityDir);
      await createFiles(entityName, entityDir);
    } else {
      console.log(`Entity "${entityName}" alredy exists`);
      return;
    }
  });
}

async function createDir(entity: string, dir: string) {
  await fs.mkdir(dir, (err: any) => {
    if (err) {
      return console.error('Entity could not be created');
    }
    console.log(`Entity "${entity}" created at ${dir}`);
  });
}

async function createFiles(entity: string, dir: string) {
  await fs.writeFile(
    `${dir}/${entity}.controller.ts`,
    controllerContents(entity),
    (err: any) => {
      if (err) {
        return console.error(err);
      }
    }
  );
  await fs.writeFile(
    `${dir}/${entity}.model.ts`,
    modelContents(entity),
    (err: any) => {
      if (err) {
        return console.error(err);
      }
    }
  );
  await fs.writeFile(
    `${dir}/${entity}.service.ts`,
    serviceContents(entity),
    (err: any) => {
      if (err) {
        return console.error(err);
      }
    }
  );
  await fs.writeFile(
    `${dir}/${entity}.validation.ts`,
    validationContents(),
    (err: any) => {
      if (err) {
        return console.error(err);
      }
    }
  );
}

const controllerContents = (name: string) => {
  return `
  import { Request, Router, Response, NextFunction, response } from 'express';
  import { iController } from '$utils/interfaces/controller.interface';
  import HttpException from '$utils/exceptions/http.exception';
  import { validationMiddleware } from '$middleware/validation.middleware';
  
  import validate from './${name}.validation';
  import ${name}Service from './${name}.service';

  class ${name}Controller implements iController {
    public path = '/${name.toLowerCase()}';
    public router = Router();
    private service: ${name}Service;

    constructor() {
      this.initializeRoutes();
      this.service = new ${name}Service();
    }

    private initializeRoutes(): void {}

  }

  export default ${name}Controller;
  `;
};

const modelContents = (name: string) => {
  return `
  export interface i${name} {
  }
  `;
};
const serviceContents = (name: string) => {
  return `
  import { i${name} } from './${name}.model';
  import HttpException from '$utils/exceptions/http.exception';

  class ${name}Service {

  }

  export default ${name}Service;
  `;
};
const validationContents = () => {
  return `
  import Joi from 'joi';
  export default {};
  `;
};

createEntity();
