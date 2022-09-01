import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { RestauranteEntity } from '../restaurante/restaurante.entity';

@Entity()
export class EstrellasMichelinEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fechaConsecucion: Date;

  @ManyToOne(
    () => RestauranteEntity,
    (restaurante) => restaurante.estrellasMichelin,
  )
  restaurante: RestauranteEntity;
}
