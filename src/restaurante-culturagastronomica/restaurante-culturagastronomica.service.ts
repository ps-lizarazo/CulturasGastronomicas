import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CulturaGastronomicaEntity } from '../cultura_gastronomica/cultura_gastronomica.entity';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class RestauranteCulturagastronomicaService {
  constructor(
    @InjectRepository(RestauranteEntity)
    private readonly restauranteRepository: Repository<RestauranteEntity>,

    @InjectRepository(CulturaGastronomicaEntity)
    private readonly culturaGastronomicaRepository: Repository<CulturaGastronomicaEntity>,
  ) {}

  async associateCulturaGastronomicaRestaurante(
    idRestaurante: string,
    idCulturaGastronomica: string,
  ): Promise<RestauranteEntity> {
    const restaurante = await this.restauranteRepository.findOne({
      where: { id: `${idRestaurante}` },
      relations: ['ciudad', 'culturasGastronomicas', 'estrellasMichelin'],
    });
    const culturaGastronomica =
      await this.culturaGastronomicaRepository.findOne({
        where: { id: `${idCulturaGastronomica}` },
      });
    if (!restaurante) {
      throw new BusinessLogicException(
        'El restaurante con el id dado no existe',
        BusinessError.NOT_FOUND,
      );
    }
    if (!culturaGastronomica) {
      throw new BusinessLogicException(
        'La cultura gastronomica con el id dado no existe',
        BusinessError.NOT_FOUND,
      );
    }
    restaurante.culturasGastronomicas = [
      ...restaurante.culturasGastronomicas,
      culturaGastronomica,
    ];
    return await this.restauranteRepository.save(restaurante);
  }

  async findCulturaGastronomicaInRestaurante(
    idRestaurante: string,
    idCulturaGastronomica: string,
  ): Promise<CulturaGastronomicaEntity> {
    const restaurante = await this.restauranteRepository.findOne({
      where: { id: `${idRestaurante}` },
      relations: ['ciudad', 'culturasGastronomicas', 'estrellasMichelin'],
    });
    const culturaGastronomica =
      await this.culturaGastronomicaRepository.findOne({
        where: { id: `${idCulturaGastronomica}` },
      });
    if (!restaurante) {
      throw new BusinessLogicException(
        'El restaurante con el id dado no existe',
        BusinessError.NOT_FOUND,
      );
    }
    if (!culturaGastronomica) {
      throw new BusinessLogicException(
        'La cultura gastronomica con el id dado no existe',
        BusinessError.NOT_FOUND,
      );
    }

    const restauranteCultura: CulturaGastronomicaEntity =
      restaurante.culturasGastronomicas.find(
        (culturaGastronomica) =>
          culturaGastronomica.id === idCulturaGastronomica,
      );

    if (!restauranteCultura) {
      throw new BusinessLogicException(
        'La cultura gastronomica con el id dado no esta asociada al restaurante',
        BusinessError.PRECONDITION_FAILED,
      );
    }

    return restauranteCultura;
  }

  async findCulturasGastronomicasInRestaurante(idRestaurante: string) {
    const restaurante = await this.restauranteRepository.findOne({
      where: { id: `${idRestaurante}` },
      relations: ['ciudad', 'culturasGastronomicas', 'estrellasMichelin'],
    });
    if (!restaurante) {
      throw new BusinessLogicException(
        'El restaurante con el id dado no existe',
        BusinessError.NOT_FOUND,
      );
    }
    return restaurante.culturasGastronomicas;
  }

  async associateCulturasGastronomicasRestaurante(
    idRestaurante: string,
    culturasGastronomicas: CulturaGastronomicaEntity[],
  ) {
    const restaurante = await this.restauranteRepository.findOne({
      where: { id: `${idRestaurante}` },
      relations: ['ciudad', 'culturasGastronomicas', 'estrellasMichelin'],
    });
    if (!restaurante) {
      throw new BusinessLogicException(
        'El restaurante con el id dado no existe',
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

    restaurante.culturasGastronomicas = culturasGastronomicas;
    return await this.restauranteRepository.save(restaurante);
  }

  async dissociateCulturaGastronomicaRestaurante(
    idRestaurante: string,
    idCulturaGastronomica: string,
  ) {
    const restaurante = await this.restauranteRepository.findOne({
      where: { id: `${idRestaurante}` },
      relations: ['ciudad', 'culturasGastronomicas', 'estrellasMichelin'],
    });
    const culturaGastronomica =
      await this.culturaGastronomicaRepository.findOne({
        where: { id: `${idCulturaGastronomica}` },
        relations: ['restaurantes'],
      });
    if (!restaurante) {
      throw new BusinessLogicException(
        'El restaurante con el id dado no existe',
        BusinessError.NOT_FOUND,
      );
    }
    if (!culturaGastronomica) {
      throw new BusinessLogicException(
        'La cultura gastronomica con el id dado no existe',
        BusinessError.NOT_FOUND,
      );
    }
    restaurante.culturasGastronomicas =
      restaurante.culturasGastronomicas.filter(
        (culturaGastronomica) =>
          culturaGastronomica.id !== idCulturaGastronomica,
      );
    await this.restauranteRepository.save(restaurante);
  }
}
