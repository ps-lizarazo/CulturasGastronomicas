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
import { PaisCulturagastronomicaService } from './pais-culturagastronomica.service';

@Controller('paises')
@UseInterceptors(BusinessErrorsInterceptor)
export class PaisCulturagastronomicaController {
  constructor(
    private readonly paisCulturagastronomicaService: PaisCulturagastronomicaService,
  ) {}

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

  @Get(':paisId/culturas-gastronomicas')
  async findCulturasGastronomicasByPaisId(@Param('paisId') paisId: string) {
    return await this.paisCulturagastronomicaService.findCulturasGastronomicasInPais(
      paisId,
    );
  }

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
