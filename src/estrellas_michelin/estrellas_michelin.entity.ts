import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class EstrellasMichelinEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  fechaConsecucion: Date;

  @Field(type => RestauranteEntity)
  @ManyToOne(
    () => RestauranteEntity,
    (restaurante) => restaurante.estrellasMichelin,
  )
  restaurante: RestauranteEntity;
}
