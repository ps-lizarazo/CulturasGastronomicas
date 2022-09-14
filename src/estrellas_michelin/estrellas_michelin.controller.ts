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
import { EstrellasMichelinDto } from './estrellas_michelin.dto';
import { EstrellasMichelinEntity } from './estrellas_michelin.entity';
import { EstrellasMichelinService } from './estrellas_michelin.service';

@Controller('estrellas_michelines')
@UseInterceptors(BusinessErrorsInterceptor)
export class EstrellasMichelinController {
  constructor(
    private readonly estrellas_michelinService: EstrellasMichelinService,
  ) {}

  @Get()
  async findAll() {
    return await this.estrellas_michelinService.findAll();
  }

  @Get(':estrellas_michelinId')
  async findOne(@Param('estrellas_michelinId') estrellas_michelinId: string) {
    return await this.estrellas_michelinService.findOne(estrellas_michelinId);
  }

  @Post()
  async create(@Body() estrellas_michelinDto: EstrellasMichelinDto) {
    const estrellas_michelin: EstrellasMichelinEntity = plainToInstance(
      EstrellasMichelinEntity,
      estrellas_michelinDto,
    );
    return await this.estrellas_michelinService.create(estrellas_michelin);
  }

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

  @Delete(':estrellas_michelinId')
  @HttpCode(204)
  async delete(@Param('estrellas_michelinId') estrellas_michelinId: string) {
    return await this.estrellas_michelinService.delete(estrellas_michelinId);
  }
}
