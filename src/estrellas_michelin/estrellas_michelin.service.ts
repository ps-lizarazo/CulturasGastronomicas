import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { EstrellasMichelinEntity } from './estrellas_michelin.entity';

@Injectable()
export class EstrellasMichelinService {
  constructor(
    @InjectRepository(EstrellasMichelinEntity)
    private readonly estrellasMichelinRepository: Repository<EstrellasMichelinEntity>,
  ) {}

  async findAll(): Promise<EstrellasMichelinEntity[]> {
    return await this.estrellasMichelinRepository.find({
      relations: ['restaurante'],
    });
  }

  async findOne(id: string): Promise<EstrellasMichelinEntity> {
    const estrellasMichelin = await this.estrellasMichelinRepository.findOne({
      where: { id },
      relations: ['restaurante'],
    });
    if (!estrellasMichelin) {
      throw new BusinessLogicException(
        'La Estrella Michelin con el id dado no existe',
        BusinessError.NOT_FOUND,
      );
    }

    return estrellasMichelin;
  }

  async create(
    estrellasMichelin: EstrellasMichelinEntity,
  ): Promise<EstrellasMichelinEntity> {
    return await this.estrellasMichelinRepository.save(estrellasMichelin);
  }

  async update(
    id: string,
    estrellasMichelin: EstrellasMichelinEntity,
  ): Promise<EstrellasMichelinEntity> {
    const estrellasMichelinEncontrado =
      await this.estrellasMichelinRepository.findOne({
        where: { id },
      });
    if (!estrellasMichelinEncontrado) {
      throw new BusinessLogicException(
        'La Estrella Michelin con el id dado no existe',
        BusinessError.NOT_FOUND,
      );
    }
    return await this.estrellasMichelinRepository.save({
      ...estrellasMichelinEncontrado,
      ...estrellasMichelin,
    });
  }

  async delete(id: string) {
    const estrellasMichelin = await this.estrellasMichelinRepository.findOne({
      where: { id },
    });
    if (!estrellasMichelin) {
      throw new BusinessLogicException(
        'La Estrella Michelin con el id dado no existe',
        BusinessError.NOT_FOUND,
      );
    }

    await this.estrellasMichelinRepository.remove(estrellasMichelin);
  }
}
