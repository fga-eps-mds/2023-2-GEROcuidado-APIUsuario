import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { HttpResponse } from '../shared/classes/http-response';
import { Response } from '../shared/interceptors/data-transform.interceptor';
import { IdValidator } from '../shared/validators/id.validator';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { Usuario } from './entities/usuario.entity';
import { UsuarioService } from './usuario.service';

@Controller()
export class UsuarioController {
  constructor(private readonly _service: UsuarioService) {}

  @Post()
  async create(@Body() body: CreateUsuarioDto): Promise<Response<Usuario>> {
    const created = await this._service.create(body);
    return new HttpResponse<Usuario>(created).onCreated();
  }

  @Get(':id')
  async findOne(@Param() param: IdValidator): Promise<Usuario> {
    return this._service.findOne(param.id);
  }
}
