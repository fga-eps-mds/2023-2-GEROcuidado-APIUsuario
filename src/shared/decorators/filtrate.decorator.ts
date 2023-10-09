import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { isJsonString } from '../helpers/commons';

interface FilterParams<T> {
  filter: T;
}

export class Filtering<T> implements FilterParams<T> {
  filter: T;

  constructor(query: string) {
    this.filter = this.buildFilterParams(query);
  }

  private buildFilterParams(filter: string): T {
    if (isJsonString(filter)) {
      return JSON.parse(filter) as T;
    }
    return {} as T;
  }
}

export const Filtrate = createParamDecorator(
  (data: unknown, context: ExecutionContext): Filtering<unknown> => {
    const http = context.switchToHttp() as { getRequest: () => unknown };
    const req = http.getRequest() as { query: { filter: string } };
    return new Filtering(req.query.filter);
  },
);
