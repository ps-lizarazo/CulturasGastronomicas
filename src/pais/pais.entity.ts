import { CulturaGastronomicaEntity } from '../cultura_gastronomica/cultura_gastronomica.entity';
import { CiudadEntity } from '../ciudad/ciudad.entity';
import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class PaisEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @OneToMany(() => CiudadEntity, (ciudad) => ciudad.pais)
  ciudades: CiudadEntity[];

  @ManyToMany(() => CulturaGastronomicaEntity, (cultura) => cultura.paises)
  culturasGastronomicas: CulturaGastronomicaEntity[];
}
