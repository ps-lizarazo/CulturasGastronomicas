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
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { plainToInstance } from 'class-transformer';
import { RecetaService } from './receta.service';
import { RecetaEntity } from './receta.entity';
import { RecetaDto } from './receta.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/roles/roles.decorator';
import { Role } from 'src/roles/role.enum';

@UseInterceptors(BusinessErrorsInterceptor)
@Controller('recetas')
export class RecetaController {
  constructor(private readonly recetaService: RecetaService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CONSULTORTODOS, Role.CONSULTORRECETA)
  @Get()
  async findAll() {
    return await this.recetaService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CONSULTORTODOS, Role.CONSULTORRECETA)
  @Get(':recetaId')
  async findOne(@Param('recetaId') recetaId: string) {
    return await this.recetaService.findOne(recetaId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ESCRITOR)
  @Post()
  async create(@Body() recetaDto: RecetaDto) {
    const receta: RecetaEntity = plainToInstance(RecetaEntity, recetaDto);
    return await this.recetaService.create(receta);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ESCRITOR)
  @Put(':recetaId')
  async update(
    @Param('recetaId') recetaId: string,
    @Body() recetaDto: RecetaDto,
  ) {
    const receta: RecetaEntity = plainToInstance(RecetaEntity, recetaDto);
    return await this.recetaService.update(recetaId, receta);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ELIMINADOR)
  @Delete(':recetaId')
  @HttpCode(204)
  async delete(@Param('recetaId') recetaId: string) {
    return await this.recetaService.delete(recetaId);
  }
}
