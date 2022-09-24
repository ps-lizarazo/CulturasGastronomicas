import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { RestauranteEntity } from './restaurante.entity';

@Injectable()
export class RestauranteService {
  cacheKey = 'restaurantes';

  constructor(
    @InjectRepository(RestauranteEntity)
    private readonly restauranteRepository: Repository<RestauranteEntity>,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async findAll(): Promise<RestauranteEntity[]> {
    const cached = await this.cacheManager.get<RestauranteEntity[]>(
      this.cacheKey,
    );

    if (cached) return cached;

    const cache = await this.restauranteRepository.find({
      relations: ['ciudad', 'culturasGastronomicas', 'estrellasMichelin'],
    });
    await this.cacheManager.set(this.cacheKey, cache);
    return cache;
  }

  async findOne(id: string): Promise<RestauranteEntity> {
    const restaurante = await this.restauranteRepository.findOne({
      where: { id },
      relations: ['ciudad', 'culturasGastronomicas', 'estrellasMichelin'],
    });
    if (!restaurante) {
      throw new BusinessLogicException(
        'El restaurante con el id dado no existe',
        BusinessError.NOT_FOUND,
      );
    }

    return restaurante;
  }

  async create(restaurante: RestauranteEntity): Promise<RestauranteEntity> {
    return await this.restauranteRepository.save(restaurante);
  }

  async update(
    id: string,
    restaurante: RestauranteEntity,
  ): Promise<RestauranteEntity> {
    const restauranteEncontrado = await this.restauranteRepository.findOne({
      where: { id },
    });
    if (!restauranteEncontrado) {
      throw new BusinessLogicException(
        'El restaurante con el id dado no existe',
        BusinessError.NOT_FOUND,
      );
    }
    return await this.restauranteRepository.save({
      ...restauranteEncontrado,
      ...restaurante,
    });
  }

  async delete(id: string) {
    const restaurante = await this.restauranteRepository.findOne({
      where: { id },
    });
    if (!restaurante) {
      throw new BusinessLogicException(
        'El restaurante con el id dado no existe',
        BusinessError.NOT_FOUND,
      );
    }

    await this.restauranteRepository.remove(restaurante);
  }
}
