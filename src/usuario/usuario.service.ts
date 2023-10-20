import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Usuario } from './entities/usuario.entity';

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
}
