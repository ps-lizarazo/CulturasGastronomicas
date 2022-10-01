import { CulturaGastronomicaEntity } from '../cultura_gastronomica/cultura_gastronomica.entity';
import { CiudadEntity } from '../ciudad/ciudad.entity';
import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class PaisEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  nombre: string;

  @Field(type => [CiudadEntity])
  @OneToMany(() => CiudadEntity, (ciudad) => ciudad.pais)
  ciudades: CiudadEntity[];

  @Field(type => [CulturaGastronomicaEntity])
  @ManyToMany(() => CulturaGastronomicaEntity, (cultura) => cultura.paises)
  culturasGastronomicas: CulturaGastronomicaEntity[];
}
