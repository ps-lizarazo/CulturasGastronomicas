import { Injectable } from '@nestjs/common';
import { ProductoEntity } from '../producto/producto.entity';
import { CategoriaEntity } from '../categoria/categoria.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class CategoriaProductoService {
  constructor(
    @InjectRepository(ProductoEntity)
    private readonly productoRepository: Repository<ProductoEntity>,

    @InjectRepository(CategoriaEntity)
    private readonly categoriaRepository: Repository<CategoriaEntity>,
  ) {}

  async addProductoCategoria(
    categoriaId: string,
    productoId: string,
  ): Promise<CategoriaEntity> {
    const producto: ProductoEntity = await this.productoRepository.findOne({
      where: { id: productoId },
    });
    if (!producto)
      throw new BusinessLogicException(
        'No se encontro el producto con el id suministrado',
        BusinessError.NOT_FOUND,
      );

    const categoria: CategoriaEntity = await this.categoriaRepository.findOne({
      where: { id: categoriaId },
      relations: ['productos'],
    });

    if (!categoria)
      throw new BusinessLogicException(
        'No se encontro la categoria con el id suministrado',
        BusinessError.NOT_FOUND,
      );

    categoria.productos = [...categoria.productos, producto];
    return await this.categoriaRepository.save(categoria);
  }

  //BUSCAR UN PRODUCTO EN UNA CATEGORIA
  async findProductoByCategoriaIdProductoId(
    categoriaId: string,
    productoId: string,
  ): Promise<ProductoEntity> {
    const producto: ProductoEntity = await this.productoRepository.findOne({
      where: { id: productoId },
    });
    if (!producto)
      throw new BusinessLogicException(
        'No se encontro el producto con el id suministrado',
        BusinessError.NOT_FOUND,
      );

    const categoria: CategoriaEntity = await this.categoriaRepository.findOne({
      where: { id: categoriaId },
      relations: ['productos'],
    });
    if (!categoria)
      throw new BusinessLogicException(
        'No se encontro la categoria con el id suministrado',
        BusinessError.NOT_FOUND,
      );

    const categoriaProducto: ProductoEntity = categoria.productos.find(
      (e) => e.id === producto.id,
    );

    if (!categoriaProducto)
      throw new BusinessLogicException(
        'El producto con el id suministrado no esta asociado a la categoria',
        BusinessError.PRECONDITION_FAILED,
      );

    return categoriaProducto;
  }

  async findProductosByCategoriaId(
    categoriaId: string,
  ): Promise<ProductoEntity[]> {
    const categoria: CategoriaEntity = await this.categoriaRepository.findOne({
      where: { id: categoriaId },
      relations: ['productos'],
    });
    if (!categoria)
      throw new BusinessLogicException(
        'No se encontro la categoria con el id suministrado',
        BusinessError.NOT_FOUND,
      );

    return categoria.productos;
  }

  async associateProductosCategoria(
    museumId: string,
    productos: ProductoEntity[],
  ): Promise<CategoriaEntity> {
    const categoria: CategoriaEntity = await this.categoriaRepository.findOne({
      where: { id: museumId },
      relations: ['productos'],
    });

    if (!categoria)
      throw new BusinessLogicException(
        'No se encontro la categoria con el id suministrado',
        BusinessError.NOT_FOUND,
      );

    for (let i = 0; i < productos.length; i++) {
      const producto: ProductoEntity = await this.productoRepository.findOne({
        where: { id: productos[i].id },
      });
      if (!producto)
        throw new BusinessLogicException(
          'No se encontro el producto con el id suministrado',
          BusinessError.NOT_FOUND,
        );
    }

    categoria.productos = productos;
    return await this.categoriaRepository.save(categoria);
  }

  async deleteProductoCategoria(museumId: string, artworkId: string) {
    const producto: ProductoEntity = await this.productoRepository.findOne({
      where: { id: artworkId },
    });
    if (!producto)
      throw new BusinessLogicException(
        'No se encontro el producto con el id suministrado',
        BusinessError.NOT_FOUND,
      );

    const categoria: CategoriaEntity = await this.categoriaRepository.findOne({
      where: { id: museumId },
      relations: ['productos'],
    });
    if (!categoria)
      throw new BusinessLogicException(
        'No se encontro la categoria con el id suministrado',
        BusinessError.NOT_FOUND,
      );

    const museumProducto: ProductoEntity = categoria.productos.find(
      (e) => e.id === producto.id,
    );

    if (!museumProducto)
      throw new BusinessLogicException(
        'El producto con el id suministrado no esta asociado a la categoria',
        BusinessError.PRECONDITION_FAILED,
      );

    categoria.productos = categoria.productos.filter((e) => e.id !== artworkId);
    await this.categoriaRepository.save(categoria);
  }
}
