import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { CategoriaEntity } from './categoria.entity';
import { CategoriaService } from './categoria.service';

import { faker } from '@faker-js/faker';

describe('CategoriaService', () => {
  let service: CategoriaService;
  let repository: Repository<CategoriaEntity>;
  let categoriaList: CategoriaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CategoriaService],
    }).compile();

    service = module.get<CategoriaService>(CategoriaService);
    repository = module.get<Repository<CategoriaEntity>>(
      getRepositoryToken(CategoriaEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    categoriaList = [];
    for (let i = 0; i < 5; i++) {
      const categoria: CategoriaEntity = await repository.save({
        nombre: faker.word.adjective(),
      });
      categoriaList.push(categoria);
    }
  };

  it('FindAll debe retornar todas las categorias', async () => {
    const categoria: CategoriaEntity[] = await service.findAll();
    expect(categoria).not.toBeNull();
    expect(categoria).toHaveLength(categoriaList.length);
  });

  it('FindOne debe retornar un museo por el id', async () => {
    const storedCategoria: CategoriaEntity = categoriaList[0];
    const categoria: CategoriaEntity = await service.findOne(
      storedCategoria.id,
    );
    expect(categoria).not.toBeNull();
    expect(categoria.nombre).toEqual(storedCategoria.nombre);
  });

  it('findOne debería lanzar una excepción para una categoria inválida', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'No se encontro la categoria con el id suministrado',
    );
  });

  it('create debe retornar una nueva categoria', async () => {
    const categoria: CategoriaEntity = {
      id: '',
      nombre: faker.word.adjective(),
      productos: [],
    };

    const nuevaCategoria: CategoriaEntity = await service.create(categoria);
    expect(nuevaCategoria).not.toBeNull();

    const storedCategoria: CategoriaEntity = await repository.findOne({
      where: { id: `${nuevaCategoria.id}` },
    });
    expect(storedCategoria).not.toBeNull();
    expect(storedCategoria.nombre).toEqual(nuevaCategoria.nombre);
  });

  it('update debe modificar una categoria', async () => {
    const categoria: CategoriaEntity = categoriaList[3];
    categoria.nombre = 'Verduras';
    const updatedCategoria: CategoriaEntity = await service.update(
      categoria.id,
      categoria,
    );
    expect(updatedCategoria).not.toBeNull();
    const storedCategoria: CategoriaEntity = await repository.findOne({
      where: { id: `${categoria.id}` },
    });
    expect(storedCategoria).not.toBeNull();
    expect(storedCategoria.nombre).toEqual(categoria.nombre);
  });

  it('update deberia lanzar una excepción para una categoria invalida', async () => {
    let categoria: CategoriaEntity = categoriaList[4];
    categoria = {
      ...categoria,
      nombre: 'Condimentos',
    };
    await expect(() => service.update('0', categoria)).rejects.toHaveProperty(
      'message',
      'No se encontro la categoria con el id suministrado',
    );
  });

  it('delete deberia eliminar una categoria', async () => {
    const categoria: CategoriaEntity = categoriaList[2];
    await service.delete(categoria.id);
    const deletedCategoria: CategoriaEntity = await repository.findOne({
      where: { id: `${categoria.id}` },
    });
    expect(deletedCategoria).toBeNull();
  });

  it('delete deberia lanzar una excepción para una categoria invalida', async () => {
    const categoria: CategoriaEntity = categoriaList[0];
    await service.delete(categoria.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'No se encontro la categoria con el id suministrado',
    );
  });
});
