import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { RecetaDto } from '../receta/receta.dto';
import { RecetaEntity } from '../receta/receta.entity';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { RecetaCulturaGastronomicaService } from './receta-cultura_gastronomica.service';

@UseInterceptors(BusinessErrorsInterceptor)
@Controller('receta-cultura-gastronomica')
export class RecetaCulturaGastronomicaController {
    constructor(private readonly recetaCulturaGastronomicaService: RecetaCulturaGastronomicaService) { }

    @Post(':culturaGastronomicaId/recetas/:recetaId')
    async addRecetaCulturaGastronomica(@Param('culturaGastronomicaId') culturaGastronomicaId: string, @Param('recetaId') recetaId: string) {
        return await this.recetaCulturaGastronomicaService.addRecetaCulturaGastronomica(culturaGastronomicaId, recetaId);
    }

    @Get(':culturaGastronomicaId/recetas/:recetaId')
    async findRecetaByRecetaCulturaGastronomicaId(@Param('culturaGastronomicaId') culturaGastronomicaId: string, @Param('recetaId') recetaId: string) {
        return await this.recetaCulturaGastronomicaService.findRecetaByCulturaGastronomicaIdRecetaId(culturaGastronomicaId, recetaId);
    }

    @Get(':culturaGastronomicaId/recetas')
    async findRecetassByCulturaGastronomicaId(@Param('culturaGastronomicaId') culturaGastronomicaId: string) {
        return await this.recetaCulturaGastronomicaService.findRecetasByCulturaGastronomicaId(culturaGastronomicaId);
    }

    @Put(':culturaGastronomicaId/recetas')
    async associateRecetasCulturaGastronomica(@Body() recetasDto: RecetaDto[], @Param('culturaGastronomicaId') culturaGastronomicaId: string) {
        const recetas = plainToInstance(RecetaEntity, recetasDto)
        return await this.recetaCulturaGastronomicaService.associateRecetasCulturaGastronomica(culturaGastronomicaId, recetas);
    }

    @Delete(':culturaGastronomicaId/recetas/:recetaId')
    @HttpCode(204)
    async deleteRecetaCulturaGastronomica(@Param('culturaGastronomicaId') culturaGastronomicaId: string, @Param('recetaId') recetaId: string) {
        return await this.recetaCulturaGastronomicaService.deleteRecetaCulturaGastronomica(culturaGastronomicaId, recetaId);
    }
}
