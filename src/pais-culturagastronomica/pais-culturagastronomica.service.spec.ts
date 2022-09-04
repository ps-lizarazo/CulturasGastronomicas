import { Test, TestingModule } from '@nestjs/testing';
import { PaisCulturagastronomicaService } from './pais-culturagastronomica.service';

describe('PaisCulturagastronomicaService', () => {
  let service: PaisCulturagastronomicaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaisCulturagastronomicaService],
    }).compile();

    service = module.get<PaisCulturagastronomicaService>(PaisCulturagastronomicaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
