import { RecetaEntity } from '../receta/receta.entity';
import { ProductoEntity } from '../producto/producto.entity';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { PaisEntity } from '../pais/pais.entity';
import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { type } from 'os';

@ObjectType()
@Entity()
export class CulturaGastronomicaEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  nombre: string;

  @Field()
  @Column()
  descripcion: string;

  @Field(type => [RecetaEntity])
  @OneToMany(() => RecetaEntity, (receta) => receta.culturaGastronomica)
  recetas: RecetaEntity[];

  @Field(type => [ProductoEntity])
  @ManyToMany(
    () => ProductoEntity,
    (producto) => producto.culturasGastronomicas,
  )
  productos: ProductoEntity[];

  @Field(type => [RestauranteEntity])
  @ManyToMany(
    () => RestauranteEntity,
    (restaurante) => restaurante.culturasGastronomicas,
  )
  restaurantes: RestauranteEntity[];

  @Field(type => [PaisEntity])
  @ManyToMany(() => PaisEntity, (pais) => pais.culturasGastronomicas)
  @JoinTable()
  paises: PaisEntity[];
}
