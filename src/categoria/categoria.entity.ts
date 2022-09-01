import { Column, Entity,OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProductoEntity } from '../producto/producto.entity';

@Entity()
export class CategoriaEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @OneToMany(() => ProductoEntity, producto => producto.categoria)
   productos: ProductoEntity[];

}
