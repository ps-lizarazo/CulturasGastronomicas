import { Test, TestingModule } from '@nestjs/testing';
import { RecetaService } from './receta.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config'
import { RecetaEntity } from './receta.entity'
import { faker } from '@faker-js/faker';
import { CulturaGastronomicaEntity } from '../cultura_gastronomica/cultura_gastronomica.entity';

describe('RecetaService', () => {
  let service: RecetaService;
  let recetaRepository: Repository<RecetaEntity>;
  let culturaGastronomicaRepository: Repository<CulturaGastronomicaEntity>;
  let culturaGastronomica: CulturaGastronomicaEntity;
  let receta: RecetaEntity;
  let recetasList: RecetaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [RecetaService],
    }).compile();

    service = module.get<RecetaService>(RecetaService);
    recetaRepository = module.get<Repository<RecetaEntity>>(getRepositoryToken(RecetaEntity));
    culturaGastronomicaRepository = module.get<Repository<CulturaGastronomicaEntity>>(getRepositoryToken(CulturaGastronomicaEntity));

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
      restaurantes: []
    })

    receta = await recetaRepository.save({
      nombre: faker.animal.cat(),
      descripcion: faker.lorem.sentence(),
      imageUrl: faker.internet.url(),
      preparacion: faker.lorem.sentence(),
      preparacionUrl: faker.internet.url(),
      culturaGastronomica: culturaGastronomica
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create debería agregar una receta a una cultura gastronómica', async () => {
    const recetaParams: RecetaEntity = {
      id: "",
      nombre: faker.animal.cat(),
      descripcion: faker.lorem.sentence(),
      imageUrl: faker.internet.url(),
      preparacion: faker.lorem.sentence(),
      preparacionUrl: faker.internet.url(),
      culturaGastronomica: null
    }

    const newReceta = await service.create(culturaGastronomica.id, recetaParams);
    expect(newReceta).not.toBeNull();

    const storedReceta: RecetaEntity = await recetaRepository.findOne({where: { id: `${newReceta.id}` }})
    expect(storedReceta).not.toBeNull();
    expect(storedReceta.nombre).toEqual(newReceta.nombre)
    expect(storedReceta.descripcion).toEqual(newReceta.descripcion)
  });

  it('create debería agregar arrojar error debido a cultura gastronómica inexistente', async () => {
    const recetaParams: RecetaEntity = {
      id: "",
      nombre: faker.animal.cat(),
      descripcion: faker.lorem.sentence(),
      imageUrl: faker.internet.url(),
      preparacion: faker.lorem.sentence(),
      preparacionUrl: faker.internet.url(),
      culturaGastronomica: null
    }

    await expect(() => service.create("0", recetaParams)).rejects.toHaveProperty("message", "La cultura gastronómica con el id brindado no ha sido encontrada.")
  });

  it('findAll debería listar todas las recetas de una cultura gastronómica', async () => {
    recetasList = [];
    for(let i = 0; i < 2; i++){
      const receta: RecetaEntity = await recetaRepository.save({
        nombre: faker.animal.cat(),
        descripcion: faker.lorem.sentence(),
        imageUrl: faker.internet.url(),
        preparacion: faker.lorem.sentence(),
        preparacionUrl: faker.internet.url(),
        culturaGastronomica: culturaGastronomica
      })
      recetasList.push(receta);
    }

    const recetas: RecetaEntity[] = await service.findAll(culturaGastronomica.id);

    expect(recetas).not.toBeNull();
    expect(recetas).toHaveLength(recetasList.length + 1);
  });

  it('findAll debería arrojar error al buscar recetas de una cultura gastronómica inexistente', async () => {
    recetasList = [];
    for(let i = 0; i < 2; i++){
      let receta: RecetaEntity = await recetaRepository.save({
        nombre: faker.animal.cat(),
        descripcion: faker.lorem.sentence(),
        imageUrl: faker.internet.url(),
        preparacion: faker.lorem.sentence(),
        preparacionUrl: faker.internet.url(),
        culturaGastronomica: culturaGastronomica
      })
      recetasList.push(receta);
    }

    await expect(() => service.findAll("0")).rejects.toHaveProperty("message", "La cultura gastronómica con el id brindado no ha sido encontrada.")
  });

  it('findOne debería retornar una receta indicada por su id', async () => {
    const storedReceta: RecetaEntity = await service.findOne(culturaGastronomica.id, receta.id);

    expect(storedReceta).not.toBeNull();
    expect(storedReceta.nombre).toEqual(receta.nombre);
    expect(storedReceta.descripcion).toEqual(receta.descripcion);
    expect(storedReceta.imageUrl).toEqual(receta.imageUrl);
    expect(storedReceta.preparacion).toEqual(receta.preparacion);
    expect(storedReceta.preparacionUrl).toEqual(receta.preparacionUrl);
  });

  it('findOne debería arrojar error debido a una receta inexistente', async () => {
    await expect(() => service.findOne(culturaGastronomica.id, "0")).rejects.toHaveProperty("message", "La receta con el id brindado no ha sido encontrada.")
  });

  it('findOne debería arrojar error debido a una cultura gastronómica inexistente', async () => {
    await expect(() => service.findOne("0", receta.id)).rejects.toHaveProperty("message", "La cultura gastronómica con el id brindado no ha sido encontrada.")
  });

  it('findOne debería arrojar error debido a que la receta no pertenece a la cultura gastronómica', async () => {
    const otherCulturaGastronomica: CulturaGastronomicaEntity = await culturaGastronomicaRepository.save({
      nombre: faker.word.adjective(),
      descripcion: faker.lorem.sentence(),
      recetas: [],
      productos: [],
      restaurantes: []
    })
    
    await expect(() => service.findOne(otherCulturaGastronomica.id, receta.id)).rejects.toHaveProperty("message", "La receta con el id brindado no pertenece a la cultura gastrónomica dada por su id.")
  });

  it('update debería actualizar una receta', async () => {
    receta = {
      ...receta, nombre: "Ceviche", descripcion: "Nueva receta moderna."
    }

    const updatedReceta: RecetaEntity = await service.update(culturaGastronomica.id, receta.id, receta);
    expect(updatedReceta).not.toBeNull();
    const storedReceta: RecetaEntity = await recetaRepository.findOne({ where: { id: `${receta.id}` } })
    expect(storedReceta).not.toBeNull();
    expect(storedReceta.nombre).toEqual(receta.nombre)
    expect(storedReceta.descripcion).toEqual(receta.descripcion)
  });

  it('update debería arrojar error debido a cultura gastronómica inexistente', async () => {
    receta = {
      ...receta, nombre: "Ceviche", descripcion: "Nueva receta moderna."
    }

    await expect(() => service.update("0", receta.id, receta)).rejects.toHaveProperty("message", "La cultura gastronómica con el id brindado no ha sido encontrada.")
  });

  it('update debería arrojar error debido a receta inexistente', async () => {
    receta = {
      ...receta, nombre: "Ceviche", descripcion: "Nueva receta moderna."
    }

    await expect(() => service.update(culturaGastronomica.id, "0", receta)).rejects.toHaveProperty("message", "La receta con el id brindado no ha sido encontrada.")
  });

  it('update debería arrojar error debido a que la receta no pertenece a la cultura gastronómica', async () => {
    const otherCulturaGastronomica: CulturaGastronomicaEntity = await culturaGastronomicaRepository.save({
      nombre: faker.word.adjective(),
      descripcion: faker.lorem.sentence(),
      recetas: [],
      productos: [],
      restaurantes: []
    })

    receta = {
      ...receta, nombre: "Ceviche", descripcion: "Nueva receta moderna."
    }

    await expect(() => service.update(otherCulturaGastronomica.id, receta.id, receta)).rejects.toHaveProperty("message", "La receta con el id brindado no pertenece a la cultura gastrónomica dada por su id.")
  });

  it('delete debería eliminar una receta', async () => {
    await service.delete(culturaGastronomica.id, receta.id);
    const deletedReceta: RecetaEntity = await recetaRepository.findOne({ where: { id: `${receta.id}` } })
    expect(deletedReceta).toBeNull();
  });

  it('delete debería arrojar un error debido a una cultura gastronómica inexistente', async () => {
    await expect(() => service.delete("0", receta.id)).rejects.toHaveProperty("message", "La cultura gastronómica con el id brindado no ha sido encontrada.")
  });

  it('delete debería arrojar un error debido a una receta inexistente', async () => {
    await expect(() => service.delete(culturaGastronomica.id, "0")).rejects.toHaveProperty("message", "La receta con el id brindado no ha sido encontrada.")
  });

  it('delete debería arrojar un error debido a que la receta no pertenece a la cultura gastronómica', async () => {
    const otherCulturaGastronomica: CulturaGastronomicaEntity = await culturaGastronomicaRepository.save({
      nombre: faker.word.adjective(),
      descripcion: faker.lorem.sentence(),
      recetas: [],
      productos: [],
      restaurantes: []
    })

    await expect(() => service.delete(otherCulturaGastronomica.id, receta.id)).rejects.toHaveProperty("message", "La receta con el id brindado no pertenece a la cultura gastrónomica dada por su id.")
  });
});
