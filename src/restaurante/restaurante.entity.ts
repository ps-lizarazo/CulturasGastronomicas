import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  ManyToMany,
  OneToMany,
  JoinTable,
} from 'typeorm';
import { CiudadEntity } from '../ciudad/ciudad.entity';
import { EstrellasMichelinEntity } from '../estrellas_michelin/estrellasMichelin.entity';
import { CulturaGastronomicaEntity } from '../cultura_gastronomica/cultura_gastronomica.entity';

@Entity()
export class RestauranteEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @ManyToOne(() => CiudadEntity, (ciudad) => ciudad.restaurantes)
  ciudad: CiudadEntity;

  @OneToMany(
    () => EstrellasMichelinEntity,
    (estrellaMichellin) => estrellaMichellin.restaurante,
  )
  estrellasMichelin: EstrellasMichelinEntity[];

  @ManyToMany(
    () => CulturaGastronomicaEntity,
    (culturaGastronomica) => culturaGastronomica.restaurantes,
  )
  @JoinTable()
  culturasGastronomicas: CulturaGastronomicaEntity[];
}
