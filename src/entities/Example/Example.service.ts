import { iExample } from './Example.model';

import { examples } from '$utils/data/example';
import HttpException from '$libs/exceptions/http.exception';

class ExampleService {
  private examples = examples;

  public async fetchAll(): Promise<iExample[]> {
    try {
      return this.examples;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  public async fetchById(id: string): Promise<iExample> {
    try {
      const data = this.examples.find((example) => id === example.id);

      if (!data) throw new HttpException(404, 'Colud not find this example');

      return data;
    } catch (err: any) {
      throw new HttpException(err.status || 500, err.message);
    }
  }

  public async fetchFiltered(
    text: string | null,
    min: number | null,
    max: number | null
  ): Promise<iExample[]> {
    try {
      let data: iExample[] = [];
      if (text) {
        const regexp = RegExp(`.*${text}.*`, 'i');
        if (!min && !max) {
          data = this.examples.filter((example) => regexp.test(example.text));
        }
        if (min && !max) {
          data = this.examples.filter(
            (example) => regexp.test(example.text) && min <= example.number
          );
        }
        if (!min && max) {
          data = this.examples.filter(
            (example) => regexp.test(example.text) && max >= example.number
          );
        }
        if (min && max) {
          data = this.examples.filter(
            (example) =>
              regexp.test(example.text) &&
              min <= example.number &&
              max >= example.number
          );
        }
      } else {
        if (min && !max) {
          data = this.examples.filter((example) => min <= example.number);
        }
        if (!min && max) {
          data = this.examples.filter((example) => max >= example.number);
        }
        if (min && max) {
          data = this.examples.filter(
            (example) => min <= example.number && max >= example.number
          );
        }
      }

      if (data.length === 0)
        throw new HttpException(
          404,
          'Colud not find examples with selected search parameters'
        );
      return data;
    } catch (err: any) {
      throw new HttpException(err.status || 500, err.message);
    }
  }

  public async create(number: number, text: string): Promise<iExample> {
    try {
      const newExample: iExample = {
        id: (this.examples.length + 1).toString(),
        number,
        text,
      };
      this.examples.push(newExample);
      return newExample;
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  public async delete(id: string): Promise<void> {
    try {
      const index = this.examples.findIndex((example) => id === example.id);
      if (index >= 0) {
        this.examples.splice(index, 1);
      } else {
        throw new HttpException(404, 'Colud not find this example');
      }
    } catch (err: any) {
      throw new HttpException(err.status || 500, err.message);
    }
  }
}

export default ExampleService;
