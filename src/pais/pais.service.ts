import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { PaisEntity } from './pais.entity';

@Injectable()
export class PaisService {
  constructor(
    @InjectRepository(PaisEntity)
    private readonly paisRepository: Repository<PaisEntity>,
  ) {}

  async findAll(): Promise<PaisEntity[]> {
    return await this.paisRepository.find({
      relations: ['ciudades', 'culturasGastronomicas'],
    });
  }

  async findOne(id: string): Promise<PaisEntity> {
    const pais = await this.paisRepository.findOne({
      where: { id },
      relations: ['ciudades', 'culturasGastronomicas'],
    });
    if (!pais) {
      throw new BusinessLogicException(
        'El pais con el id dado no existe',
        BusinessError.NOT_FOUND,
      );
    }

    return pais;
  }

  async create(pais: PaisEntity): Promise<PaisEntity> {
    return await this.paisRepository.save(pais);
  }

  async update(id: string, pais: PaisEntity): Promise<PaisEntity> {
    const paisEncontrado = await this.paisRepository.findOne({
      where: { id },
    });
    if (!paisEncontrado) {
      throw new BusinessLogicException(
        'El pais con el id dado no existe',
        BusinessError.NOT_FOUND,
      );
    }
    return await this.paisRepository.save({ ...paisEncontrado, ...pais });
  }

  async delete(id: string) {
    const pais = await this.paisRepository.findOne({ where: { id } });
    if (!pais) {
      throw new BusinessLogicException(
        'El pais con el id dado no existe',
        BusinessError.NOT_FOUND,
      );
    }

    await this.paisRepository.remove(pais);
  }
}
