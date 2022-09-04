import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BusinessLogicException,
  BusinessError,
} from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { CiudadEntity } from './ciudad.entity';

@Injectable()
export class CiudadService {
  constructor(
    @InjectRepository(CiudadEntity)
    private readonly ciudadRepository: Repository<CiudadEntity>,
  ) {}

  async findAll(): Promise<CiudadEntity[]> {
    return await this.ciudadRepository.find({
      relations: ['pais', 'restaurantes'],
    });
  }

  async findOne(id: string): Promise<CiudadEntity> {
    const ciudad = await this.ciudadRepository.findOne({
      where: { id },
      relations: ['pais', 'restaurantes'],
    });

    if (!ciudad) {
      throw new BusinessLogicException(
        'La ciudad con el id dado no existe',
        BusinessError.NOT_FOUND,
      );
    }

    return ciudad;
  }

  async create(ciudad: CiudadEntity): Promise<CiudadEntity> {
    return await this.ciudadRepository.save(ciudad);
  }

  async update(id: string, ciudad: CiudadEntity): Promise<CiudadEntity> {
    const ciudadEncontrada = await this.ciudadRepository.findOne({
      where: { id },
    });
    if (!ciudadEncontrada) {
      throw new BusinessLogicException(
        'La ciudad con el id dado no existe',
        BusinessError.NOT_FOUND,
      );
    }
    return await this.ciudadRepository.save({ ...ciudadEncontrada, ...ciudad });
  }

  async delete(id: string) {
    const ciudad = await this.ciudadRepository.findOne({ where: { id } });
    if (!ciudad) {
      throw new BusinessLogicException(
        'La ciudad con el id dado no existe',
        BusinessError.NOT_FOUND,
      );
    }

    await this.ciudadRepository.remove(ciudad);
  }
}
