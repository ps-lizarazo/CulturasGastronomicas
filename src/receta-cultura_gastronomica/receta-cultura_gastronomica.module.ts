import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CulturaGastronomicaEntity } from '../cultura_gastronomica/cultura_gastronomica.entity';
import { CulturaGastronomicaService } from '../cultura_gastronomica/cultura_gastronomica.service';
import { RecetaCulturaGastronomicaController } from './receta-cultura_gastronomica.controller';

@Module({
    imports: [TypeOrmModule.forFeature([CulturaGastronomicaEntity])],
    providers: [CulturaGastronomicaService],
    controllers: [RecetaCulturaGastronomicaController],
})
export class RecetaCulturaGastronomicaModule {}
