import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { RestauranteCiudadService } from './restaurante-ciudad.service';

@Controller('restaurantes')
@UseInterceptors(BusinessErrorsInterceptor)
export class RestauranteCiudadController {
  constructor(
    private readonly restauranteCiudadService: RestauranteCiudadService,
  ) {}

  @Post(':restauranteId/ciudad/:ciudadId')
  async addCiudad(
    @Param('restauranteId') restauranteId: string,
    @Param('ciudadId') ciudadId: string,
  ) {
    return await this.restauranteCiudadService.associateCiudadRestaurante(
      restauranteId,
      ciudadId,
    );
  }

  @Get(':restauranteId/ciudad/:ciudadId')
  async findCiudadByRestauranteId(
    @Param('restauranteId') restauranteId: string,
    @Param('ciudadId') ciudadId: string,
  ) {
    return await this.restauranteCiudadService.findCiudadInRestaurante(
      restauranteId,
      ciudadId,
    );
  }

  @Delete(':restauranteId/ciudad/:ciudadId')
  @HttpCode(204)
  async deleteCiudad(
    @Param('restauranteId') restauranteId: string,
    @Param('ciudadId') ciudadId: string,
  ) {
    return await this.restauranteCiudadService.dissociateCiudadRestaurante(
      restauranteId,
      ciudadId,
    );
  }
}
