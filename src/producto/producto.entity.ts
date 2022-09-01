import { Column, Entity,OneToMany,ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CategoriaEntity } from 'src/categoria/categoria.entity';


export class ProductoEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column()
  historia: string;

  @ManyToOne(() => CategoriaEntity, categoria => categoria.productos)
  categoria: CategoriaEntity;
}
