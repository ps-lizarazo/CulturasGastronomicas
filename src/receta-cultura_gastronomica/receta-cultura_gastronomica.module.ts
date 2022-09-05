import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CulturaGastronomicaEntity } from '../cultura_gastronomica/cultura_gastronomica.entity';
import { CulturaGastronomicaService } from '../cultura_gastronomica/cultura_gastronomica.service';

@Module({
    imports: [TypeOrmModule.forFeature([CulturaGastronomicaEntity])],
    providers: [CulturaGastronomicaService],
})
export class RecetaCulturaGastronomicaModule {}
