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
import { RecetaDto } from '../receta/receta.dto';
import { RecetaEntity } from '../receta/receta.entity';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { RecetaCulturaGastronomicaService } from './receta-cultura_gastronomica.service';

@UseInterceptors(BusinessErrorsInterceptor)
@Controller('culturas_gastronomicas')
export class RecetaCulturaGastronomicaController {
  constructor(
    private readonly recetaCulturaGastronomicaService: RecetaCulturaGastronomicaService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ESCRITOR)
  @Post(':culturaGastronomicaId/recetas/:recetaId')
  async addRecetaCulturaGastronomica(
    @Param('culturaGastronomicaId') culturaGastronomicaId: string,
    @Param('recetaId') recetaId: string,
  ) {
    return await this.recetaCulturaGastronomicaService.addRecetaCulturaGastronomica(
      culturaGastronomicaId,
      recetaId,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CONSULTORTODOS, Role.CONSULTORRECETA)
  @Get(':culturaGastronomicaId/recetas/:recetaId')
  async findRecetaByRecetaCulturaGastronomicaId(
    @Param('culturaGastronomicaId') culturaGastronomicaId: string,
    @Param('recetaId') recetaId: string,
  ) {
    return await this.recetaCulturaGastronomicaService.findRecetaByCulturaGastronomicaIdRecetaId(
      culturaGastronomicaId,
      recetaId,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CONSULTORTODOS, Role.CONSULTORRECETA)
  @Get(':culturaGastronomicaId/recetas')
  async findRecetassByCulturaGastronomicaId(
    @Param('culturaGastronomicaId') culturaGastronomicaId: string,
  ) {
    return await this.recetaCulturaGastronomicaService.findRecetasByCulturaGastronomicaId(
      culturaGastronomicaId,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ESCRITOR)
  @Put(':culturaGastronomicaId/recetas')
  async associateRecetasCulturaGastronomica(
    @Body() recetasDto: RecetaDto[],
    @Param('culturaGastronomicaId') culturaGastronomicaId: string,
  ) {
    const recetas = plainToInstance(RecetaEntity, recetasDto);
    return await this.recetaCulturaGastronomicaService.associateRecetasCulturaGastronomica(
      culturaGastronomicaId,
      recetas,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ELIMINADOR)
  @Delete(':culturaGastronomicaId/recetas/:recetaId')
  @HttpCode(204)
  async deleteRecetaCulturaGastronomica(
    @Param('culturaGastronomicaId') culturaGastronomicaId: string,
    @Param('recetaId') recetaId: string,
  ) {
    return await this.recetaCulturaGastronomicaService.deleteRecetaCulturaGastronomica(
      culturaGastronomicaId,
      recetaId,
    );
  }
}
