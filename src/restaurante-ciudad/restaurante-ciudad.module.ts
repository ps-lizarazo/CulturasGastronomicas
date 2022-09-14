import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { CiudadEntity } from '../ciudad/ciudad.entity';
import { RestauranteCiudadService } from './restaurante-ciudad.service';
import { RestauranteCiudadController } from './restaurante-ciudad.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RestauranteEntity, CiudadEntity])],
  providers: [RestauranteCiudadService],
  controllers: [RestauranteCiudadController],
})
export class RestauranteCiudadModule {}
