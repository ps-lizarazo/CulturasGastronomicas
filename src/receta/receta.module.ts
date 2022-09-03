import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecetaEntity } from './receta.entity';
import { RecetaService } from './receta.service';

@Module({
  imports: [TypeOrmModule.forFeature([RecetaEntity])],
  providers: [RecetaService]
})
export class RecetaModule {}
