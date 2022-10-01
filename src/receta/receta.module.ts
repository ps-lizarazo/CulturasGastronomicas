import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecetaEntity } from './receta.entity';
import { RecetaService } from './receta.service';
import { RecetaController } from './receta.controller';
import { RecetaResolver } from './receta.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([RecetaEntity]), CacheModule.register()],
  providers: [RecetaService, RecetaResolver],
  controllers: [RecetaController],
})
export class RecetaModule {}
