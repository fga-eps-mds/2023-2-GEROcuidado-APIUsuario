import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import request from 'supertest';
import { Repository } from 'typeorm';
import { AppModule } from '../src/app.module';
import { AllExceptionsFilter } from '../src/shared/filters/all-exceptions.filter';
import { ModelNotFoundExceptionFilter } from '../src/shared/filters/model-not-found.exception-filter';
import { DataTransformInterceptor } from '../src/shared/interceptors/data-transform.interceptor';
import { Usuario } from '../src/usuario/entities/usuario.entity';

describe('E2E - Usuario', () => {
  let app: INestApplication;
  let repository: Repository<Usuario>;

  const user: Partial<Usuario> = {
    id: undefined,
    nome: 'Henrique',
    email: 'hacmelo@gmail.com',
    senha: '123',
    admin: false,
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );
    app.useGlobalInterceptors(new DataTransformInterceptor());
    app.useGlobalFilters(
      new AllExceptionsFilter(),
      new ModelNotFoundExceptionFilter(),
    );

    await app.startAllMicroservices();
    await app.init();

    repository = app.get<Repository<Usuario>>(getRepositoryToken(Usuario));
  });

  describe('POST - /api/usuario', () => {
    it('should successfully add a new "usuario"', async () => {
      const res = await request(app.getHttpServer())
        .post('')
        .set('Content-Type', 'application/json')
        .send(user);

      expect(res.statusCode).toEqual(201);
      expect(res.body.message).toEqual('Salvo com sucesso!');
      expect(res.body.data).toMatchObject({ ...user, id: res.body.data.id });

      Object.assign(user, res.body.data);
      delete user.senha;
    });

    it('should not add a new "usuario" when validations are incorrect', async () => {
      const res = await request(app.getHttpServer())
        .post('')
        .set('Content-Type', 'application/json')
        .send({});

      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toBeInstanceOf(Array);
      expect(res.body.message).toEqual([
        'nome must be longer than or equal to 5 characters',
        'nome must be shorter than or equal to 60 characters',
        'nome should not be empty',
        'nome must be a string',
        'email must be shorter than or equal to 100 characters',
        'email must be an email',
        'email should not be empty',
        'email must be a string',
        'senha must be shorter than or equal to 100 characters',
        'senha should not be empty',
        'senha must be a string',
      ]);
      expect(res.body.data).toBeNull();
    });
  });

  describe('GET - /api/usuario/:id', () => {
    it('should successfully get "usuario" by id', async () => {
      const res = await request(app.getHttpServer())
        .get(`/${user.id}`)
        .set('Content-Type', 'application/json')
        .send();

      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toBeNull();
      expect(res.body.data).toMatchObject(user);
    });

    it('should return status 400 when id is invalid', async () => {
      const wrongId = 'NaN';
      const res = await request(app.getHttpServer())
        .get(`/${wrongId}`)
        .set('Content-Type', 'application/json')
        .send();

      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toBeInstanceOf(Array);
      expect(res.body.message).toEqual(['ID inválido']);
      expect(res.body.data).toBeNull();
    });

    it('should return status 404 when no "usuario" is found', async () => {
      const res = await request(app.getHttpServer())
        .get('/9999')
        .set('Content-Type', 'application/json')
        .send();

      expect(res.statusCode).toEqual(404);
      expect(res.body.message).toEqual('Registro(s) não encontrado(s)!');
      expect(res.body.data).toBeNull();
    });
  });

  describe('GET - /api/usuario/', () => {
    it('should successfully findAll "usuario"', async () => {
      const filter = JSON.stringify({
        nome: user.nome,
        id: user.id,
        email: user.email,
      });

      const res = await request(app.getHttpServer())
        .get('?filter=' + JSON.stringify(filter))
        .set('Content-Type', 'application/json')
        .send();

      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toBeNull();
      expect(res.body.data).toEqual([user]);
    });
  });

  describe('PATCH - /api/usuario/:id', () => {
    it('should successfully update "usuario" by id', async () => {
      const update = { nome: 'Jose da Silva' };

      const res = await request(app.getHttpServer())
        .patch(`/${user.id}`)
        .set('Content-Type', 'application/json')
        .send(update);

      user.nome = update.nome;

      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toBe('Atualizado com sucesso!');
      expect(res.body.data).toMatchObject(user);
    });
  });

  describe('DELETE - /api/usuario/:id', () => {
    it('should successfully delete "usuario" by id', async () => {
      const res = await request(app.getHttpServer())
        .delete(`/${user.id}`)
        .set('Content-Type', 'application/json')
        .send();

      delete user.id;

      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toBe('Excluído com sucesso!');
      expect(res.body.data).toMatchObject(user);
    });
  });

  afterAll(async () => {
    await repository.query('TRUNCATE usuario CASCADE');
    await repository.delete({});
    await app.close();
  });
});
