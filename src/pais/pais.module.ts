import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaisEntity } from './pais.entity';
import { PaisService } from './pais.service';
import { PaisController } from './pais.controller';
import { PaisResolver } from './pais.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([PaisEntity])],
  providers: [PaisService, PaisResolver],
  controllers: [PaisController],
})
export class PaisModule {}
