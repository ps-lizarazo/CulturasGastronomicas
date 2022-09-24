import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { CulturaGastronomicaEntity } from '../cultura_gastronomica/cultura_gastronomica.entity';
import { RestauranteCulturagastronomicaService } from './restaurante-culturagastronomica.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/roles/role.enum';
import { Roles } from 'src/roles/roles.decorator';

@Controller('restaurantes')
@UseInterceptors(BusinessErrorsInterceptor)
export class RestauranteCulturagastronomicaController {
  constructor(
    private readonly restauranteCulturagastronomicaService: RestauranteCulturagastronomicaService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ESCRITOR)
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CONSULTORTODOS, Role.CONSULTORCULTURA)
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CONSULTORTODOS, Role.CONSULTORCULTURA)
  @Get(':restauranteId/culturas-gastronomicas')
  async findCulturasGastronomicasByRestauranteId(
    @Param('restauranteId') restauranteId: string,
  ) {
    return await this.restauranteCulturagastronomicaService.findCulturasGastronomicasInRestaurante(
      restauranteId,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ESCRITOR)
  @Put('restauranteId/culturas-gastronomicas')
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ELIMINADOR)
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
