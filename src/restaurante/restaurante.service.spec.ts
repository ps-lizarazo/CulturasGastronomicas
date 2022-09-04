import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { RestauranteEntity } from './restaurante.entity';
import { RestauranteService } from './restaurante.service';

describe('RestauranteService', () => {
  let service: RestauranteService;
  let repository: Repository<RestauranteEntity>;
  let restauranteList: RestauranteEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [RestauranteService],
    }).compile();

    service = module.get<RestauranteService>(RestauranteService);
    repository = module.get<Repository<RestauranteEntity>>(
      getRepositoryToken(RestauranteEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    restauranteList = [];
    for (let i = 0; i < 5; i++) {
      const restaurante: RestauranteEntity = await repository.save({
        nombre: `Restaurante ${i}`,
      });
      restauranteList.push(restaurante);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all restaurants', async () => {
    const result = await service.findAll();
    expect(result).not.toBeNull();
    expect(result).toHaveLength(restauranteList.length);
  });

  it('should return a restaurant by id', async () => {
    const restauranteAlmacenado: RestauranteEntity = restauranteList[0];
    const restaurante = await service.findOne(restauranteAlmacenado.id);
    expect(restaurante).not.toBeNull();
    expect(restaurante.nombre).toEqual(restauranteAlmacenado.nombre);
  });

  it('findOne should throw an exception for an invalid restaurant', async () => {
    await expect(() => service.findOne(`0`)).rejects.toHaveProperty(
      'message',
      'El restaurante con el id dado no existe',
    );
  });

  it('should create a restaurant', async () => {
    const restaurante: RestauranteEntity = await service.create({
      id: '',
      ciudad: null,
      culturasGastronomicas: [],
      estrellasMichelin: [],
      nombre: 'Restaurante nuevo',
    });
    expect(restaurante).not.toBeNull();
    expect(restaurante.nombre).toEqual('Restaurante nuevo');
  });

  it('should update a restaurant', async () => {
    const restauranteAlmacenado = restauranteList[0];
    restauranteAlmacenado.nombre = 'Restaurante modificado';
    const restaurante: RestauranteEntity = await service.update(
      restauranteAlmacenado.id,
      restauranteAlmacenado,
    );
    expect(restaurante).not.toBeNull();
    expect(restaurante.nombre).toEqual('Restaurante modificado');
  });

  it('update should throw an exception for an invalid restaurant', async () => {
    let restauranteAlmacenado = restauranteList[0];
    restauranteAlmacenado = {
      ...restauranteAlmacenado,
      nombre: 'Restaurante actualizado',
    };
    await expect(() =>
      service.update(`0`, restauranteAlmacenado),
    ).rejects.toHaveProperty(
      'message',
      'El restaurante con el id dado no existe',
    );
  });

  it('delete should remove a restaurant', async () => {
    const restauranteAlmacenado = restauranteList[0];
    await service.delete(restauranteAlmacenado.id);
    const restauranteEliminado = await repository.findOne({
      where: { id: `${restauranteAlmacenado.id}` },
    });
    expect(restauranteEliminado).toBeNull();
  });

  it('delete should throw an exception for an invalid restaurant', async () => {
    await expect(() => service.delete(`0`)).rejects.toHaveProperty(
      'message',
      'El restaurante con el id dado no existe',
    );
  });
});
