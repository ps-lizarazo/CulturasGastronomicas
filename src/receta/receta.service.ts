import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { RecetaEntity } from './receta.entity';

@Injectable()
export class RecetaService {
  cacheKey = 'recetas';

  constructor(
    @InjectRepository(RecetaEntity)
    private readonly recetaRepository: Repository<RecetaEntity>,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async findAll(): Promise<RecetaEntity[]> {
    const cached = await this.cacheManager.get<RecetaEntity[]>(this.cacheKey);

    if (cached) return cached;

    const cache = await this.recetaRepository.find({
      relations: ['culturaGastronomica'],
    });
    await this.cacheManager.set(this.cacheKey, cache);
    return cache;
  }

  async findOne(id: string): Promise<RecetaEntity> {
    const receta: RecetaEntity = await this.recetaRepository.findOne({
      where: { id },
      relations: ['culturaGastronomica'],
    });
    if (!receta)
      throw new BusinessLogicException(
        'La receta con el id brindado no ha sido encontrada.',
        BusinessError.NOT_FOUND,
      );

    return receta;
  }

  async create(receta: RecetaEntity): Promise<RecetaEntity> {
    return await this.recetaRepository.save(receta);
  }

  async update(id: string, receta: RecetaEntity): Promise<RecetaEntity> {
    const persistedReceta: RecetaEntity = await this.recetaRepository.findOne({
      where: { id },
    });
    if (!persistedReceta)
      throw new BusinessLogicException(
        'La receta con el id brindado no ha sido encontrada.',
        BusinessError.NOT_FOUND,
      );

    return await this.recetaRepository.save({ ...persistedReceta, ...receta });
  }

  async delete(id: string) {
    const receta: RecetaEntity = await this.recetaRepository.findOne({
      where: { id },
    });
    if (!receta)
      throw new BusinessLogicException(
        'La receta con el id brindado no ha sido encontrada.',
        BusinessError.NOT_FOUND,
      );

    await this.recetaRepository.remove(receta);
  }
}
