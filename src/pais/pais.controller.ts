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
import { PaisDto } from './pais.dto';
import { PaisEntity } from './pais.entity';
import { PaisService } from './pais.service';

@Controller('paises')
@UseInterceptors(BusinessErrorsInterceptor)
export class PaisController {
  constructor(private readonly paisService: PaisService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CONSULTORTODOS, Role.CONSULTORPAIS)
  @Get()
  async findAll() {
    return await this.paisService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CONSULTORTODOS, Role.CONSULTORPAIS)
  @Get(':paisId')
  async findOne(@Param('paisId') paisId: string) {
    return await this.paisService.findOne(paisId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ESCRITOR)
  @Post()
  async create(@Body() paisDto: PaisDto) {
    const pais: PaisEntity = plainToInstance(PaisEntity, paisDto);
    return await this.paisService.create(pais);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ESCRITOR)
  @Put(':paisId')
  async update(@Param('paisId') paisId: string, @Body() paisDto: PaisDto) {
    const pais: PaisEntity = plainToInstance(PaisEntity, paisDto);
    return await this.paisService.update(paisId, pais);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ELIMINADOR)
  @Delete(':paisId')
  @HttpCode(204)
  async delete(@Param('paisId') paisId: string) {
    return await this.paisService.delete(paisId);
  }
}
