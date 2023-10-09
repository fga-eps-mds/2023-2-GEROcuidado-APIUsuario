import { HttpResponse } from './http-response';

describe('HttpResponse', () => {
  it('should be defined', () => {
    expect(new HttpResponse({})).toBeDefined();
  });

  it('should create message with success text', () => {
    const response = new HttpResponse({});
    const created = response.onCreated();

    const expected = {
      message: 'MENSAGENS.SALVO-SUCESSO',
      data: {},
    };

    expect(created).toEqual(expected);
  });

  it('should create message with updated text', () => {
    const response = new HttpResponse({});
    const updated = response.onUpdated();

    const expected = {
      message: 'MENSAGENS.ATUALIZADO-SUCESSO',
      data: {},
    };

    expect(updated).toEqual(expected);
  });

  it('should create message with deleted text', () => {
    const response = new HttpResponse({});
    const updated = response.onDeleted();

    const expected = {
      message: 'MENSAGENS.EXCLUIDO-SUCESSO',
      data: {},
    };

    expect(updated).toEqual(expected);
  });
});
