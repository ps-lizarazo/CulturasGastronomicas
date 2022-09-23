import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/roles/role.enum';
import { Roles } from 'src/roles/roles.decorator';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { RestauranteCiudadService } from './restaurante-ciudad.service';

@Controller('restaurantes')
@UseInterceptors(BusinessErrorsInterceptor)
export class RestauranteCiudadController {
  constructor(
    private readonly restauranteCiudadService: RestauranteCiudadService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ESCRITOR)
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CONSULTORTODOS, Role.CONSULTORRESTAURANTE)
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ELIMINADOR)
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
