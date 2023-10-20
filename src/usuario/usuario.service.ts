import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
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
}
