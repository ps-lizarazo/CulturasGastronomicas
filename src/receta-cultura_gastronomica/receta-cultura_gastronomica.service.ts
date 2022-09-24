import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { CulturaGastronomicaEntity } from '../cultura_gastronomica/cultura_gastronomica.entity';
import { RecetaEntity } from '../receta/receta.entity';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class RecetaCulturaGastronomicaService {
  constructor(
    @InjectRepository(CulturaGastronomicaEntity)
    private readonly culturaGastronomicaRepository: Repository<CulturaGastronomicaEntity>,

    @InjectRepository(RecetaEntity)
    private readonly recetaRepository: Repository<RecetaEntity>,

    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async addRecetaCulturaGastronomica(
    culturaGastronomicaId: string,
    recetaId: string,
  ): Promise<CulturaGastronomicaEntity> {
    const receta: RecetaEntity = await this.recetaRepository.findOne({
      where: { id: recetaId },
    });
    if (!receta)
      throw new BusinessLogicException(
        'La receta con el id brindado no ha sido encontrada.',
        BusinessError.NOT_FOUND,
      );

    const culturaGastronomica: CulturaGastronomicaEntity =
      await this.culturaGastronomicaRepository.findOne({
        where: { id: culturaGastronomicaId },
        relations: ['recetas'],
      });

    if (!culturaGastronomica)
      throw new BusinessLogicException(
        'La cultura gastronómica con el id brindado no ha sido encontrada.',
        BusinessError.NOT_FOUND,
      );

    culturaGastronomica.recetas = [...culturaGastronomica.recetas, receta];
    return await this.culturaGastronomicaRepository.save(culturaGastronomica);
  }

  async findRecetaByCulturaGastronomicaIdRecetaId(
    culturaGastronomicaId: string,
    recetaId: string,
  ): Promise<RecetaEntity> {
    const receta: RecetaEntity = await this.recetaRepository.findOne({
      where: { id: recetaId },
    });
    if (!receta)
      throw new BusinessLogicException(
        'La receta con el id brindado no ha sido encontrada.',
        BusinessError.NOT_FOUND,
      );

    const culturaGastronomica: CulturaGastronomicaEntity =
      await this.culturaGastronomicaRepository.findOne({
        where: { id: culturaGastronomicaId },
        relations: ['recetas'],
      });
    if (!culturaGastronomica)
      throw new BusinessLogicException(
        'La cultura gastronómica con el id brindado no ha sido encontrada.',
        BusinessError.NOT_FOUND,
      );

    const recetaCulturaGastronomica: RecetaEntity =
      culturaGastronomica.recetas.find((e) => e.id === receta.id);

    if (!recetaCulturaGastronomica)
      throw new BusinessLogicException(
        'La receta con el id brindado no pertenece a la cultura gastrónomica dada por su id.',
        BusinessError.PRECONDITION_FAILED,
      );

    return recetaCulturaGastronomica;
  }

  async findRecetasByCulturaGastronomicaId(
    culturaGastronomicaId: string,
  ): Promise<RecetaEntity[]> {
    const cacheKey = `recetas-cultura-gastronomica-${culturaGastronomicaId}`;
    const cachedRecetas: RecetaEntity[] = await this.cacheManager.get(cacheKey);

    if (cachedRecetas) return cachedRecetas;

    const culturaGastronomica: CulturaGastronomicaEntity =
      await this.culturaGastronomicaRepository.findOne({
        where: { id: culturaGastronomicaId },
        relations: ['recetas'],
      });
    if (!culturaGastronomica)
      throw new BusinessLogicException(
        'La cultura gastronómica con el id brindado no ha sido encontrada.',
        BusinessError.NOT_FOUND,
      );

    const cache = culturaGastronomica.recetas;
    await this.cacheManager.set(cacheKey, cache);

    return cache;
  }

  async associateRecetasCulturaGastronomica(
    culturaGastronomicaId: string,
    recetas: RecetaEntity[],
  ): Promise<CulturaGastronomicaEntity> {
    const culturaGastronomica: CulturaGastronomicaEntity =
      await this.culturaGastronomicaRepository.findOne({
        where: { id: culturaGastronomicaId },
        relations: ['recetas'],
      });

    if (!culturaGastronomica)
      throw new BusinessLogicException(
        'La cultura gastronómica con el id brindado no ha sido encontrada.',
        BusinessError.NOT_FOUND,
      );

    for (let i = 0; i < recetas.length; i++) {
      const receta: RecetaEntity = await this.recetaRepository.findOne({
        where: { id: recetas[i].id },
      });
      if (!receta)
        throw new BusinessLogicException(
          'La receta con el id brindado no ha sido encontrada.',
          BusinessError.NOT_FOUND,
        );
    }

    culturaGastronomica.recetas = recetas;
    return await this.culturaGastronomicaRepository.save(culturaGastronomica);
  }

  async deleteRecetaCulturaGastronomica(
    culturaGastronomicaId: string,
    recetaId: string,
  ) {
    const receta: RecetaEntity = await this.recetaRepository.findOne({
      where: { id: recetaId },
    });
    if (!receta)
      throw new BusinessLogicException(
        'La receta con el id brindado no ha sido encontrada.',
        BusinessError.NOT_FOUND,
      );

    const culturaGastronomica: CulturaGastronomicaEntity =
      await this.culturaGastronomicaRepository.findOne({
        where: { id: culturaGastronomicaId },
        relations: ['recetas'],
      });
    if (!culturaGastronomica)
      throw new BusinessLogicException(
        'La cultura gastronómica con el id brindado no ha sido encontrada.',
        BusinessError.NOT_FOUND,
      );

    const recetaCulturaGastronomica: RecetaEntity =
      culturaGastronomica.recetas.find((e) => e.id === receta.id);

    if (!recetaCulturaGastronomica)
      throw new BusinessLogicException(
        'La receta con el id brindado no pertenece a la cultura gastrónomica dada por su id.',
        BusinessError.PRECONDITION_FAILED,
      );

    culturaGastronomica.recetas = culturaGastronomica.recetas.filter(
      (e) => e.id !== recetaId,
    );
    await this.culturaGastronomicaRepository.save(culturaGastronomica);
  }
}
