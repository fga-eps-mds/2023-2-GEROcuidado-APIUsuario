import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ordering } from '../shared/decorators/ordenate.decorator';
import { Pagination } from '../shared/decorators/paginate.decorator';
import {
  getWhereClauseNumber,
  getWhereClauseString,
} from '../shared/helpers/sql-query-helper';
import { ResponsePaginate } from '../shared/interfaces/response-paginate.interface';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Usuario } from './entities/usuario.entity';
import { IUsuarioFilter } from './interfaces/usuario-filter.interface';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private readonly _repository: Repository<Usuario>,
  ) {}

  async create(body: CreateUsuarioDto): Promise<Usuario> {
    const usuario = new Usuario(body);

    // TODO verificar email e criptografar senha
    return this._repository.save(usuario);
  }

  async findOne(id: number) {
    return this._repository.findOneOrFail({ where: { id } });
  }

  async update(id: number, body: UpdateUsuarioDto): Promise<Usuario> {
    const found = await this.findOne(id);
    const merged = Object.assign(found, body);
    // TODO caso a senha seja editada, também criptografar
    return this._repository.save(merged);
  }

  async remove(id: number) {
    const found = await this.findOne(id);
    return this._repository.remove(found);
  }

  async findAll(
    filter: IUsuarioFilter,
    ordering: Ordering,
    paging: Pagination,
  ): Promise<ResponsePaginate<Usuario>> {
    const limit = paging.limit;
    const offset = paging.offset;
    const sort = ordering.column;
    const order = ordering.dir.toUpperCase() as 'ASC' | 'DESC';
    const where = this.buildWhereClause(filter);

    const [result, total] = await this._repository
      .createQueryBuilder('usuario')
      .where(`${where}`)
      .limit(limit)
      .offset(offset)
      .orderBy(sort, order)
      .getManyAndCount();

    return {
      data: result,
      count: +total,
      pageSize: +total,
    };
  }

  private buildWhereClause(filter: IUsuarioFilter): string {
    let whereClause = '1 = 1 ';

    whereClause += getWhereClauseString(filter.nome, 'nome');
    whereClause += getWhereClauseString(filter.email, 'email');
    whereClause += getWhereClauseNumber(filter.id, 'id');

    return whereClause;
  }
}
