import { Get,Post,Put,Delete,HttpCode,Param,Body,Controller,UseInterceptors,UseGuards,SetMetadata } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CategoriaService } from './categoria.service';
import { CategoriaEntity } from './categoria.entity';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor'
import { CategoriaDto } from './categoria.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Role } from '../roles/role.enum'
import { Roles } from '../roles/roles.decorator'
import { RolesGuard } from '../auth/guards/roles.guard';

@UseInterceptors(BusinessErrorsInterceptor)
@Controller('categorias')
export class CategoriaController {

  constructor(private readonly categoriaService: CategoriaService) {}

  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles(Role.LISTADOR)
  @Get()
  async findAll() {
    return await this.categoriaService.findAll();
  }
  @Get(':categoriaId')
  async findOne(@Param('categoriaId') categoriaId: string) {
    return await this.categoriaService.findOne(categoriaId);
  }

  @Post()
  async create(@Body() categoriaDto: CategoriaDto) {
    const categoria: CategoriaEntity = plainToInstance(CategoriaEntity, categoriaDto);
    return await this.categoriaService.create(categoria);
  }

  @Put(':categoriaId')
  async update(@Param('categoriaId') categoriaId: string, @Body() categoriaDto: CategoriaDto) {
    const categoria: CategoriaEntity = plainToInstance(CategoriaEntity, categoriaDto);
    return await this.categoriaService.update(categoriaId, categoria);
  }

  @Delete(':categoriaId')
  @HttpCode(204)
  async delete(@Param('categoriaId') categoriaId: string) {
    return await this.categoriaService.delete(categoriaId);
  }
}
