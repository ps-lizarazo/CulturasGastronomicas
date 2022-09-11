import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { CulturaGastronomicaEntity } from '../cultura_gastronomica/cultura_gastronomica.entity';
import { RestauranteCulturagastronomicaService } from './restaurante-culturagastronomica.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([RestauranteEntity, CulturaGastronomicaEntity]),
  ],
  providers: [RestauranteCulturagastronomicaService],
})
export class RestauranteCulturagastronomicaModule {}
