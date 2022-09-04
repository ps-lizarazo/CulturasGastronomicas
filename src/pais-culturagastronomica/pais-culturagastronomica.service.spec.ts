import { Test, TestingModule } from '@nestjs/testing';
import { CulturaGastronomicaEntity } from '../cultura_gastronomica/cultura_gastronomica.entity';
import { PaisEntity } from '../pais/pais.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PaisCulturagastronomicaService } from './pais-culturagastronomica.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';

describe('PaisCulturagastronomicaService', () => {
  let service: PaisCulturagastronomicaService;
  let paisRepository: Repository<PaisEntity>;
  let culturaGastronomicaRepository: Repository<CulturaGastronomicaEntity>;
  let pais: PaisEntity;
  let listCulture: CulturaGastronomicaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PaisCulturagastronomicaService],
    }).compile();

    service = module.get<PaisCulturagastronomicaService>(
      PaisCulturagastronomicaService,
    );
    paisRepository = module.get(getRepositoryToken(PaisEntity));
    culturaGastronomicaRepository = module.get(
      getRepositoryToken(CulturaGastronomicaEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    paisRepository.clear();
    culturaGastronomicaRepository.clear();

    //create culturasGastronomicasList
    listCulture = [];
    for (let i = 0; i < 5; i++) {
      const cultura: CulturaGastronomicaEntity =
        await culturaGastronomicaRepository.save({
          nombre: `cultura${i}`,
          descripcion: `descripcion${i}`,
          imagen: `imagen${i}`,
        });
      listCulture.push(cultura);
    }

    //create pais
    pais = await paisRepository.save({
      nombre: 'pais',
      descripcion: 'descripcion',
      imagen: 'imagen',
      culturasGastronomicas: listCulture,
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should associate a culture gastronomic to a country', async () => {
    const culture = await culturaGastronomicaRepository.save({
      nombre: faker.company.companyName(),
      descripcion: faker.lorem.sentence(),
      imagen: faker.image.imageUrl(),
    });

    const pais = await paisRepository.save({
      nombre: faker.address.country(),
    });

    const result = await service.associateCulturaGastronomicaPais(
      pais.id,
      culture.id,
    );

    expect(result.culturasGastronomicas.length).toBe(1);
    expect(result.culturasGastronomicas[0]).not.toBeNull();
    expect(result.culturasGastronomicas[0].id).toBe(culture.id);
    expect(result.culturasGastronomicas[0].nombre).toBe(culture.nombre);
    expect(result.culturasGastronomicas[0].descripcion).toBe(
      culture.descripcion,
    );
  });

  it('associate should thow an error for an invalid CultureGastronomica', async () => {
    const pais = await paisRepository.save({
      nombre: faker.address.country(),
    });

    try {
      await service.associateCulturaGastronomicaPais(pais.id, '999999');
    } catch (error) {
      expect(error.message).toBe(
        'La cultura gastronomica con el id dado no existe',
      );
    }
  });

  it('associate should thow an error for an invalid Pais', async () => {
    const culture = await culturaGastronomicaRepository.save({
      nombre: faker.company.companyName(),
      descripcion: faker.lorem.sentence(),
      imagen: faker.image.imageUrl(),
    });

    try {
      await service.associateCulturaGastronomicaPais('999999', culture.id);
    } catch (error) {
      expect(error.message).toBe('El pais con el id dado no existe');
    }
  });

  it('should findCulturaGastronomicaInPais', async () => {
    const cultura: CulturaGastronomicaEntity = listCulture[0];
    const storedCulture = await service.findCulturaGastronomicaInPais(
      pais.id,
      cultura.id,
    );

    expect(storedCulture).not.toBeNull();
    expect(storedCulture.id).toBe(cultura.id);
    expect(storedCulture.nombre).toBe(cultura.nombre);
    expect(storedCulture.descripcion).toBe(cultura.descripcion);
  });

  it('should findCulturaGastronomicaInPais throw an error for an invalid pais', async () => {
    const cultura: CulturaGastronomicaEntity = listCulture[0];

    try {
      await service.findCulturaGastronomicaInPais('999999', cultura.id);
    } catch (error) {
      expect(error.message).toBe('El pais con el id dado no existe');
    }
  });

  it('should findCulturaGastronomicaInPais throw an error for an invalid cultura', async () => {
    try {
      await service.findCulturaGastronomicaInPais(pais.id, '999999');
    } catch (error) {
      expect(error.message).toBe(
        'La cultura gastronomica con el id dado no existe',
      );
    }
  });

  it('should findCulturaGastronomicaInPais throw an error for a cultura not associated to pais', async () => {
    const cultura: CulturaGastronomicaEntity =
      await culturaGastronomicaRepository.save({
        nombre: faker.company.companyName(),
        descripcion: faker.lorem.sentence(),
        imagen: faker.image.imageUrl(),
      });

    try {
      await service.findCulturaGastronomicaInPais(pais.id, cultura.id);
    } catch (error) {
      expect(error.message).toBe(
        'La cultura gastronomica con el id dado no esta asociada al pais',
      );
    }
  });

  it('should findAllCulturasGastronomicasInPais', async () => {
    const storedCulturas = await service.findCulturasGastronomicasInPais(
      pais.id,
    );

    expect(storedCulturas.length).toBe(listCulture.length);
    expect(storedCulturas[0].id).toBe(listCulture[0].id);
    expect(storedCulturas[0].nombre).toBe(listCulture[0].nombre);
    expect(storedCulturas[0].descripcion).toBe(listCulture[0].descripcion);
  });

  it('should associateCulturasGastronomicasPais update the list of cultures gastronomicas', async () => {
    const newCulture = await culturaGastronomicaRepository.save({
      nombre: faker.company.companyName(),
      descripcion: faker.lorem.sentence(),
      imagen: faker.image.imageUrl(),
    });

    const result = await service.associateCulturasGastronomicasPais(pais.id, [
      newCulture,
    ]);

    expect(result.culturasGastronomicas.length).toBe(1);
    expect(result.culturasGastronomicas[0].id).toBe(newCulture.id);
    expect(result.culturasGastronomicas[0].nombre).toBe(newCulture.nombre);
    expect(result.culturasGastronomicas[0].descripcion).toBe(
      newCulture.descripcion,
    );
  });

  it('should associateCulturasGastronomicasPais throw an error for an invalid pais', async () => {
    const newCulture = await culturaGastronomicaRepository.save({
      nombre: faker.company.companyName(),
      descripcion: faker.lorem.sentence(),
      imagen: faker.image.imageUrl(),
    });

    try {
      await service.associateCulturasGastronomicasPais('999999', [newCulture]);
    } catch (error) {
      expect(error.message).toBe('El pais con el id dado no existe');
    }
  });

  it('should associateCulturasGastronomicasPais throw an error for an invalid cultura', async () => {
    const cultura = listCulture[0];
    cultura.id = '999999';
    try {
      await service.associateCulturasGastronomicasPais(pais.id, [cultura]);
    } catch (error) {
      expect(error.message).toBe(
        'La cultura gastronomica con el id dado no existe',
      );
    }
  });

  it('dissociateCulturaGastronomicaPais should dissociate a cultura gastronomica from a pais', async () => {
    const cultura = listCulture[0];
    await service.dissociateCulturaGastronomicaPais(pais.id, cultura.id);

    const storedPais = await paisRepository.findOne({
      where: { id: `${pais.id}` },
      relations: ['culturasGastronomicas'],
    });
    const deletedCulture = storedPais.culturasGastronomicas.find(
      (c) => c.id === cultura.id,
    );

    expect(deletedCulture).toBeUndefined();
  });

  it('dissociateCulturaGastronomicaPais should throw an error for an invalid pais', async () => {
    const cultura = listCulture[0];
    try {
      await service.dissociateCulturaGastronomicaPais('999999', cultura.id);
    } catch (error) {
      expect(error.message).toBe('El pais con el id dado no existe');
    }
  });

  it('dissociateCulturaGastronomicaPais should throw an error for an invalid cultura', async () => {
    try {
      await service.dissociateCulturaGastronomicaPais(pais.id, '999999');
    } catch (error) {
      expect(error.message).toBe(
        'La cultura gastronomica con el id dado no existe',
      );
    }
  });

  it('dissociateCulturaGastronomicaPais should throw an error for a cultura not associated to pais', async () => {
    const cultura: CulturaGastronomicaEntity =
      await culturaGastronomicaRepository.save({
        nombre: faker.company.companyName(),
        descripcion: faker.lorem.sentence(),
        imagen: faker.image.imageUrl(),
      });

    try {
      await service.dissociateCulturaGastronomicaPais(pais.id, cultura.id);
    } catch (error) {
      expect(error.message).toBe(
        'La cultura gastronomica con el id dado no esta asociada al pais',
      );
    }
  });
});
