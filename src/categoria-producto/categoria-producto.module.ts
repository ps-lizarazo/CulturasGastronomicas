import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriaEntity } from '../categoria/categoria.entity';
import { CategoriaProductoController } from './categoria-producto.controller';
import { CategoriaProductoService } from './categoria-producto.service';
import { ProductoEntity } from '../producto/producto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CategoriaEntity, ProductoEntity])],
  providers: [CategoriaProductoService],
  controllers: [CategoriaProductoController],
})
export class CategoriaProductoModule {}
