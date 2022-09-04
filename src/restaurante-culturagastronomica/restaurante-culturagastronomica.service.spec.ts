import { Test, TestingModule } from '@nestjs/testing';
import { CulturaGastronomicaEntity } from '../cultura_gastronomica/cultura_gastronomica.entity';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RestauranteCulturagastronomicaService } from './restaurante-culturagastronomica.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';

describe('RestauranteCulturagastronomicaService', () => {
  let service: RestauranteCulturagastronomicaService;
  let restauranteRepository: Repository<RestauranteEntity>;
  let culturaGastronomicaRepository: Repository<CulturaGastronomicaEntity>;
  let restaurante: RestauranteEntity;
  let listCulture: CulturaGastronomicaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [RestauranteCulturagastronomicaService],
    }).compile();

    service = module.get<RestauranteCulturagastronomicaService>(
      RestauranteCulturagastronomicaService,
    );
    restauranteRepository = module.get(getRepositoryToken(RestauranteEntity));
    culturaGastronomicaRepository = module.get(
      getRepositoryToken(CulturaGastronomicaEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    restauranteRepository.clear();
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

    //create restaurante
    restaurante = await restauranteRepository.save({
      nombre: 'restaurante',
      culturasGastronomicas: listCulture,
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should associate a culture gastronomic to a country', async () => {
    const culture = await culturaGastronomicaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      imagen: faker.image.imageUrl(),
    });

    const restaurante = await restauranteRepository.save({
      nombre: faker.lorem.sentence(),
    });

    const result = await service.associateCulturaGastronomicaRestaurante(
      restaurante.id,
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
    const restaurante = await restauranteRepository.save({
      nombre: faker.lorem.sentence(),
    });

    try {
      await service.associateCulturaGastronomicaRestaurante(
        restaurante.id,
        '999999',
      );
    } catch (error) {
      expect(error.message).toBe(
        'La cultura gastronomica con el id dado no existe',
      );
    }
  });

  it('associate should thow an error for an invalid Restaurante', async () => {
    const culture = await culturaGastronomicaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      imagen: faker.image.imageUrl(),
    });

    try {
      await service.associateCulturaGastronomicaRestaurante(
        '999999',
        culture.id,
      );
    } catch (error) {
      expect(error.message).toBe('El restaurante con el id dado no existe');
    }
  });

  it('should findCulturaGastronomicaInRestaurante', async () => {
    const cultura: CulturaGastronomicaEntity = listCulture[0];
    const storedCulture = await service.findCulturaGastronomicaInRestaurante(
      restaurante.id,
      cultura.id,
    );

    expect(storedCulture).not.toBeNull();
    expect(storedCulture.id).toBe(cultura.id);
    expect(storedCulture.nombre).toBe(cultura.nombre);
    expect(storedCulture.descripcion).toBe(cultura.descripcion);
  });

  it('should findCulturaGastronomicaInRestaurante throw an error for an invalid restaurante', async () => {
    const cultura: CulturaGastronomicaEntity = listCulture[0];

    try {
      await service.findCulturaGastronomicaInRestaurante('999999', cultura.id);
    } catch (error) {
      expect(error.message).toBe('El restaurante con el id dado no existe');
    }
  });

  it('should findCulturaGastronomicaInRestaurante throw an error for an invalid cultura', async () => {
    try {
      await service.findCulturaGastronomicaInRestaurante(
        restaurante.id,
        '999999',
      );
    } catch (error) {
      expect(error.message).toBe(
        'La cultura gastronomica con el id dado no existe',
      );
    }
  });

  it('should findCulturaGastronomicaInRestaurante throw an error for a cultura not associated to restaurante', async () => {
    const cultura: CulturaGastronomicaEntity =
      await culturaGastronomicaRepository.save({
        nombre: faker.company.name(),
        descripcion: faker.lorem.sentence(),
        imagen: faker.image.imageUrl(),
      });

    try {
      await service.findCulturaGastronomicaInRestaurante(
        restaurante.id,
        cultura.id,
      );
    } catch (error) {
      expect(error.message).toBe(
        'La cultura gastronomica con el id dado no esta asociada al restaurante',
      );
    }
  });

  it('should findAllCulturasGastronomicasInRestaurante', async () => {
    const storedCulturas = await service.findCulturasGastronomicasInRestaurante(
      restaurante.id,
    );

    const storedCultura = storedCulturas.find(
      (storedCultura) => storedCultura.nombre === 'cultura0',
    );

    const itemCulture = listCulture.find(
      (itemCulture) => itemCulture.nombre === 'cultura0',
    );

    expect(storedCulturas.length).toBe(listCulture.length);
    expect(storedCultura.id).toBe(itemCulture.id);
    expect(storedCultura.nombre).toBe(itemCulture.nombre);
    expect(storedCultura.descripcion).toBe(itemCulture.descripcion);
  });

  it('should associateCulturasGastronomicasRestaurante update the list of cultures gastronomicas', async () => {
    const newCulture = await culturaGastronomicaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      imagen: faker.image.imageUrl(),
    });

    const result = await service.associateCulturasGastronomicasRestaurante(
      restaurante.id,
      [newCulture],
    );

    expect(result.culturasGastronomicas.length).toBe(1);
    expect(result.culturasGastronomicas[0].id).toBe(newCulture.id);
    expect(result.culturasGastronomicas[0].nombre).toBe(newCulture.nombre);
    expect(result.culturasGastronomicas[0].descripcion).toBe(
      newCulture.descripcion,
    );
  });

  it('should associateCulturasGastronomicasRestaurante throw an error for an invalid restaurante', async () => {
    const newCulture = await culturaGastronomicaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      imagen: faker.image.imageUrl(),
    });

    try {
      await service.associateCulturasGastronomicasRestaurante('999999', [
        newCulture,
      ]);
    } catch (error) {
      expect(error.message).toBe('El restaurante con el id dado no existe');
    }
  });

  it('should associateCulturasGastronomicasRestaurante throw an error for an invalid cultura', async () => {
    const cultura = listCulture[0];
    cultura.id = '999999';
    try {
      await service.associateCulturasGastronomicasRestaurante(restaurante.id, [
        cultura,
      ]);
    } catch (error) {
      expect(error.message).toBe(
        'La cultura gastronomica con el id dado no existe',
      );
    }
  });

  it('dissociateCulturaGastronomicaRestaurante should dissociate a cultura gastronomica from a restaurante', async () => {
    const cultura = listCulture[0];
    await service.dissociateCulturaGastronomicaRestaurante(
      restaurante.id,
      cultura.id,
    );

    const storedRestaurante = await restauranteRepository.findOne({
      where: { id: `${restaurante.id}` },
      relations: ['culturasGastronomicas'],
    });
    const deletedCulture = storedRestaurante.culturasGastronomicas.find(
      (c) => c.id === cultura.id,
    );

    expect(deletedCulture).toBeUndefined();
  });

  it('dissociateCulturaGastronomicaRestaurante should throw an error for an invalid restaurante', async () => {
    const cultura = listCulture[0];
    try {
      await service.dissociateCulturaGastronomicaRestaurante(
        '999999',
        cultura.id,
      );
    } catch (error) {
      expect(error.message).toBe('El restaurante con el id dado no existe');
    }
  });

  it('dissociateCulturaGastronomicaRestaurante should throw an error for an invalid cultura', async () => {
    try {
      await service.dissociateCulturaGastronomicaRestaurante(
        restaurante.id,
        '999999',
      );
    } catch (error) {
      expect(error.message).toBe(
        'La cultura gastronomica con el id dado no existe',
      );
    }
  });

  it('dissociateCulturaGastronomicaRestaurante should throw an error for a cultura not associated to restaurant', async () => {
    const cultura: CulturaGastronomicaEntity =
      await culturaGastronomicaRepository.save({
        nombre: faker.company.name(),
        descripcion: faker.lorem.sentence(),
        imagen: faker.image.imageUrl(),
      });

    try {
      await service.dissociateCulturaGastronomicaRestaurante(
        restaurante.id,
        cultura.id,
      );
    } catch (error) {
      expect(error.message).toBe(
        'La cultura gastronomica con el id dado no esta asociada al restaurante',
      );
    }
  });
});
