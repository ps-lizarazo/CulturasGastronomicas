import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaisEntity } from 'src/pais/pais.entity';
import { CulturaGastronomicaEntity } from '../cultura_gastronomica/cultura_gastronomica.entity';
import { PaisCulturagastronomicaService } from './pais-culturagastronomica.service';

@Module({
  imports: [TypeOrmModule.forFeature([PaisEntity, CulturaGastronomicaEntity])],
  providers: [PaisCulturagastronomicaService],
})
export class PaisCulturagastronomicaModule {}
