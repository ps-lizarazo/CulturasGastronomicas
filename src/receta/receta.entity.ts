import { CulturaGastronomicaEntity } from '../cultura_gastronomica/cultura_gastronomica.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class RecetaEntity {
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
  imageUrl: string;

  @Field()
  @Column()
  preparacion: string;

  @Field()
  @Column()
  preparacionUrl: string;

  @Field(type => CulturaGastronomicaEntity)
  @ManyToOne(
    () => CulturaGastronomicaEntity,
    (culturaGastronomica) => culturaGastronomica.recetas,
  )
  culturaGastronomica: CulturaGastronomicaEntity;
}
