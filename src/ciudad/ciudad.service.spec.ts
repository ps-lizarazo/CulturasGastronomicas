import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { CiudadEntity } from './ciudad.entity';
import { CiudadService } from './ciudad.service';

describe('CiudadService', () => {
  let service: CiudadService;
  let repository: Repository<CiudadEntity>;
  let ciudadList: CiudadEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CiudadService],
    }).compile();

    service = module.get<CiudadService>(CiudadService);
    repository = module.get<Repository<CiudadEntity>>(
      getRepositoryToken(CiudadEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    ciudadList = [];
    for (let i = 0; i < 5; i++) {
      const ciudad: CiudadEntity = await repository.save({
        nombre: `Ciudad ${i}`,
      });
      ciudadList.push(ciudad);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all cities', async () => {
    const result = await service.findAll();
    expect(result).not.toBeNull();
    expect(result).toHaveLength(ciudadList.length);
  });

  it('should return a city by id', async () => {
    const ciudadAlmacenada = ciudadList[0];
    const ciudad = await service.findOne(ciudadAlmacenada.id);
    expect(ciudad).not.toBeNull();
    expect(ciudad.nombre).toEqual(ciudadAlmacenada.nombre);
  });

  it('findOne should throw an exception for an invalid city', async () => {
    await expect(() => service.findOne(`0`)).rejects.toHaveProperty(
      'message',
      'La ciudad con el id dado no existe',
    );
  });

  it('should create a city', async () => {
    const ciudad: CiudadEntity = {
      id: '',
      nombre: 'Ciudad 6',
      restaurantes: [],
      pais: null,
    };

    const ciudadCreada = await service.create(ciudad);
    expect(ciudadCreada).not.toBeNull();
  });

  it('should update a city', async () => {
    const ciudad = ciudadList[0];
    ciudad.nombre = 'Ciudad 0 actualizada';

    const ciudadActualizada = await service.update(ciudad.id, ciudad);
    expect(ciudadActualizada).not.toBeNull();
    const ciudadAlmacenada = await repository.findOne({
      where: { id: ciudad.id },
    });

    expect(ciudadAlmacenada).not.toBeNull();
    expect(ciudadActualizada.nombre).toEqual(ciudad.nombre);
  });

  it('update should throw an exception for an invalid city', async () => {
    const ciudad: CiudadEntity = {
      id: `0`,
      nombre: 'Ciudad 0',
      restaurantes: [],
      pais: null,
    };

    await expect(() => service.update(`0`, ciudad)).rejects.toHaveProperty(
      'message',
      'La ciudad con el id dado no existe',
    );
  });

  it('should delete a city', async () => {
    const ciudadAlmacenada = ciudadList[0];
    await service.delete(ciudadAlmacenada.id);
    const ciudadEliminada = await repository.findOne({
      where: { id: ciudadAlmacenada.id },
    });
    expect(ciudadEliminada).toBeNull();
  });

  it('delete should throw an exception for an invalid city', async () => {
    await expect(() => service.delete(`0`)).rejects.toHaveProperty(
      'message',
      'La ciudad con el id dado no existe',
    );
  });
});
