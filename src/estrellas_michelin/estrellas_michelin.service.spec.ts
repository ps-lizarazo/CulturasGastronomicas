import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { EstrellasMichelinEntity } from './estrellas_michelin.entity';
import { EstrellasMichelinService } from './estrellas_michelin.service';

describe('EstrellasMichelinService', () => {
  let service: EstrellasMichelinService;
  let repository: Repository<EstrellasMichelinEntity>;
  let estrellasMichelinList: EstrellasMichelinEntity[];

  const fechaConsecucion = new Date();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [EstrellasMichelinService],
    }).compile();

    service = module.get<EstrellasMichelinService>(EstrellasMichelinService);
    repository = module.get<Repository<EstrellasMichelinEntity>>(
      getRepositoryToken(EstrellasMichelinEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    estrellasMichelinList = [];
    for (let i = 0; i < 5; i++) {
      const estrellasMichelin: EstrellasMichelinEntity = await repository.save({
        fechaConsecucion: fechaConsecucion,
      });
      estrellasMichelinList.push(estrellasMichelin);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all Michelin Stars', async () => {
    const result = await service.findAll();
    expect(result).not.toBeNull();
    expect(result).toHaveLength(estrellasMichelinList.length);
  });

  it('should return a Michelin Star by id', async () => {
    const estrellasMichelinAlmacenado: EstrellasMichelinEntity =
      estrellasMichelinList[0];
    const estrellasMichelin = await service.findOne(
      estrellasMichelinAlmacenado.id,
    );
    expect(estrellasMichelin).not.toBeNull();
    expect(estrellasMichelin.fechaConsecucion).toEqual(
      estrellasMichelinAlmacenado.fechaConsecucion,
    );
  });

  it('findOne should throw an exception for an invalid Michelin Star', async () => {
    await expect(() => service.findOne(`0`)).rejects.toHaveProperty(
      'message',
      'La Estrella Michelin con el id dado no existe',
    );
  });

  it('should create a Michelin Star', async () => {
    const fechaConsecucion = new Date();
    const estrellasMichelin: EstrellasMichelinEntity = await service.create({
      id: '',
      restaurante: null,
      fechaConsecucion: fechaConsecucion,
    });
    expect(estrellasMichelin).not.toBeNull();
    expect(estrellasMichelin.fechaConsecucion).toEqual(fechaConsecucion);
  });

  it('should update a Michelin Star', async () => {
    const fechaConsecucion = new Date();
    const estrellasMichelinAlmacenado = estrellasMichelinList[0];
    estrellasMichelinAlmacenado.fechaConsecucion = fechaConsecucion;
    const estrellasMichelin: EstrellasMichelinEntity = await service.update(
      estrellasMichelinAlmacenado.id,
      estrellasMichelinAlmacenado,
    );
    expect(estrellasMichelin).not.toBeNull();
    expect(estrellasMichelin.fechaConsecucion).toEqual(fechaConsecucion);
  });

  it('update should throw an exception for an invalid Michelin Star', async () => {
    let estrellasMichelinAlmacenado = estrellasMichelinList[0];
    estrellasMichelinAlmacenado = {
      ...estrellasMichelinAlmacenado,
      fechaConsecucion: new Date(),
    };
    await expect(() =>
      service.update(`0`, estrellasMichelinAlmacenado),
    ).rejects.toHaveProperty(
      'message',
      'La Estrella Michelin con el id dado no existe',
    );
  });

  it('delete should remove a Michelin Star', async () => {
    const estrellasMichelinAlmacenado = estrellasMichelinList[0];
    await service.delete(estrellasMichelinAlmacenado.id);
    const estrellasMichelinEliminado = await repository.findOne({
      where: { id: `${estrellasMichelinAlmacenado.id}` },
    });
    expect(estrellasMichelinEliminado).toBeNull();
  });

  it('delete should throw an exception for an invalid Michelin Star', async () => {
    await expect(() => service.delete(`0`)).rejects.toHaveProperty(
      'message',
      'La Estrella Michelin con el id dado no existe',
    );
  });
});
