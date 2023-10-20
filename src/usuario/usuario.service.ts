import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import bcrypt from 'bcrypt';
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
    private readonly _configService: ConfigService,
  ) {}

  async create(body: CreateUsuarioDto): Promise<Usuario> {
    const usuario = new Usuario(body);
    await this.verificaEmailNoBanco(usuario.email);
    usuario.senha = await this.criptografaSenha(usuario.senha);
    return this._repository.save(usuario);
  }

  async criptografaSenha(senha: string): Promise<string> {
    const saltRounds = this._configService.get('SALTROUND');
    return bcrypt.hash(senha, Number(saltRounds));
  }

  async verificaEmailNoBanco(email: string) {
    const emailCadastrado = await this._repository.findOne({
      where: { email: email },
    });
    if (emailCadastrado) {
      throw new BadRequestException('Este email já está cadastrado!');
    }
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
