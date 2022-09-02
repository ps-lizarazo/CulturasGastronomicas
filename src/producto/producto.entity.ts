import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { CategoriaEntity } from '../categoria/categoria.entity';
import { CulturaGastronomicaEntity } from '../cultura_gastronomica/cultura_gastronomica.entity';

@Entity()
export class ProductoEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column()
  historia: string;

  @ManyToOne(() => CategoriaEntity, categoria => categoria.productos)
  categoria: CategoriaEntity;

  @ManyToMany(() => CulturaGastronomicaEntity, cultura_gastronomica => cultura_gastronomica.productos)
  cultura_gastronomicas: CulturaGastronomicaEntity[];
}
