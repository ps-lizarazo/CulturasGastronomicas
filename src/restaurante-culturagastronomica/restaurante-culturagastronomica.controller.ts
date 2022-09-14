import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { CulturaGastronomicaEntity } from '../cultura_gastronomica/cultura_gastronomica.entity';
import { RestauranteCulturagastronomicaService } from './restaurante-culturagastronomica.service';

@Controller('restaurantes')
@UseInterceptors(BusinessErrorsInterceptor)
export class RestauranteCulturagastronomicaController {
  constructor(
    private readonly restauranteCulturagastronomicaService: RestauranteCulturagastronomicaService,
  ) {}

  @Post(':restauranteId/culturas-gastronomicas/:culturaGastronomicaId')
  async addCulturaGastronomica(
    @Param('restauranteId') restauranteId: string,
    @Param('culturaGastronomicaId') culturaGastronomicaId: string,
  ) {
    return await this.restauranteCulturagastronomicaService.associateCulturaGastronomicaRestaurante(
      restauranteId,
      culturaGastronomicaId,
    );
  }

  @Get(':restauranteId/culturas-gastronomicas/:culturaGastronomicaId')
  async findCulturaGastronomicaByRestauranteIdCulturaId(
    @Param('restauranteId') restauranteId: string,
    @Param('culturaGastronomicaId') culturaGastronomicaId: string,
  ) {
    return await this.restauranteCulturagastronomicaService.findCulturaGastronomicaInRestaurante(
      restauranteId,
      culturaGastronomicaId,
    );
  }

  @Get(':restauranteId/culturas-gastronomicas')
  async findCulturasGastronomicasByRestauranteId(
    @Param('restauranteId') restauranteId: string,
  ) {
    return await this.restauranteCulturagastronomicaService.findCulturasGastronomicasInRestaurante(
      restauranteId,
    );
  }

  @Put(':restauranteId/culturas-gastronomicas')
  async associateCulturasGastronomicasByRestauranteId(
    @Body() culturasGastronomicasDto: CulturaGastronomicaEntity[],
    @Param('restauranteId') restauranteId: string,
  ) {
    const culturasGastronomicas = plainToInstance(
      CulturaGastronomicaEntity,
      culturasGastronomicasDto,
    );
    return await this.restauranteCulturagastronomicaService.associateCulturasGastronomicasRestaurante(
      restauranteId,
      culturasGastronomicas,
    );
  }

  @Delete(':restauranteId/culturas-gastronomicas/:culturaGastronomicaId')
  @HttpCode(204)
  async deleteCulturaGastronomica(
    @Param('restauranteId') restauranteId: string,
    @Param('culturaGastronomicaId') culturaGastronomicaId: string,
  ) {
    return await this.restauranteCulturagastronomicaService.dissociateCulturaGastronomicaRestaurante(
      restauranteId,
      culturaGastronomicaId,
    );
  }
}
