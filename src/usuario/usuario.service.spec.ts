import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderParams, Ordering } from '../shared/decorators/ordenate.decorator';
import {
  Pagination,
  PaginationParams,
} from '../shared/decorators/paginate.decorator';
import { Usuario } from './entities/usuario.entity';
import { UsuarioService } from './usuario.service';

describe('UsuarioService', () => {
  let service: UsuarioService;
  let repository: Repository<Usuario>;

  const mockRepository = {
    save: jest.fn(),
    findOneOrFail: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      where: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      offset: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn(),
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsuarioService,
        {
          provide: getRepositoryToken(Usuario),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsuarioService>(UsuarioService);
    repository = module.get<Repository<Usuario>>(getRepositoryToken(Usuario));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create Usuario', async () => {
    const user = { nome: 'Henrique' } as any;
    jest.spyOn(repository, 'save').mockReturnValue({ id: 1 } as any);

    const created = await service.create(user);
    expect(created.id).toEqual(1);
  });

  it('should find Usuario', async () => {
    jest.spyOn(repository, 'findOneOrFail').mockReturnValue({ id: 1 } as any);

    const found = await service.findOne(1);
    expect(found.id).toEqual(1);
  });

  it('should remove Usuario', async () => {
    jest.spyOn(repository, 'findOneOrFail').mockReturnValue({ id: 1 } as any);
    jest.spyOn(repository, 'remove').mockReturnValue({ id: 1 } as any);

    const removed = await service.remove(1);
    expect(removed.id).toEqual(1);
  });

  it('should update Usuario', async () => {
    jest.spyOn(repository, 'findOneOrFail').mockReturnValue({ id: 1 } as any);
    jest
      .spyOn(repository, 'save')
      .mockReturnValue({ id: 1, nome: 'Henrique' } as any);

    const found = await service.update(1, { nome: 'Henrique' });
    expect(found).toEqual({ id: 1, nome: 'Henrique' });
  });

  describe('findAll', () => {
    const usuario = {
      id: 1,
      nome: 'Henrique',
      email: 'email@email.com',
    };

    const order: OrderParams = {
      column: 'id',
      dir: 'ASC',
    };
    const ordering: Ordering = new Ordering(JSON.stringify(order));

    const paginate: PaginationParams = {
      limit: 10,
      offset: 0,
    };
    const pagination: Pagination = new Pagination(paginate);

    it('should findAll Usuario', async () => {
      jest.spyOn(repository, 'createQueryBuilder').mockReturnValue({
        where: () => ({
          limit: () => ({
            offset: () => ({
              orderBy: () => ({
                getManyAndCount: jest
                  .fn()
                  .mockResolvedValueOnce([[usuario], 1]),
              }),
            }),
          }),
        }),
      } as any);

      const { data, count } = await service.findAll({}, ordering, pagination);
      expect(count).toEqual(1);
      expect((data as Usuario[])[0]).toEqual(usuario);
    });
  });
});
