import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { CulturaGastronomicaEntity } from '../cultura_gastronomica/cultura_gastronomica.entity';
import { PaisEntity } from '../pais/pais.entity';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class PaisCulturagastronomicaService {
  constructor(
    @InjectRepository(PaisEntity)
    private readonly paisRepository: Repository<PaisEntity>,

    @InjectRepository(CulturaGastronomicaEntity)
    private readonly culturaGastronomicaRepository: Repository<CulturaGastronomicaEntity>,

    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async associateCulturaGastronomicaPais(
    idPais: string,
    idCulturaGastronomica: string,
  ): Promise<PaisEntity> {
    const pais = await this.paisRepository.findOne({
      where: { id: `${idPais}` },
      relations: ['culturasGastronomicas', 'ciudades'],
    });
    const culturaGastronomica =
      await this.culturaGastronomicaRepository.findOne({
        where: { id: `${idCulturaGastronomica}` },
      });
    if (!pais) {
      throw new BusinessLogicException(
        'El pais con el id dado no existe',
        BusinessError.NOT_FOUND,
      );
    }
    if (!culturaGastronomica) {
      throw new BusinessLogicException(
        'La cultura gastronomica con el id dado no existe',
        BusinessError.NOT_FOUND,
      );
    }
    pais.culturasGastronomicas = [
      ...pais.culturasGastronomicas,
      culturaGastronomica,
    ];
    return await this.paisRepository.save(pais);
  }

  async findCulturaGastronomicaInPais(
    idPais: string,
    idCulturaGastronomica: string,
  ): Promise<CulturaGastronomicaEntity> {
    const pais = await this.paisRepository.findOne({
      where: { id: `${idPais}` },
      relations: ['culturasGastronomicas', 'ciudades'],
    });
    const culturaGastronomica =
      await this.culturaGastronomicaRepository.findOne({
        where: { id: `${idCulturaGastronomica}` },
      });
    if (!pais) {
      throw new BusinessLogicException(
        'El pais con el id dado no existe',
        BusinessError.NOT_FOUND,
      );
    }
    if (!culturaGastronomica) {
      throw new BusinessLogicException(
        'La cultura gastronomica con el id dado no existe',
        BusinessError.NOT_FOUND,
      );
    }

    const paisCultura: CulturaGastronomicaEntity =
      pais.culturasGastronomicas.find(
        (culturaGastronomica) =>
          culturaGastronomica.id === idCulturaGastronomica,
      );

    if (!paisCultura) {
      throw new BusinessLogicException(
        'La cultura gastronomica con el id dado no esta asociada al pais',
        BusinessError.PRECONDITION_FAILED,
      );
    }

    return paisCultura;
  }

  async findCulturasGastronomicasInPais(
    idPais: string,
  ): Promise<CulturaGastronomicaEntity[]> {
    const cacheKey = `pais-culturagastronomica-${idPais}`;
    const cached: CulturaGastronomicaEntity[] = await this.cacheManager.get(
      cacheKey,
    );

    if (cached) return cached;

    const pais = await this.paisRepository.findOne({
      where: { id: `${idPais}` },
      relations: ['culturasGastronomicas', 'ciudades'],
    });
    if (!pais) {
      throw new BusinessLogicException(
        'El pais con el id dado no existe',
        BusinessError.NOT_FOUND,
      );
    }

    const cache = await this.cacheManager.set(
      cacheKey,
      pais.culturasGastronomicas,
    );
    return cache;
  }

  async associateCulturasGastronomicasPais(
    idPais: string,
    culturasGastronomicas: CulturaGastronomicaEntity[],
  ) {
    const pais = await this.paisRepository.findOne({
      where: { id: `${idPais}` },
      relations: ['culturasGastronomicas', 'ciudades'],
    });
    if (!pais) {
      throw new BusinessLogicException(
        'El pais con el id dado no existe',
        BusinessError.NOT_FOUND,
      );
    }

    for (const culturaGastronomica of culturasGastronomicas) {
      const culturaGastronomicaFound =
        await this.culturaGastronomicaRepository.findOne({
          where: { id: `${culturaGastronomica.id}` },
        });
      if (!culturaGastronomicaFound) {
        throw new BusinessLogicException(
          'La cultura gastronomica con el id dado no existe',
          BusinessError.NOT_FOUND,
        );
      }
    }

    pais.culturasGastronomicas = culturasGastronomicas;
    return await this.paisRepository.save(pais);
  }

  async dissociateCulturaGastronomicaPais(
    idPais: string,
    idCulturaGastronomica: string,
  ) {
    const pais = await this.paisRepository.findOne({
      where: { id: `${idPais}` },
      relations: ['culturasGastronomicas', 'ciudades'],
    });
    const culturaGastronomica =
      await this.culturaGastronomicaRepository.findOne({
        where: { id: `${idCulturaGastronomica}` },
        relations: ['paises'],
      });
    if (!pais) {
      throw new BusinessLogicException(
        'El pais con el id dado no existe',
        BusinessError.NOT_FOUND,
      );
    }
    if (!culturaGastronomica) {
      throw new BusinessLogicException(
        'La cultura gastronomica con el id dado no existe',
        BusinessError.NOT_FOUND,
      );
    }

    const paisCultura: CulturaGastronomicaEntity =
      pais.culturasGastronomicas.find((e) => e.id === culturaGastronomica.id);

    if (!paisCultura)
      throw new BusinessLogicException(
        'La cultura gastronomica con el id dado no esta asociada al pais',
        BusinessError.PRECONDITION_FAILED,
      );

    pais.culturasGastronomicas = pais.culturasGastronomicas.filter(
      (culturaGastronomica) => culturaGastronomica.id !== idCulturaGastronomica,
    );

    await this.paisRepository.save(pais);
  }
}
