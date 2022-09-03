import { PaisEntity } from '../pais/pais.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { RestauranteEntity } from '../restaurante/restaurante.entity';

@Entity()
export class CiudadEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @OneToMany(() => RestauranteEntity, (restaurantes) => restaurantes.ciudad)
  restaurantes: RestauranteEntity[];

  @ManyToOne(() => PaisEntity, (pais) => pais.ciudades)
  pais: PaisEntity;
}
