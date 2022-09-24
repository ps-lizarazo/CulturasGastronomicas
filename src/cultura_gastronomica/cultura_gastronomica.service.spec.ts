import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { CulturaGastronomicaEntity } from './cultura_gastronomica.entity';
import { CulturaGastronomicaService } from './cultura_gastronomica.service';
import { faker } from '@faker-js/faker';
import { CacheModule } from '@nestjs/common';

describe('CulturaGastronomicaService', () => {
  let service: CulturaGastronomicaService;
  let repository: Repository<CulturaGastronomicaEntity>;
  let culturaGastronomicasList: CulturaGastronomicaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig(), CacheModule.register()],
      providers: [CulturaGastronomicaService],
    }).compile();

    service = module.get<CulturaGastronomicaService>(
      CulturaGastronomicaService,
    );
    repository = module.get<Repository<CulturaGastronomicaEntity>>(
      getRepositoryToken(CulturaGastronomicaEntity),
    );
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const seedDatabase = async () => {
    repository.clear();
    culturaGastronomicasList = [];
    for (let i = 0; i < 5; i++) {
      const culturaGastronomica: CulturaGastronomicaEntity =
        await repository.save({
          nombre: faker.word.adjective(),
          descripcion: faker.lorem.sentence(),
          recetas: [],
          productos: [],
          restaurantes: [],
        });
      culturaGastronomicasList.push(culturaGastronomica);
    }
  };

  it('findAll debe retornar todas las culturas gastronómicas', async () => {
    const culturasGastronomicas: CulturaGastronomicaEntity[] =
      await service.findAll();
    expect(culturasGastronomicas).not.toBeNull();
    expect(culturasGastronomicas).toHaveLength(culturaGastronomicasList.length);
  });

  it('findOne debe retornar una cultura gastronómica por su id', async () => {
    const storedCulturaGastronomica: CulturaGastronomicaEntity =
      culturaGastronomicasList[0];
    const culturaGastronomica: CulturaGastronomicaEntity =
      await service.findOne(storedCulturaGastronomica.id);
    expect(culturaGastronomica).not.toBeNull();
    expect(culturaGastronomica.nombre).toEqual(
      storedCulturaGastronomica.nombre,
    );
    expect(culturaGastronomica.descripcion).toEqual(
      storedCulturaGastronomica.descripcion,
    );
  });

  it('findOne debe arrojar una excepción debido a una cultura gastronómica inexistente', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'La cultura gastronómica con el id brindado no ha sido encontrada.',
    );
  });

  it('create debería crear una nueva cultura gastronómica', async () => {
    const culturaGastronomica: CulturaGastronomicaEntity = {
      id: '',
      nombre: faker.word.adjective(),
      descripcion: faker.lorem.sentence(),
      recetas: [],
      productos: [],
      restaurantes: [],
      paises: [],
    };

    const newCulturaGastronomica: CulturaGastronomicaEntity =
      await service.create(culturaGastronomica);
    expect(newCulturaGastronomica).not.toBeNull();

    const storedCulturaGastronomica: CulturaGastronomicaEntity =
      await repository.findOne({
        where: { id: `${newCulturaGastronomica.id}` },
      });
    expect(storedCulturaGastronomica).not.toBeNull();
    expect(storedCulturaGastronomica.nombre).toEqual(
      newCulturaGastronomica.nombre,
    );
    expect(storedCulturaGastronomica.descripcion).toEqual(
      newCulturaGastronomica.descripcion,
    );
  });

  it('update debería actualizar una cultura gastronómica', async () => {
    const culturaGastronomica: CulturaGastronomicaEntity =
      culturaGastronomicasList[3];
    culturaGastronomica.nombre = 'New name';
    culturaGastronomica.descripcion = 'New description';
    const updatedCulturaGastronomica: CulturaGastronomicaEntity =
      await service.update(culturaGastronomica.id, culturaGastronomica);
    expect(updatedCulturaGastronomica).not.toBeNull();
    const storedCulturaGastronomica: CulturaGastronomicaEntity =
      await repository.findOne({ where: { id: `${culturaGastronomica.id}` } });
    expect(storedCulturaGastronomica).not.toBeNull();
    expect(storedCulturaGastronomica.nombre).toEqual(
      culturaGastronomica.nombre,
    );
    expect(storedCulturaGastronomica.descripcion).toEqual(
      culturaGastronomica.descripcion,
    );
  });

  it('update debería arrojar error debido a una cultura gastronómica inexistente', async () => {
    let culturaGastronomica: CulturaGastronomicaEntity =
      culturaGastronomicasList[4];
    culturaGastronomica = {
      ...culturaGastronomica,
      nombre: 'New name',
      descripcion: 'New description',
    };
    await expect(() =>
      service.update('0', culturaGastronomica),
    ).rejects.toHaveProperty(
      'message',
      'La cultura gastronómica con el id brindado no ha sido encontrada.',
    );
  });

  it('delete debería eliminar una cultura gastronómica', async () => {
    const culturaGastronomica: CulturaGastronomicaEntity =
      culturaGastronomicasList[2];
    await service.delete(culturaGastronomica.id);
    const deletedCulturaGastronomica: CulturaGastronomicaEntity =
      await repository.findOne({ where: { id: `${culturaGastronomica.id}` } });
    expect(deletedCulturaGastronomica).toBeNull();
  });

  it('delete debería arrojar un error debido a una cultura gastronómica inexistente', async () => {
    const culturaGastronomica: CulturaGastronomicaEntity =
      culturaGastronomicasList[0];
    await service.delete(culturaGastronomica.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'La cultura gastronómica con el id brindado no ha sido encontrada.',
    );
  });
});
