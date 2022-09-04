import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { PaisEntity } from './pais.entity';
import { PaisService } from './pais.service';

describe('PaisService', () => {
  let service: PaisService;
  let repository: Repository<PaisEntity>;
  let paisList: PaisEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PaisService],
    }).compile();

    service = module.get<PaisService>(PaisService);
    repository = module.get<Repository<PaisEntity>>(
      getRepositoryToken(PaisEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    paisList = [];
    for (let i = 0; i < 5; i++) {
      const pais: PaisEntity = await repository.save({
        nombre: `Pais ${i}`,
      });
      paisList.push(pais);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all countries', async () => {
    const result = await service.findAll();
    expect(result).not.toBeNull();
    expect(result).toHaveLength(paisList.length);
  });

  it('should return a country by id', async () => {
    const paisAlmacenado: PaisEntity = paisList[0];
    const pais = await service.findOne(paisAlmacenado.id);
    expect(pais).not.toBeNull();
    expect(pais.nombre).toEqual(paisAlmacenado.nombre);
  });

  it('findOne should throw an exception for an invalid country', async () => {
    await expect(() => service.findOne(`0`)).rejects.toHaveProperty(
      'message',
      'El pais con el id dado no existe',
    );
  });

  it('should create a country', async () => {
    const pais: PaisEntity = await service.create({
      id: '',
      ciudades: [],
      culturasGastronomicas: [],
      nombre: 'Pais nuevo',
    });
    expect(pais).not.toBeNull();
    expect(pais.nombre).toEqual('Pais nuevo');
  });

  it('should update a country', async () => {
    const paisAlmacenado = paisList[0];
    paisAlmacenado.nombre = 'Pais modificado';
    const pais: PaisEntity = await service.update(
      paisAlmacenado.id,
      paisAlmacenado,
    );
    expect(pais).not.toBeNull();
    expect(pais.nombre).toEqual('Pais modificado');
  });

  it('update should throw an exception for an invalid country', async () => {
    let paisAlmacenado = paisList[0];
    paisAlmacenado = {
      ...paisAlmacenado,
      nombre: 'Pais actualizado',
    };
    await expect(() =>
      service.update(`0`, paisAlmacenado),
    ).rejects.toHaveProperty('message', 'El pais con el id dado no existe');
  });

  it('delete should remove a country', async () => {
    const paisAlmacenado = paisList[0];
    await service.delete(paisAlmacenado.id);
    const paisEliminado = await repository.findOne({
      where: { id: paisAlmacenado.id },
    });
    expect(paisEliminado).toBeNull();
  });

  it('delete should throw an exception for an invalid country', async () => {
    await expect(() => service.delete(`0`)).rejects.toHaveProperty(
      'message',
      'El pais con el id dado no existe',
    );
  });
});
