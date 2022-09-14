import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CiudadEntity } from '../ciudad/ciudad.entity';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class RestauranteCiudadService {
  constructor(
    @InjectRepository(RestauranteEntity)
    private readonly restauranteRepository: Repository<RestauranteEntity>,

    @InjectRepository(CiudadEntity)
    private readonly ciudadRepository: Repository<CiudadEntity>,
  ) {}

  async associateCiudadRestaurante(
    idRestaurante: string,
    idCiudad: string,
  ): Promise<RestauranteEntity> {
    const restaurante = await this.restauranteRepository.findOne({
      where: { id: `${idRestaurante}` },
      relations: ['ciudad', 'culturasGastronomicas', 'estrellasMichelin'],
    });
    const ciudad = await this.ciudadRepository.findOne({
      where: { id: `${idCiudad}` },
    });
    if (!restaurante) {
      throw new BusinessLogicException(
        'El restaurante con el id dado no existe',
        BusinessError.NOT_FOUND,
      );
    }
    if (!ciudad) {
      throw new BusinessLogicException(
        'La ciudad con el id dado no existe',
        BusinessError.NOT_FOUND,
      );
    }
    restaurante.ciudad = ciudad;
    return await this.restauranteRepository.save(restaurante);
  }

  async findCiudadInRestaurante(
    idRestaurante: string,
    idCiudad: string,
  ): Promise<CiudadEntity> {
    const restaurante = await this.restauranteRepository.findOne({
      where: { id: `${idRestaurante}` },
      relations: ['ciudad', 'culturasGastronomicas', 'estrellasMichelin'],
    });
    const ciudad = await this.ciudadRepository.findOne({
      where: { id: `${idCiudad}` },
    });
    if (!restaurante) {
      throw new BusinessLogicException(
        'El restaurante con el id dado no existe',
        BusinessError.NOT_FOUND,
      );
    }
    if (!ciudad) {
      throw new BusinessLogicException(
        'La ciudad con el id dado no existe',
        BusinessError.NOT_FOUND,
      );
    }

    const ciudadRestaurante: CiudadEntity = restaurante.ciudad;

    if (!ciudadRestaurante) {
      throw new BusinessLogicException(
        'La ciudad con el id dado no esta asociada al restaurante',
        BusinessError.PRECONDITION_FAILED,
      );
    }

    return ciudadRestaurante;
  }

  async dissociateCiudadRestaurante(idRestaurante: string, idCiudad: string) {
    const restaurante = await this.restauranteRepository.findOne({
      where: { id: `${idRestaurante}` },
      relations: ['ciudad', 'ciudad', 'estrellasMichelin'],
    });
    const ciudad = await this.ciudadRepository.findOne({
      where: { id: `${idCiudad}` },
      relations: ['restaurantes'],
    });
    if (!restaurante) {
      throw new BusinessLogicException(
        'El restaurante con el id dado no existe',
        BusinessError.NOT_FOUND,
      );
    }
    if (!ciudad) {
      throw new BusinessLogicException(
        'La ciudad con el id dado no existe',
        BusinessError.NOT_FOUND,
      );
    }
    restaurante.ciudad = null;
    await this.restauranteRepository.save(restaurante);
  }
}
