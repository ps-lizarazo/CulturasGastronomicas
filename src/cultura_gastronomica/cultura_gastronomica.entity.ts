import { RecetaEntity } from '../receta/receta.entity';
import { ProductoEntity } from '../producto/producto.entity';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { PaisEntity } from '../pais/pais.entity';
import {
  Column,
  Entity,
  JoinTable,
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

  @OneToMany(() => RecetaEntity, (receta) => receta.culturaGastronomica)
  recetas: RecetaEntity[];

  @ManyToMany(
    () => ProductoEntity,
    (producto) => producto.culturasGastronomicas,
  )
  productos: ProductoEntity[];

  @ManyToMany(
    () => RestauranteEntity,
    (restaurante) => restaurante.culturasGastronomicas,
  )
  restaurantes: RestauranteEntity[];

  @ManyToMany(() => PaisEntity, (pais) => pais.culturasGastronomicas)
  @JoinTable()
  paises: PaisEntity[];
}
