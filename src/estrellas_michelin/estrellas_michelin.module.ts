import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstrellasMichelinEntity } from './estrellas_michelin.entity';
import { EstrellasMichelinService } from './estrellas_michelin.service';
import { EstrellasMichelinController } from './estrellas_michelin.controller';

@Module({
  imports: [TypeOrmModule.forFeature([EstrellasMichelinEntity])],
  providers: [EstrellasMichelinService],
  controllers: [EstrellasMichelinController],
})
export class EstrellasMichelinModule {}
