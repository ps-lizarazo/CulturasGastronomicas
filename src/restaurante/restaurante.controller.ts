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
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/roles/role.enum';
import { Roles } from 'src/roles/roles.decorator';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { RestauranteDto } from './restaurante.dto';
import { RestauranteEntity } from './restaurante.entity';
import { RestauranteService } from './restaurante.service';

@Controller('restaurantes')
@UseInterceptors(BusinessErrorsInterceptor)
export class RestauranteController {
  constructor(private readonly restauranteService: RestauranteService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CONSULTORTODOS, Role.CONSULTORRESTAURANTE)
  @Get()
  async findAll() {
    return await this.restauranteService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CONSULTORTODOS, Role.CONSULTORRESTAURANTE)
  @Get(':restauranteId')
  async findOne(@Param('restauranteId') restauranteId: string) {
    return await this.restauranteService.findOne(restauranteId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ESCRITOR)
  @Post()
  async create(@Body() restauranteDto: RestauranteDto) {
    const restaurante: RestauranteEntity = plainToInstance(
      RestauranteEntity,
      restauranteDto,
    );
    return await this.restauranteService.create(restaurante);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ESCRITOR)
  @Put(':restauranteId')
  async update(
    @Param('restauranteId') restauranteId: string,
    @Body() restauranteDto: RestauranteDto,
  ) {
    const restaurante: RestauranteEntity = plainToInstance(
      RestauranteEntity,
      restauranteDto,
    );
    return await this.restauranteService.update(restauranteId, restaurante);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ELIMINADOR)
  @Delete(':restauranteId')
  @HttpCode(204)
  async delete(@Param('restauranteId') restauranteId: string) {
    return await this.restauranteService.delete(restauranteId);
  }
}
