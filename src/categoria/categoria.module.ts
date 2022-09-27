import { Module } from '@nestjs/common';
import { CategoriaService } from './categoria.service';
import { CategoriaEntity } from './categoria.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriaController } from './categoria.controller';
import { CategoriaResolver } from './categoria.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([CategoriaEntity])],
  providers: [CategoriaService, CategoriaResolver],
  controllers: [CategoriaController],
})
export class CategoriaModule {}
