import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  heathCheck() {
    return {
      message: 'GEROcuidadoApiUsuario health check Ok!',
      data: {},
    };
  }
}
