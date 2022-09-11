import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaisEntity } from '../pais/pais.entity';
import { CulturaGastronomicaEntity } from '../cultura_gastronomica/cultura_gastronomica.entity';
import { PaisCulturagastronomicaService } from './pais-culturagastronomica.service';
import { PaisCulturagastronomicaController } from './pais-culturagastronomica.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PaisEntity, CulturaGastronomicaEntity])],
  providers: [PaisCulturagastronomicaService],
  controllers: [PaisCulturagastronomicaController],
})
export class PaisCulturagastronomicaModule {}
