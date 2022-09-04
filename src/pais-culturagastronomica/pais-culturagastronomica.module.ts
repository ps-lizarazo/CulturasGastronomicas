import { Module } from '@nestjs/common';
import { PaisCulturagastronomicaService } from './pais-culturagastronomica.service';

@Module({
  providers: [PaisCulturagastronomicaService]
})
export class PaisCulturagastronomicaModule {}
