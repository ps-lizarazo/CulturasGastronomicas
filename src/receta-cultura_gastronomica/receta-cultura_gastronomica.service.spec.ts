import { Test, TestingModule } from '@nestjs/testing';
import { RecetaCulturaGastronomicaService } from './receta-cultura_gastronomica.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { CulturaGastronomicaEntity } from '../cultura_gastronomica/cultura_gastronomica.entity';
import { RecetaEntity } from '../receta/receta.entity';
import { faker } from '@faker-js/faker';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/common';

describe('RecetaCulturaGastronomicaService', () => {
  let service: RecetaCulturaGastronomicaService;
  let culturaGastronomicaRepository: Repository<CulturaGastronomicaEntity>;
  let recetaRepository: Repository<RecetaEntity>;
  let culturaGastronomica: CulturaGastronomicaEntity;
  let recetaList: RecetaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig(), CacheModule.register()],
      providers: [RecetaCulturaGastronomicaService],
    }).compile();

    service = module.get<RecetaCulturaGastronomicaService>(
      RecetaCulturaGastronomicaService,
    );
    culturaGastronomicaRepository = module.get<
      Repository<CulturaGastronomicaEntity>
    >(getRepositoryToken(CulturaGastronomicaEntity));
    recetaRepository = module.get<Repository<RecetaEntity>>(
      getRepositoryToken(RecetaEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    recetaRepository.clear();
    culturaGastronomicaRepository.clear();

    culturaGastronomica = await culturaGastronomicaRepository.save({
      nombre: faker.word.adjective(),
      descripcion: faker.lorem.sentence(),
      recetas: [],
      productos: [],
      restaurantes: [],
    });

    recetaList = [];
    for (let i = 0; i < 5; i++) {
      const receta: RecetaEntity = await recetaRepository.save({
        nombre: faker.animal.cat(),
        descripcion: faker.lorem.sentence(),
        imageUrl: faker.internet.url(),
        preparacion: faker.lorem.sentence(),
        preparacionUrl: faker.internet.url(),
        culturaGastronomica: culturaGastronomica,
      });
      recetaList.push(receta);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addRecetaCulturaGastronomica debe agregar una receta a una cultura gastronómica', async () => {
    const newReceta: RecetaEntity = await recetaRepository.save({
      nombre: faker.animal.cat(),
      descripcion: faker.lorem.sentence(),
      imageUrl: faker.internet.url(),
      preparacion: faker.lorem.sentence(),
      preparacionUrl: faker.internet.url(),
      culturaGastronomica: null,
    });

    const result: CulturaGastronomicaEntity =
      await service.addRecetaCulturaGastronomica(
        culturaGastronomica.id,
        newReceta.id,
      );

    expect(result.recetas.length).toBe(6);
    expect(result.recetas[5]).not.toBeNull();
    expect(result.recetas[5].nombre).toBe(newReceta.nombre);
    expect(result.recetas[5].descripcion).toBe(newReceta.descripcion);
  });

  it('addRecetaCulturaGastronomica debe lanzar una execpcion debido a una receta inexistente', async () => {
    await expect(() =>
      service.addRecetaCulturaGastronomica(culturaGastronomica.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'La receta con el id brindado no ha sido encontrada.',
    );
  });

  it('addRecetaCulturaGastronomica Debe agregar una exepcion por una cultura gastronómica invalida', async () => {
    const newReceta: RecetaEntity = await recetaRepository.save({
      nombre: faker.animal.cat(),
      descripcion: faker.lorem.sentence(),
      imageUrl: faker.internet.url(),
      preparacion: faker.lorem.sentence(),
      preparacionUrl: faker.internet.url(),
      culturaGastronomica: null,
    });

    await expect(() =>
      service.addRecetaCulturaGastronomica('0', newReceta.id),
    ).rejects.toHaveProperty(
      'message',
      'La cultura gastronómica con el id brindado no ha sido encontrada.',
    );
  });

  it('findRecetaByCulturaGastronomicaIdRecetaId debe retornar una receta por id de cultura gastronómica y id de receta', async () => {
    const newReceta: RecetaEntity = await recetaRepository.save({
      nombre: faker.animal.cat(),
      descripcion: faker.lorem.sentence(),
      imageUrl: faker.internet.url(),
      preparacion: faker.lorem.sentence(),
      preparacionUrl: faker.internet.url(),
      culturaGastronomica: culturaGastronomica,
    });

    const storedReceta: RecetaEntity =
      await service.findRecetaByCulturaGastronomicaIdRecetaId(
        culturaGastronomica.id,
        newReceta.id,
      );
    expect(storedReceta).not.toBeNull();
    expect(storedReceta.nombre).toBe(newReceta.nombre);
    expect(storedReceta.descripcion).toBe(newReceta.descripcion);
  });

  it('findRecetaByCulturaGastronomicaIdRecetaId debe lanzar una excepcion por una receta invalida', async () => {
    await expect(() =>
      service.findRecetaByCulturaGastronomicaIdRecetaId(
        culturaGastronomica.id,
        '0',
      ),
    ).rejects.toHaveProperty(
      'message',
      'La receta con el id brindado no ha sido encontrada.',
    );
  });

  it('findRecetaByCulturaGastronomicaIdRecetaId  Debe agregar una execpcion por una categoria invalida', async () => {
    const receta: RecetaEntity = recetaList[0];
    await expect(() =>
      service.findRecetaByCulturaGastronomicaIdRecetaId('0', receta.id),
    ).rejects.toHaveProperty(
      'message',
      'La cultura gastronómica con el id brindado no ha sido encontrada.',
    );
  });

  it('findRecetaByCulturaGastronomicaIdRecetaId Debe lanzar una escepcion para un producto no asociado a la cultura gastronómica', async () => {
    const otherCulturaGastronomica: CulturaGastronomicaEntity =
      await culturaGastronomicaRepository.save({
        nombre: faker.word.adjective(),
        descripcion: faker.lorem.sentence(),
        recetas: [],
        productos: [],
        restaurantes: [],
      });

    await expect(() =>
      service.findRecetaByCulturaGastronomicaIdRecetaId(
        otherCulturaGastronomica.id,
        recetaList[0].id,
      ),
    ).rejects.toHaveProperty(
      'message',
      'La receta con el id brindado no pertenece a la cultura gastrónomica dada por su id.',
    );
  });

  it('findRecetasByCulturaGastronomicaId Debe retornar las recetas por cultura gastronómica', async () => {
    const recetas: RecetaEntity[] =
      await service.findRecetasByCulturaGastronomicaId(culturaGastronomica.id);
    expect(recetas.length).toBe(5);
  });

  it('findRecetasByCulturaGastronomicaId  Debe agregar una execpcion por una cultura gastronómica invalida', async () => {
    await expect(() =>
      service.findRecetasByCulturaGastronomicaId('0'),
    ).rejects.toHaveProperty(
      'message',
      'La cultura gastronómica con el id brindado no ha sido encontrada.',
    );
  });

  it('associateRecetasCulturaGastronomica Debe actualizar la lista de productos para una categoria', async () => {
    const newReceta: RecetaEntity = await recetaRepository.save({
      nombre: faker.animal.cat(),
      descripcion: faker.lorem.sentence(),
      imageUrl: faker.internet.url(),
      preparacion: faker.lorem.sentence(),
      preparacionUrl: faker.internet.url(),
      culturaGastronomica: null,
    });

    const updatedCategoria: CulturaGastronomicaEntity =
      await service.associateRecetasCulturaGastronomica(
        culturaGastronomica.id,
        [newReceta],
      );
    expect(updatedCategoria.recetas.length).toBe(1);

    expect(updatedCategoria.recetas[0].nombre).toBe(newReceta.nombre);
    expect(updatedCategoria.recetas[0].descripcion).toBe(newReceta.descripcion);
  });

  it('associateRecetasCulturaGastronomica  Debe agregar una execpcion por una cultura gastronómica invalida', async () => {
    const newReceta: RecetaEntity = await recetaRepository.save({
      nombre: faker.animal.cat(),
      descripcion: faker.lorem.sentence(),
      imageUrl: faker.internet.url(),
      preparacion: faker.lorem.sentence(),
      preparacionUrl: faker.internet.url(),
      culturaGastronomica: culturaGastronomica,
    });

    await expect(() =>
      service.associateRecetasCulturaGastronomica('0', [newReceta]),
    ).rejects.toHaveProperty(
      'message',
      'La cultura gastronómica con el id brindado no ha sido encontrada.',
    );
  });

  it('associateRecetasCulturaGastronomica Debe lanzar una execpcion para una receta no valida', async () => {
    const newReceta: RecetaEntity = recetaList[0];
    newReceta.id = '0';

    await expect(() =>
      service.associateRecetasCulturaGastronomica(culturaGastronomica.id, [
        newReceta,
      ]),
    ).rejects.toHaveProperty(
      'message',
      'La receta con el id brindado no ha sido encontrada.',
    );
  });

  it('deleteRecetaCulturaGastronomica Debe remover la receta de una cultura gastronómica', async () => {
    const receta: RecetaEntity = recetaList[0];

    await service.deleteRecetaCulturaGastronomica(
      culturaGastronomica.id,
      receta.id,
    );

    const storedCulturaGastronomica: CulturaGastronomicaEntity =
      await culturaGastronomicaRepository.findOne({
        where: { id: culturaGastronomica.id },
        relations: ['recetas'],
      });
    const deletedReceta: RecetaEntity = storedCulturaGastronomica.recetas.find(
      (a) => a.id === receta.id,
    );

    expect(deletedReceta).toBeUndefined();
  });

  it('deleteRecetaCulturaGastronomica Debe lanzar una execpcion para un receta no valida', async () => {
    await expect(() =>
      service.deleteRecetaCulturaGastronomica(culturaGastronomica.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'La receta con el id brindado no ha sido encontrada.',
    );
  });

  it('deleteRecetaCulturaGastronomica Debe lanzar una execpcion para una cultura gastronómica no valida', async () => {
    const receta: RecetaEntity = recetaList[0];
    await expect(() =>
      service.deleteRecetaCulturaGastronomica('0', receta.id),
    ).rejects.toHaveProperty(
      'message',
      'La cultura gastronómica con el id brindado no ha sido encontrada.',
    );
  });

  it('deleteRecetaCulturaGastronomica Debe lanzar una excepcion para un producto no asociado', async () => {
    const otherCulturaGastronomica: CulturaGastronomicaEntity =
      await culturaGastronomicaRepository.save({
        nombre: faker.word.adjective(),
        descripcion: faker.lorem.sentence(),
        recetas: [],
        productos: [],
        restaurantes: [],
      });

    await expect(() =>
      service.deleteRecetaCulturaGastronomica(
        otherCulturaGastronomica.id,
        recetaList[0].id,
      ),
    ).rejects.toHaveProperty(
      'message',
      'La receta con el id brindado no pertenece a la cultura gastrónomica dada por su id.',
    );
  });
});
