import { RecetaEntity } from 'src/receta/receta.entity';
import { ProductoEntity } from '../producto/producto.entity';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class CulturaGastronomicaEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column()
  descripcion: string;

  @OneToMany(() => RecetaEntity, (receta) => receta.cultura_gastronomica)
  recetas: RecetaEntity[];

  @ManyToMany(
    () => ProductoEntity,
    (producto) => producto.cultura_gastronomicas,
  )
  productos: ProductoEntity[];

  @ManyToMany(
    () => RestauranteEntity,
    (restaurante) => restaurante.cultura_gastronomicas,
  )
  restaurantes: RestauranteEntity[];
}
