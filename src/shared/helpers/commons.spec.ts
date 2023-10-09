import { createHash, isJsonObject } from './helper';

describe('Helper', () => {
  it('deve criar um hash com tamanho default', async () => {
    const hash = await createHash();
    expect(hash).toBeDefined();
    expect(hash).toHaveLength(6);
  });

  it('should be isJsonObject to be true', () => {
    const isObject = isJsonObject(`{ "id": 1 }`);
    expect(isObject).toBeTruthy();
  });

  it('should be isJsonObject to be false', () => {
    const isObject = isJsonObject(`test`);
    expect(isObject).toBeFalsy();
  });

  it('should be isJsonObject to be false in not parse', () => {
    const isObject = isJsonObject(`{ id: 1 }`);
    expect(isObject).toBeFalsy();
  });
});
