import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CreateUsuarioDto } from '../dto/create-usuario.dto';
import { UpdateUsuarioDto } from '../dto/update-usuario.dto';

@Entity({ name: 'usuario' })
export class Usuario {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('varchar', { length: 60 })
  nome!: string;

  @Column('bytea', { nullable: true })
  foto!: Buffer;

  @Column('varchar', { length: 100, unique: true })
  email!: string;

  @Column('varchar', {
    length: 100,
    select: false,
  })
  senha!: string;

  @Column({
    type: 'boolean',
    default: false,
  })
  admin!: boolean;

  constructor(createUsuarioDto: CreateUsuarioDto | UpdateUsuarioDto) {
    Object.assign(this, createUsuarioDto);
  }
}
