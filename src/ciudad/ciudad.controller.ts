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
import { CiudadDto } from './ciudad.dto';
import { CiudadEntity } from './ciudad.entity';
import { CiudadService } from './ciudad.service';

@Controller('ciudades')
@UseInterceptors(BusinessErrorsInterceptor)
export class CiudadController {
  constructor(private readonly ciudadService: CiudadService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CONSULTORTODOS, Role.CONSULTORCIUDAD)
  @Get()
  async findAll() {
    return await this.ciudadService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CONSULTORTODOS, Role.CONSULTORCIUDAD)
  @Get(':ciudadId')
  async findOne(@Param('ciudadId') ciudadId: string) {
    return await this.ciudadService.findOne(ciudadId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ESCRITOR)
  @Post()
  async create(@Body() ciudadDto: CiudadDto) {
    const ciudad: CiudadEntity = plainToInstance(CiudadEntity, ciudadDto);
    return await this.ciudadService.create(ciudad);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ESCRITOR)
  @Put(':ciudadId')
  async update(
    @Param('ciudadId') ciudadId: string,
    @Body() ciudadDto: CiudadDto,
  ) {
    const ciudad: CiudadEntity = plainToInstance(CiudadEntity, ciudadDto);
    return await this.ciudadService.update(ciudadId, ciudad);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ELIMINADOR)
  @Delete(':ciudadId')
  @HttpCode(204)
  async delete(@Param('ciudadId') ciudadId: string) {
    return await this.ciudadService.delete(ciudadId);
  }
}
