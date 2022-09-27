import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { CategoriaEntity } from '../categoria/categoria.entity';
import { CulturaGastronomicaEntity } from '../cultura_gastronomica/cultura_gastronomica.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class ProductoEntity {

  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  nombre: string;

  @Field()
  @Column()
  descripcion: string;

  @Field()
  @Column()
  historia: string;

  @Field(type => CategoriaEntity)
  @ManyToOne(() => CategoriaEntity, (categoria) => categoria.productos)
  categoria: CategoriaEntity;

  @ManyToMany(
    () => CulturaGastronomicaEntity,
    (culturaGastronomica) => culturaGastronomica.productos,
  )
  @JoinTable()
  culturasGastronomicas: CulturaGastronomicaEntity[];
}
