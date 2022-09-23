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
import { EstrellasMichelinDto } from './estrellas_michelin.dto';
import { EstrellasMichelinEntity } from './estrellas_michelin.entity';
import { EstrellasMichelinService } from './estrellas_michelin.service';

@Controller('estrellas_michelines')
@UseInterceptors(BusinessErrorsInterceptor)
export class EstrellasMichelinController {
  constructor(
    private readonly estrellas_michelinService: EstrellasMichelinService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CONSULTORTODOS, Role.CONSULTORESTRELLAMICHELIN)
  @Get()
  async findAll() {
    return await this.estrellas_michelinService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CONSULTORTODOS, Role.CONSULTORESTRELLAMICHELIN)
  @Get(':estrellas_michelinId')
  async findOne(@Param('estrellas_michelinId') estrellas_michelinId: string) {
    return await this.estrellas_michelinService.findOne(estrellas_michelinId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ESCRITOR)
  @Post()
  async create(@Body() estrellas_michelinDto: EstrellasMichelinDto) {
    const estrellas_michelin: EstrellasMichelinEntity = plainToInstance(
      EstrellasMichelinEntity,
      estrellas_michelinDto,
    );
    return await this.estrellas_michelinService.create(estrellas_michelin);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ESCRITOR)
  @Put(':estrellas_michelinId')
  async update(
    @Param('estrellas_michelinId') estrellas_michelinId: string,
    @Body() estrellas_michelinDto: EstrellasMichelinDto,
  ) {
    const estrellas_michelin: EstrellasMichelinEntity = plainToInstance(
      EstrellasMichelinEntity,
      estrellas_michelinDto,
    );
    return await this.estrellas_michelinService.update(
      estrellas_michelinId,
      estrellas_michelin,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ELIMINADOR)
  @Delete(':estrellas_michelinId')
  @HttpCode(204)
  async delete(@Param('estrellas_michelinId') estrellas_michelinId: string) {
    return await this.estrellas_michelinService.delete(estrellas_michelinId);
  }
}
