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

    recetasList = [];
    for(let i = 0; i < 5; i++){
        const receta: RecetaEntity = await recetaRepository.save({
          nombre: faker.animal.cat(),
          descripcion: faker.lorem.sentence(),
          imageUrl: faker.internet.url(),
          preparacion: faker.lorem.sentence(),
          preparacionUrl: faker.internet.url()
        })
        recetasList.push(receta);
    }

    culturaGastronomica = await culturaGastronomicaRepository.save({
      nombre: faker.word.adjective(),
      descripcion: faker.lorem.sentence(),
      recetas: [],
      productos: [],
      restaurantes: []
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create debería agregar una receta a una cultura gastronómica', async () => {
    const newCulturaGastronomica: CulturaGastronomicaEntity = await culturaGastronomicaRepository.save({
      nombre: faker.word.adjective(),
      descripcion: faker.lorem.sentence(),
      recetas: [],
      productos: [],
      restaurantes: []
    });

    const receta: RecetaEntity = {
      id: "",
      nombre: faker.animal.cat(),
      descripcion: faker.lorem.sentence(),
      imageUrl: faker.internet.url(),
      preparacion: faker.lorem.sentence(),
      preparacionUrl: faker.internet.url(),
      culturaGastronomica: null
    }

    const newReceta = await service.create(newCulturaGastronomica.id, receta);
    expect(newReceta).not.toBeNull();

    const storedReceta: RecetaEntity = await recetaRepository.findOne({where: { id: `${newReceta.id}` }})
    expect(storedReceta).not.toBeNull();
    expect(storedReceta.nombre).toEqual(newReceta.nombre)
    expect(storedReceta.descripcion).toEqual(newReceta.descripcion)
  });

  it('findAll debería listar todas las recetas de una cultura gastronómica', async () => {
    const newCulturaGastronomica: CulturaGastronomicaEntity = await culturaGastronomicaRepository.save({
      nombre: faker.word.adjective(),
      descripcion: faker.lorem.sentence(),
      recetas: [],
      productos: [],
      restaurantes: []
    });

    recetasList = [];
    for(let i = 0; i < 2; i++){
      const receta: RecetaEntity = await recetaRepository.save({
        nombre: faker.animal.cat(),
        descripcion: faker.lorem.sentence(),
        imageUrl: faker.internet.url(),
        preparacion: faker.lorem.sentence(),
        preparacionUrl: faker.internet.url(),
        culturaGastronomica: newCulturaGastronomica
      })
      recetasList.push(receta);
    }

    const recetas: RecetaEntity[] = await service.findAll(newCulturaGastronomica.id);

    expect(recetas).not.toBeNull();
    expect(recetas).toHaveLength(recetasList.length);
  });
});
