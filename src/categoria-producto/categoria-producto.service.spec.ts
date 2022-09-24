import { Test, TestingModule } from '@nestjs/testing';
import { CategoriaProductoService } from './categoria-producto.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { CategoriaEntity } from '../categoria/categoria.entity';
import { ProductoEntity } from '../producto/producto.entity';
import { faker } from '@faker-js/faker';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/common';

describe('CategoriaProductoService', () => {
  let service: CategoriaProductoService;
  let categoriaRepository: Repository<CategoriaEntity>;
  let productoRepository: Repository<ProductoEntity>;
  let categoria: CategoriaEntity;
  let productoList: ProductoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig(), CacheModule.register()],
      providers: [CategoriaProductoService],
    }).compile();

    service = module.get<CategoriaProductoService>(CategoriaProductoService);
    categoriaRepository = module.get<Repository<CategoriaEntity>>(
      getRepositoryToken(CategoriaEntity),
    );
    productoRepository = module.get<Repository<ProductoEntity>>(
      getRepositoryToken(ProductoEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    productoRepository.clear();
    categoriaRepository.clear();

    productoList = [];
    for (let i = 0; i < 5; i++) {
      const producto: ProductoEntity = await productoRepository.save({
        nombre: faker.word.adjective(),
        historia: faker.lorem.lines(5),
        descripcion: faker.lorem.lines(5),
      });
      productoList.push(producto);
    }

    categoria = await categoriaRepository.save({
      nombre: faker.word.adjective(),
      productos: productoList,
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addProductoCategoria Debe agregar un producto a una categoria', async () => {
    const newProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.word.adjective(),
      historia: faker.lorem.lines(5),
      descripcion: faker.lorem.lines(5),
    });

    const newCategoria: CategoriaEntity = await categoriaRepository.save({
      nombre: faker.word.adjective(),
    });

    const result: CategoriaEntity = await service.addProductoCategoria(
      newCategoria.id,
      newProducto.id,
    );

    expect(result.productos.length).toBe(1);
    expect(result.productos[0]).not.toBeNull();
    expect(result.productos[0].nombre).toBe(newProducto.nombre);
    expect(result.productos[0].historia).toBe(newProducto.historia);
  });

  it('addProductoCategoria Debe lanzar una excepcion', async () => {
    const newCategoria: CategoriaEntity = await categoriaRepository.save({
      nombre: faker.word.adjective(),
      productos: productoList,
    });

    await expect(() =>
      service.addProductoCategoria(newCategoria.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'No se encontro el producto con el id suministrado',
    );
  });

  it('addArtworkMuseum Debe agregar una excepcion por una categoria invalida', async () => {
    const newProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.word.adjective(),
      historia: faker.lorem.lines(5),
      descripcion: faker.lorem.lines(5),
    });

    await expect(() =>
      service.addProductoCategoria('0', newProducto.id),
    ).rejects.toHaveProperty(
      'message',
      'No se encontro la categoria con el id suministrado',
    );
  });

  it('findProductoByCategoriaIdProductoId debe retornar un producto por museo', async () => {
    const producto: ProductoEntity = productoList[0];
    const storedProducto: ProductoEntity =
      await service.findProductoByCategoriaIdProductoId(
        categoria.id,
        producto.id,
      );
    expect(storedProducto).not.toBeNull();
    expect(storedProducto.nombre).toBe(producto.nombre);
    expect(storedProducto.historia).toBe(producto.historia);
  });

  it('findProductoByCategoriaIdProductoId debe lanzar una excepcion por un producto invalido', async () => {
    await expect(() =>
      service.findProductoByCategoriaIdProductoId(categoria.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'No se encontro el producto con el id suministrado',
    );
  });

  it('findProductoByCategoriaIdProductoId  Debe agregar una excepcion por una categoria invalida', async () => {
    const producto: ProductoEntity = productoList[0];
    await expect(() =>
      service.findProductoByCategoriaIdProductoId('0', producto.id),
    ).rejects.toHaveProperty(
      'message',
      'No se encontro la categoria con el id suministrado',
    );
  });

  it('findProductoByCategoriaIdProductoId Debe lanzar una excepcion para un producto no asociado a la categoria', async () => {
    const newProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.word.adjective(),
      historia: faker.lorem.lines(5),
      descripcion: faker.lorem.lines(5),
    });

    await expect(() =>
      service.findProductoByCategoriaIdProductoId(categoria.id, newProducto.id),
    ).rejects.toHaveProperty(
      'message',
      'El producto con el id suministrado no esta asociado a la categoria',
    );
  });

  it('findProductosByCategoriaId Debe retornar los productos por categoria', async () => {
    const productos: ProductoEntity[] =
      await service.findProductosByCategoriaId(categoria.id);
    expect(productos.length).toBe(5);
  });

  it('findProductosByCategoriaId  Debe agregar una excepcion por una categoria invalida', async () => {
    await expect(() =>
      service.findProductosByCategoriaId('0'),
    ).rejects.toHaveProperty(
      'message',
      'No se encontro la categoria con el id suministrado',
    );
  });

  it('associateProductosCategoria Debe actualizar la lista de productos para una categoria', async () => {
    const newProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.word.adjective(),
      historia: faker.lorem.lines(5),
      descripcion: faker.lorem.lines(5),
    });

    const updatedCategoria: CategoriaEntity =
      await service.associateProductosCategoria(categoria.id, [newProducto]);
    expect(updatedCategoria.productos.length).toBe(1);

    expect(updatedCategoria.productos[0].nombre).toBe(newProducto.nombre);
    expect(updatedCategoria.productos[0].historia).toBe(newProducto.historia);
  });

  it('associateProductosCategoria  Debe agregar una excepcion por una categoria invalida', async () => {
    const newProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.word.adjective(),
      historia: faker.lorem.lines(5),
      descripcion: faker.lorem.lines(5),
    });

    await expect(() =>
      service.associateProductosCategoria('0', [newProducto]),
    ).rejects.toHaveProperty(
      'message',
      'No se encontro la categoria con el id suministrado',
    );
  });

  it('associateProductosCategoria Debe lanzar una excepcion para un producto no valido', async () => {
    const newProducto: ProductoEntity = productoList[0];
    newProducto.id = '0';

    await expect(() =>
      service.associateProductosCategoria(categoria.id, [newProducto]),
    ).rejects.toHaveProperty(
      'message',
      'No se encontro el producto con el id suministrado',
    );
  });

  it('deleteProductoCategoria Debe remover el producto de una categoria', async () => {
    const producto: ProductoEntity = productoList[0];

    await service.deleteProductoCategoria(categoria.id, producto.id);

    const storedCategoria: CategoriaEntity = await categoriaRepository.findOne({
      where: { id: categoria.id },
      relations: ['productos'],
    });
    const deletedProducto: ProductoEntity = storedCategoria.productos.find(
      (a) => a.id === producto.id,
    );

    expect(deletedProducto).toBeUndefined();
  });

  it('deleteProductoCategoria Debe lanzar una excepcion para un un producto no valido', async () => {
    await expect(() =>
      service.deleteProductoCategoria(categoria.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'No se encontro el producto con el id suministrado',
    );
  });

  it('deleteProductoCategoria Debe lanzar una excepcion para una categoria no valida', async () => {
    const producto: ProductoEntity = productoList[0];
    await expect(() =>
      service.deleteProductoCategoria('0', producto.id),
    ).rejects.toHaveProperty(
      'message',
      'No se encontro la categoria con el id suministrado',
    );
  });

  it('deleteProductoCategoria Debe lanzar una excepcion para un producto no asociado', async () => {
    const newProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.word.adjective(),
      historia: faker.lorem.lines(5),
      descripcion: faker.lorem.lines(5),
    });

    await expect(() =>
      service.deleteProductoCategoria(categoria.id, newProducto.id),
    ).rejects.toHaveProperty(
      'message',
      'El producto con el id suministrado no esta asociado a la categoria',
    );
  });
});
