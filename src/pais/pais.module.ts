import { Module } from '@nestjs/common';
import { PaisService } from './pais.service';

@Module({
  providers: [PaisService]
})
export class PaisModule {}
