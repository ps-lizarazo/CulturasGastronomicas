import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { CiudadEntity } from 'src/ciudad/ciudad.entity';
import { EstrellasMichelinEntity } from 'src/estrellas_michelin/estrellasMichelin.entity';
import { CulturaGastronomicaEntity } from 'src/cultura_gastronomica/cultura_gastronomica.entity';

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
    (cultura_gastronomica) => cultura_gastronomica.restaurantes,
  )
  cultura_gastronomicas: CulturaGastronomicaEntity[];
}
