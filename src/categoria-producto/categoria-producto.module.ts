import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriaEntity } from 'src/categoria/categoria.entity';
import { CategoriaService } from 'src/categoria/categoria.service';

@Module({
  imports: [TypeOrmModule.forFeature([CategoriaEntity])],
  providers: [CategoriaService],
})
export class CategoriaProductoModule {}

