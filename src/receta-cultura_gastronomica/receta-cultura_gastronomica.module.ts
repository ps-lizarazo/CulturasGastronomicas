import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecetaEntity } from '../receta/receta.entity';
import { CulturaGastronomicaEntity } from '../cultura_gastronomica/cultura_gastronomica.entity';
import { RecetaCulturaGastronomicaController } from './receta-cultura_gastronomica.controller';
import { RecetaCulturaGastronomicaService } from './receta-cultura_gastronomica.service';

@Module({
    imports: [TypeOrmModule.forFeature([CulturaGastronomicaEntity, RecetaEntity])],
    providers: [RecetaCulturaGastronomicaService],
    controllers: [RecetaCulturaGastronomicaController],
})
export class RecetaCulturaGastronomicaModule {}
