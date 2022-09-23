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
import { PaisCulturagastronomicaService } from './pais-culturagastronomica.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/roles/roles.decorator';
import { Role } from 'src/roles/role.enum';

@Controller('paises')
@UseInterceptors(BusinessErrorsInterceptor)
export class PaisCulturagastronomicaController {
  constructor(
    private readonly paisCulturagastronomicaService: PaisCulturagastronomicaService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ESCRITOR)
  @Post(':paisId/culturas-gastronomicas/:culturaGastronomicaId')
  async addCulturaGastronomica(
    @Param('paisId') paisId: string,
    @Param('culturaGastronomicaId') culturaGastronomicaId: string,
  ) {
    return await this.paisCulturagastronomicaService.associateCulturaGastronomicaPais(
      paisId,
      culturaGastronomicaId,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CONSULTORTODOS, Role.CONSULTORPAIS)
  @Get(':paisId/culturas-gastronomicas/:culturaGastronomicaId')
  async findCulturaGastronomicaByPaisIdCulturaId(
    @Param('paisId') paisId: string,
    @Param('culturaGastronomicaId') culturaGastronomicaId: string,
  ) {
    return await this.paisCulturagastronomicaService.findCulturaGastronomicaInPais(
      paisId,
      culturaGastronomicaId,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CONSULTORTODOS, Role.CONSULTORPAIS)
  @Get(':paisId/culturas-gastronomicas')
  async findCulturasGastronomicasByPaisId(@Param('paisId') paisId: string) {
    return await this.paisCulturagastronomicaService.findCulturasGastronomicasInPais(
      paisId,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ESCRITOR)
  @Put(':paisId/culturas-gastronomicas')
  async associateCulturasGastronomicasByPaisId(
    @Body() culturasGastronomicasDto: CulturaGastronomicaEntity[],
    @Param('paisId') paisId: string,
  ) {
    const culturasGastronomicas = plainToInstance(
      CulturaGastronomicaEntity,
      culturasGastronomicasDto,
    );
    return await this.paisCulturagastronomicaService.associateCulturasGastronomicasPais(
      paisId,
      culturasGastronomicas,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ELIMINADOR)
  @Delete(':paisId/culturas-gastronomicas/:culturaGastronomicaId')
  @HttpCode(204)
  async deleteCulturaGastronomica(
    @Param('paisId') paisId: string,
    @Param('culturaGastronomicaId') culturaGastronomicaId: string,
  ) {
    return await this.paisCulturagastronomicaService.dissociateCulturaGastronomicaPais(
      paisId,
      culturaGastronomicaId,
    );
  }
}
