import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { CulturaGastronomicaEntity } from './cultura_gastronomica.entity';

@Injectable()
export class CulturaGastronomicaService {
  cacheKey = 'culturas_gastronomicas';
  constructor(
    @InjectRepository(CulturaGastronomicaEntity)
    private readonly culturaGastronomicaRepository: Repository<CulturaGastronomicaEntity>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async findAll(): Promise<CulturaGastronomicaEntity[]> {
    const cached = await this.cacheManager.get<CulturaGastronomicaEntity[]>(
      this.cacheKey,
    );
    if (cached) return cached;

    const cache = await this.culturaGastronomicaRepository.find({
      relations: ['productos', 'restaurantes', 'recetas'],
    });
    await this.cacheManager.set(this.cacheKey, cache);
    return cache;
  }

  async findOne(id: string): Promise<CulturaGastronomicaEntity> {
    const culturaGastronomica: CulturaGastronomicaEntity =
      await this.culturaGastronomicaRepository.findOne({
        where: { id },
        relations: ['productos', 'restaurantes', 'recetas'],
      });
    if (!culturaGastronomica)
      throw new BusinessLogicException(
        'La cultura gastronómica con el id brindado no ha sido encontrada.',
        BusinessError.NOT_FOUND,
      );

    return culturaGastronomica;
  }

  async create(
    culturaGastronomica: CulturaGastronomicaEntity,
  ): Promise<CulturaGastronomicaEntity> {
    return await this.culturaGastronomicaRepository.save(culturaGastronomica);
  }

  async update(
    id: string,
    culturaGastronomica: CulturaGastronomicaEntity,
  ): Promise<CulturaGastronomicaEntity> {
    const persistedCulturaGastronomica: CulturaGastronomicaEntity =
      await this.culturaGastronomicaRepository.findOne({ where: { id } });
    if (!persistedCulturaGastronomica)
      throw new BusinessLogicException(
        'La cultura gastronómica con el id brindado no ha sido encontrada.',
        BusinessError.NOT_FOUND,
      );

    return await this.culturaGastronomicaRepository.save({
      ...persistedCulturaGastronomica,
      ...culturaGastronomica,
    });
  }

  async delete(id: string) {
    const culturaGastronomica: CulturaGastronomicaEntity =
      await this.culturaGastronomicaRepository.findOne({ where: { id } });
    if (!culturaGastronomica)
      throw new BusinessLogicException(
        'La cultura gastronómica con el id brindado no ha sido encontrada.',
        BusinessError.NOT_FOUND,
      );

    await this.culturaGastronomicaRepository.remove(culturaGastronomica);
  }
}
