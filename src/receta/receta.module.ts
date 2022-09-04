import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CulturaGastronomicaEntity } from '../cultura_gastronomica/cultura_gastronomica.entity';
import { RecetaEntity } from './receta.entity';
import { RecetaService } from './receta.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([RecetaEntity, CulturaGastronomicaEntity]),
  ],
  providers: [RecetaService],
})
export class RecetaModule {}
