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
import { CulturaGastronomicaDto } from './cultura_gastronomica.dto';
import { CulturaGastronomicaEntity } from './cultura_gastronomica.entity';
import { CulturaGastronomicaService } from './cultura_gastronomica.service';

@UseInterceptors(BusinessErrorsInterceptor)
@Controller('culturas_gastronomicas')
export class CulturaGastronomicaController {
  constructor(
    private readonly culturaGastronomicaService: CulturaGastronomicaService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CONSULTORTODOS, Role.CONSULTORCULTURA)
  @Get()
  async findAll() {
    return await this.culturaGastronomicaService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CONSULTORTODOS, Role.CONSULTORCULTURA)
  @Get(':culturaGastronomicaId')
  async findOne(@Param('culturaGastronomicaId') culturaGastronomicaId: string) {
    return await this.culturaGastronomicaService.findOne(culturaGastronomicaId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ESCRITOR)
  @Post()
  async create(@Body() culturaGastronomicaDto: CulturaGastronomicaDto) {
    const culturaGastronomica: CulturaGastronomicaEntity = plainToInstance(
      CulturaGastronomicaEntity,
      culturaGastronomicaDto,
    );
    return await this.culturaGastronomicaService.create(culturaGastronomica);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ESCRITOR)
  @Put(':culturaGastronomicaId')
  async update(
    @Param('culturaGastronomicaId') culturaGastronomicaId: string,
    @Body() culturaGastronomicaDto: CulturaGastronomicaDto,
  ) {
    const culturaGastronomica: CulturaGastronomicaEntity = plainToInstance(
      CulturaGastronomicaEntity,
      culturaGastronomicaDto,
    );
    return await this.culturaGastronomicaService.update(
      culturaGastronomicaId,
      culturaGastronomica,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ELIMINADOR)
  @Delete(':culturaGastronomicaId')
  @HttpCode(204)
  async delete(@Param('culturaGastronomicaId') culturaGastronomicaId: string) {
    return await this.culturaGastronomicaService.delete(culturaGastronomicaId);
  }
}
