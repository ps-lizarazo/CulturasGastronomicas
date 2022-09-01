import { CulturaGastronomicaEntity } from 'src/cultura_gastronomica/cultura_gastronomica.entity';
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
    image_url: string;

    @Column()
    preparacion: string;

    @Column()
    preparacion_url: string;

    @ManyToOne(() => CulturaGastronomicaEntity, cultura_gastronomica => cultura_gastronomica.recetas)
    cultura_gastronomica: CulturaGastronomicaEntity;
}
