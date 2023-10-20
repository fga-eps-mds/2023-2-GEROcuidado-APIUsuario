import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { HttpResponse } from '../shared/classes/http-response';
import { Filtering, Filtrate } from '../shared/decorators/filtrate.decorator';
import { Ordenate, Ordering } from '../shared/decorators/ordenate.decorator';
import { Paginate, Pagination } from '../shared/decorators/paginate.decorator';
import { Response } from '../shared/interceptors/data-transform.interceptor';
import { ResponsePaginate } from '../shared/interfaces/response-paginate.interface';
import { IdValidator } from '../shared/validators/id.validator';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Usuario } from './entities/usuario.entity';
import { IUsuarioFilter } from './interfaces/usuario-filter.interface';
import { UsuarioService } from './usuario.service';

@Controller()
export class UsuarioController {
  constructor(private readonly _service: UsuarioService) {}

  @Post()
  async create(@Body() body: CreateUsuarioDto): Promise<Response<Usuario>> {
    const created = await this._service.create(body);
    return new HttpResponse<Usuario>(created).onCreated();
  }

  @Get()
  async findAll(
    @Filtrate() queryParam: Filtering<IUsuarioFilter>,
    @Paginate() pagination: Pagination,
    @Ordenate() ordering: Ordering,
  ): Promise<ResponsePaginate<Usuario>> {
    return this._service.findAll(queryParam.filter, ordering, pagination);
  }

  @Get(':id')
  async findOne(@Param() param: IdValidator): Promise<Usuario> {
    return this._service.findOne(param.id);
  }

  @Patch(':id')
  async update(
    @Param() param: IdValidator,
    @Body() body: UpdateUsuarioDto,
  ): Promise<Response<Usuario>> {
    const updated = await this._service.update(param.id, body);
    return new HttpResponse<Usuario>(updated).onUpdated();
  }

  @Delete(':id')
  async remove(@Param() param: IdValidator): Promise<Response<unknown>> {
    const deleted = await this._service.remove(param.id);
    return new HttpResponse(deleted).onDeleted();
  }
}
