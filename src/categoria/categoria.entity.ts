import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProductoEntity } from '../producto/producto.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class CategoriaEntity {

  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  nombre: string;

  @Field(type => [ProductoEntity])
  @OneToMany(() => ProductoEntity, (producto) => producto.categoria)
  productos: ProductoEntity[];
}
