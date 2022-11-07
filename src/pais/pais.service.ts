import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { PaisEntity } from './pais.entity';

@Injectable()
export class PaisService {
  cacheKey = 'paises';
  constructor(
    @InjectRepository(PaisEntity)
    private readonly paisRepository: Repository<PaisEntity>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async findAll(): Promise<PaisEntity[]> {
    const cached = await this.cacheManager.get<PaisEntity[]>(this.cacheKey);

    if (cached) return cached;

    const cache = await this.paisRepository.find({
      relations: ['ciudades', 'culturasGastronomicas'],
    });
    await this.cacheManager.set(this.cacheKey, cache);
    return cache;
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

  async newFunction(): Promise<string> {
    console.log("newFunction")
    for (let i = 0; i < 10; i++) {
      console.log(i);
    }
    for (let i = 0; i < 10; i++) {
      console.log(i);
    }
    for (let i = 0; i < 10; i++) {
      console.log(i);
    }
    for (let i = 0; i < 10; i++) {
      console.log(i);
    }
    for (let i = 0; i < 10; i++) {
      console.log(i);
    }
    for (let i = 0; i < 10; i++) {
      console.log(i);
    }
    return "newFunction"
  }

  async anotherBadFunction(): Promise<string> {
    console.log("newFunction")
    for (let i = 0; i < 10; i++) {
      console.log(i);
    }
    for (let i = 0; i < 10; i++) {
      console.log(i);
    }
    for (let i = 0; i < 10; i++) {
      console.log(i);
    }
    for (let i = 0; i < 10; i++) {
      console.log(i);
    }
    for (let i = 0; i < 10; i++) {
      console.log(i);
    }
    for (let i = 0; i < 10; i++) {
      console.log(i);
    }
    return "newFunction"
  }
}
