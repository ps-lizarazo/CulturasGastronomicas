import {
  Controller,
  Param,
  Post,
  Get,
  Put,
  Delete,
  HttpCode,
  Body,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { ProductoDto } from '../producto/producto.dto';
import { ProductoEntity } from '../producto/producto.entity';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { CategoriaProductoService } from './categoria-producto.service';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/roles/role.enum';
import { Roles } from 'src/roles/roles.decorator';

@Controller('categorias')
@UseInterceptors(BusinessErrorsInterceptor)
export class CategoriaProductoController {
  constructor(
    private readonly categoriaProductoServices: CategoriaProductoService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ESCRITOR)
  @Post(':categoriaId/productos/:productoId')
  async AddProductoCategoria(
    @Param('categoriaId') categoriaId: string,
    @Param('productoId') productoId: string,
  ) {
    return await this.categoriaProductoServices.addProductoCategoria(
      categoriaId,
      productoId,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CONSULTORTODOS, Role.CONSULTORCATEGORIA)
  @Get(':categoriaId/productos/:productoId')
  async findProductoByCategoriaIdProductoId(
    @Param('categoriaId') categoriaId: string,
    @Param('productoId') productoId: string,
  ) {
    return await this.categoriaProductoServices.findProductoByCategoriaIdProductoId(
      categoriaId,
      productoId,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CONSULTORTODOS, Role.CONSULTORCATEGORIA)
  @Get(':categoriaId/productos')
  async findProductosByCategoriaId(@Param('categoriaId') categoriaId: string) {
    return await this.categoriaProductoServices.findProductosByCategoriaId(
      categoriaId,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ESCRITOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ESCRITOR)
  @Put(':categoriaId/productos')
  async associateproductoMuseum(
    @Body() productoDto: ProductoDto[],
    @Param('categoriaId') categoriaId: string,
  ) {
    const producto = plainToInstance(ProductoEntity, productoDto);
    return await this.categoriaProductoServices.associateProductosCategoria(
      categoriaId,
      producto,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ELIMINADOR)
  @Delete(':categoriaId/productos/:productoId')
  @HttpCode(204)
  async deleteProductoCategoria(
    @Param('categoriaId') categoriaId: string,
    @Param('productoId') productoId: string,
  ) {
    return await this.categoriaProductoServices.deleteProductoCategoria(
      categoriaId,
      productoId,
    );
  }
}
