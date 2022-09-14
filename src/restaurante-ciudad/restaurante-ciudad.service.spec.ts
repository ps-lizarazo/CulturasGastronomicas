import { Test, TestingModule } from '@nestjs/testing';
import { CiudadEntity } from '../ciudad/ciudad.entity';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RestauranteCiudadService } from './restaurante-ciudad.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';

describe('RestauranteCiudadService', () => {
  let service: RestauranteCiudadService;
  let restauranteRepository: Repository<RestauranteEntity>;
  let ciudadRepository: Repository<CiudadEntity>;
  let restaurante: RestauranteEntity;
  let ciudad: CiudadEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [RestauranteCiudadService],
    }).compile();

    service = module.get<RestauranteCiudadService>(RestauranteCiudadService);
    restauranteRepository = module.get(getRepositoryToken(RestauranteEntity));
    ciudadRepository = module.get(getRepositoryToken(CiudadEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    restauranteRepository.clear();
    ciudadRepository.clear();

    //create ciudads
    ciudad = await ciudadRepository.save({
      nombre: `ciudad`,
    });

    //create restaurante
    restaurante = await restauranteRepository.save({
      nombre: 'restaurante',
      ciudad: ciudad,
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should associate a City to a Restaurant', async () => {
    const city = await ciudadRepository.save({
      nombre: faker.company.name(),
    });

    const restaurante = await restauranteRepository.save({
      nombre: faker.lorem.sentence(),
    });

    const result = await service.associateCiudadRestaurante(
      restaurante.id,
      city.id,
    );

    expect(result.ciudad).not.toBeNull();
    expect(result.ciudad.id).toBe(city.id);
    expect(result.ciudad.nombre).toBe(city.nombre);
  });

  it('associate should thow an error for an invalid City', async () => {
    const restaurante = await restauranteRepository.save({
      nombre: faker.lorem.sentence(),
    });

    try {
      await service.associateCiudadRestaurante(restaurante.id, '999999');
    } catch (error) {
      expect(error.message).toBe('La ciudad con el id dado no existe');
    }
  });

  it('associate should thow an error for an invalid Restaurante', async () => {
    const culture = await ciudadRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      imagen: faker.image.imageUrl(),
    });

    try {
      await service.associateCiudadRestaurante('999999', culture.id);
    } catch (error) {
      expect(error.message).toBe('El restaurante con el id dado no existe');
    }
  });

  it('should findCiudadInRestaurante', async () => {
    const storedCity = await service.findCiudadInRestaurante(
      restaurante.id,
      ciudad.id,
    );

    expect(storedCity).not.toBeNull();
    expect(storedCity.id).toBe(ciudad.id);
    expect(storedCity.nombre).toBe(ciudad.nombre);
  });

  it('should findCiudadInRestaurante throw an error for an invalid restaurante', async () => {
    try {
      await service.findCiudadInRestaurante('999999', ciudad.id);
    } catch (error) {
      expect(error.message).toBe('El restaurante con el id dado no existe');
    }
  });

  it('should findCiudadInRestaurante throw an error for an invalid ciudad', async () => {
    try {
      await service.findCiudadInRestaurante(restaurante.id, '999999');
    } catch (error) {
      expect(error.message).toBe('La ciudad con el id dado no existe');
    }
  });

  it('should findCiudadInRestaurante throw an error for a ciudad not associated to restaurante', async () => {
    const ciudad: CiudadEntity = await ciudadRepository.save({
      nombre: faker.company.name(),
    });

    try {
      await service.findCiudadInRestaurante(restaurante.id, ciudad.id);
    } catch (error) {
      expect(error.message).toBe(
        'La ciudad con el id dado no esta asociada al restaurante',
      );
    }
  });

  it('dissociateCiudadRestaurante should dissociate a ciudad from a restaurante', async () => {
    await service.dissociateCiudadRestaurante(restaurante.id, ciudad.id);
    const storedRestaurante = await restauranteRepository.findOne({
      where: { id: `${restaurante.id}` },
      relations: ['ciudad', 'culturasGastronomicas', 'estrellasMichelin'],
    });
    const deletedCity = storedRestaurante.ciudad;
    expect(deletedCity).toBeNull();
  });

  it('dissociateCiudadRestaurante should throw an error for an invalid restaurante', async () => {
    try {
      await service.dissociateCiudadRestaurante('999999', ciudad.id);
    } catch (error) {
      expect(error.message).toBe('El restaurante con el id dado no existe');
    }
  });

  it('dissociateCiudadRestaurante should throw an error for an invalid ciudad', async () => {
    try {
      await service.dissociateCiudadRestaurante(restaurante.id, '999999');
    } catch (error) {
      expect(error.message).toBe('La ciudad con el id dado no existe');
    }
  });

  it('dissociateCiudadRestaurante should throw an error for a ciudad not associated to restaurant', async () => {
    const ciudad: CiudadEntity = await ciudadRepository.save({
      nombre: faker.company.name(),
    });

    try {
      await service.dissociateCiudadRestaurante(restaurante.id, ciudad.id);
    } catch (error) {
      expect(error.message).toBe(
        'La ciudad con el id dado no esta asociada al restaurante',
      );
    }
  });
});
