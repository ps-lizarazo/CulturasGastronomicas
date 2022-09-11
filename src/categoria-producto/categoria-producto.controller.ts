import { Controller, Param, Post,Get,Put,Delete,HttpCode,Body,UseInterceptors } from '@nestjs/common';
import { ProductoDto } from '../producto/producto.dto';
import { ProductoEntity } from '../producto/producto.entity';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { CategoriaProductoService } from './categoria-producto.service';
import { plainToInstance } from 'class-transformer';



@Controller('categorias')
@UseInterceptors(BusinessErrorsInterceptor)
export class CategoriaProductoController {

  constructor (private readonly categoriaProductoServices: CategoriaProductoService){}

  @Post(':categoriaId/productos/:productoId')
  async AddProductoCategoria(@Param('categoriaId') categoriaId: string, @Param('productoId')productoId:string){
    return await this.categoriaProductoServices.addProductoCategoria(categoriaId,productoId);
  }

  @Get(':categoriaId/productos/:productoId')
   async findProductoByCategoriaIdProductoId(@Param('categoriaId') categoriaId: string, @Param('productoId') productoId: string){
       return await this.categoriaProductoServices.findProductoByCategoriaIdProductoId(categoriaId, productoId);
   }

  @Get(':categoriaId/productos')
   async findProductosByCategoriaId(@Param('categoriaId') categoriaId: string){
       return await this.categoriaProductoServices.findProductosByCategoriaId(categoriaId);
   }

  @Put(':categoriaId/productos')
   async associateproductoMuseum(@Body() productoDto: ProductoDto[], @Param('categoriaId') categoriaId: string){
       const producto = plainToInstance(ProductoEntity, productoDto)
       return await this.categoriaProductoServices.associateProductosCategoria(categoriaId, producto);
   }

  @Delete(':categoriaId/productos/:productoId')
  @HttpCode(204)
   async deleteProductoCategoria(@Param('categoriaId') categoriaId: string, @Param('productoId') productoId: string){
       return await this.categoriaProductoServices.deleteProductoCategoria(categoriaId, productoId);
   }
}
