import { Response } from '../interceptors/data-transform.interceptor';

export class HttpResponse<T> implements Response<T> {
  message = '';
  data!: T | null | undefined;

  constructor(data: T | null | undefined, message = '') {
    this.data = data;
    this.message = message;
  }

  onSuccess(message: string): Response<T> {
    this.message = message;
    return this;
  }

  onCreated(): Response<T> {
    this.message = 'MENSAGENS.SALVO-SUCESSO';
    return this;
  }

  onUpdated(): Response<T> {
    this.message = 'MENSAGENS.ATUALIZADO-SUCESSO';
    return this;
  }

  onDeleted(): Response<T> {
    this.message = 'MENSAGENS.EXCLUIDO-SUCESSO';
    return this;
  }
}
