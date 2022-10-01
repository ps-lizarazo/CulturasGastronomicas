import { PaisEntity } from '../pais/pais.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class CiudadEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  nombre: string;

  @Field(type => [RestauranteEntity])
  @OneToMany(() => RestauranteEntity, (restaurantes) => restaurantes.ciudad)
  restaurantes: RestauranteEntity[];

  @Field(type => PaisEntity)
  @ManyToOne(() => PaisEntity, (pais) => pais.ciudades)
  pais: PaisEntity;
}
