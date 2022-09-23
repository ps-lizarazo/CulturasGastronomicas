import { CulturaGastronomicaEntity } from '../cultura_gastronomica/cultura_gastronomica.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class RecetaEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column()
  descripcion: string;

  @Column()
  imageUrl: string;

  @Column()
  preparacion: string;

  @Column()
  preparacionUrl: string;

  @ManyToOne(
    () => CulturaGastronomicaEntity,
    (culturaGastronomica) => culturaGastronomica.recetas,
  )
  culturaGastronomica: CulturaGastronomicaEntity;
}
