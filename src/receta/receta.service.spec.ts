import { Test, TestingModule } from '@nestjs/testing';
import { RecetaService } from './receta.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { RecetaEntity } from './receta.entity';
import { faker } from '@faker-js/faker';
import { CacheModule } from '@nestjs/common';

describe('RecetaService', () => {
  let service: RecetaService;
  let recetaRepository: Repository<RecetaEntity>;
  let recetasList: RecetaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig(), CacheModule.register()],
      providers: [RecetaService],
    }).compile();

    service = module.get<RecetaService>(RecetaService);
    recetaRepository = module.get<Repository<RecetaEntity>>(
      getRepositoryToken(RecetaEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    recetaRepository.clear();
    recetasList = [];
    for (let i = 0; i < 5; i++) {
      const receta: RecetaEntity = await recetaRepository.save({
        nombre: faker.animal.cat(),
        descripcion: faker.lorem.sentence(),
        imageUrl: faker.internet.url(),
        preparacion: faker.lorem.sentence(),
        preparacionUrl: faker.internet.url(),
        culturaGastronomica: null,
      });
      recetasList.push(receta);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll debe retornar todas las recetas', async () => {
    const recetas: RecetaEntity[] = await service.findAll();
    expect(recetas).not.toBeNull();
    expect(recetas).toHaveLength(recetasList.length);
  });

  it('findOne debe retornar una receta por su id', async () => {
    const storedReceta: RecetaEntity = recetasList[0];
    const receta: RecetaEntity = await service.findOne(storedReceta.id);
    expect(receta).not.toBeNull();
    expect(receta.nombre).toEqual(storedReceta.nombre);
    expect(receta.descripcion).toEqual(storedReceta.descripcion);
  });

  it('create debería crear una nueva receta', async () => {
    const receta: RecetaEntity = {
      id: '',
      nombre: faker.animal.cat(),
      descripcion: faker.lorem.sentence(),
      imageUrl: faker.internet.url(),
      preparacion: faker.lorem.sentence(),
      preparacionUrl: faker.internet.url(),
      culturaGastronomica: null,
    };

    const newReceta: RecetaEntity = await service.create(receta);
    expect(newReceta).not.toBeNull();

    const storedReceta: RecetaEntity = await recetaRepository.findOne({
      where: { id: `${newReceta.id}` },
    });
    expect(storedReceta).not.toBeNull();
    expect(storedReceta.nombre).toEqual(newReceta.nombre);
    expect(storedReceta.descripcion).toEqual(newReceta.descripcion);
  });

  it('update debería actualizar una receta', async () => {
    const receta: RecetaEntity = recetasList[3];
    receta.nombre = 'New name';
    receta.descripcion = 'New description';
    const updatedReceta: RecetaEntity = await service.update(receta.id, receta);
    expect(updatedReceta).not.toBeNull();
    const storedReceta: RecetaEntity = await recetaRepository.findOne({
      where: { id: `${receta.id}` },
    });
    expect(storedReceta).not.toBeNull();
    expect(storedReceta.nombre).toEqual(receta.nombre);
    expect(storedReceta.descripcion).toEqual(receta.descripcion);
  });

  it('update debería arrojar error debido a una receta inexistente', async () => {
    let receta: RecetaEntity = recetasList[4];
    receta = {
      ...receta,
      nombre: 'New name',
      descripcion: 'New description',
    };
    await expect(() => service.update('0', receta)).rejects.toHaveProperty(
      'message',
      'La receta con el id brindado no ha sido encontrada.',
    );
  });

  it('delete debería eliminar una receta', async () => {
    const receta: RecetaEntity = recetasList[2];
    await service.delete(receta.id);
    const deletedReceta: RecetaEntity = await recetaRepository.findOne({
      where: { id: `${receta.id}` },
    });
    expect(deletedReceta).toBeNull();
  });

  it('delete debería arrojar un error debido a una receta inexistente', async () => {
    const receta: RecetaEntity = recetasList[0];
    await service.delete(receta.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'La receta con el id brindado no ha sido encontrada.',
    );
  });
});
