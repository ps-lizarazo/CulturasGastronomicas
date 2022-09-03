import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { RecetaEntity } from './receta.entity';
import { CulturaGastronomicaEntity } from '../cultura_gastronomica/cultura_gastronomica.entity';
import { check } from 'prettier';
import { belongsTo } from '../shared/validation_tools/validations';

@Injectable()
export class RecetaService {
    constructor(
        @InjectRepository(RecetaEntity)
        private readonly recetaRepository: Repository<RecetaEntity>,
        @InjectRepository(CulturaGastronomicaEntity)
        private readonly culturaGastronomicaRepository: Repository<CulturaGastronomicaEntity>
    ){}

    async findAll(idCulturaGastronomica: string): Promise<RecetaEntity[]> {
        const culturaGastronomica: CulturaGastronomicaEntity = await this.culturaGastronomicaRepository.findOne({where: { id: `${idCulturaGastronomica}` }, relations: ["productos", "restaurantes", "recetas"]})

        if (!culturaGastronomica)
          throw new BusinessLogicException("La cultura gastronómica con el id brindado no ha sido encontrada.", BusinessError.NOT_FOUND);
        
        return culturaGastronomica.recetas;
    }

    async findOne(idCulturaGastronomica: string, idReceta: string): Promise<RecetaEntity> {
        const culturaGastronomica: CulturaGastronomicaEntity = await this.culturaGastronomicaRepository.findOne({where: { id: `${idCulturaGastronomica}` }, relations: ["productos", "restaurantes", "recetas"]})
        if (!culturaGastronomica)
            throw new BusinessLogicException("La cultura gastronómica con el id brindado no ha sido encontrada.", BusinessError.NOT_FOUND);

        const receta: RecetaEntity = await this.recetaRepository.findOne({where: { id: `${idReceta}` }})
        if (!receta)
            throw new BusinessLogicException("La receta con el id brindado no ha sido encontrada.", BusinessError.NOT_FOUND);
   
        if (!belongsTo(receta, culturaGastronomica.recetas))
            throw new BusinessLogicException("La receta con el id brindado no pertenece a la cultura gastrónomica dada por su id.", BusinessError.PRECONDITION_FAILED);

        return receta;
    }

    async create(idCulturaGastronomica: string, receta: RecetaEntity): Promise<RecetaEntity> {
        const culturaGastronomica: CulturaGastronomicaEntity = await this.culturaGastronomicaRepository.findOne({where: { id: `${idCulturaGastronomica}` }, relations: ["productos", "restaurantes", "recetas"]})

        if (!culturaGastronomica)
          throw new BusinessLogicException("La cultura gastronómica con el id brindado no ha sido encontrada.", BusinessError.NOT_FOUND);

        receta.culturaGastronomica = culturaGastronomica;
        return await this.recetaRepository.save(receta);
    }

    async update(idCulturaGastronomica: string, idReceta: string, receta: RecetaEntity): Promise<RecetaEntity> {
        const culturaGastronomica: CulturaGastronomicaEntity = await this.culturaGastronomicaRepository.findOne({where: { id: `${idCulturaGastronomica}` }, relations: ["productos", "restaurantes", "recetas"]})
        if (!culturaGastronomica)
            throw new BusinessLogicException("La cultura gastronómica con el id brindado no ha sido encontrada.", BusinessError.NOT_FOUND);

        const persistedReceta: RecetaEntity = await this.recetaRepository.findOne({where: { id: `${idReceta}` }})
        if (!persistedReceta)
            throw new BusinessLogicException("La receta con el id brindado no ha sido encontrada.", BusinessError.NOT_FOUND);
   
        if (!belongsTo(receta, culturaGastronomica.recetas))
            throw new BusinessLogicException("La receta con el id brindado no pertenece a la cultura gastrónomica dada por su id.", BusinessError.PRECONDITION_FAILED);

        return await this.recetaRepository.save({...persistedReceta, ...receta});
    }

    async delete(idCulturaGastronomica: string, idReceta: string) {
        const culturaGastronomica: CulturaGastronomicaEntity = await this.culturaGastronomicaRepository.findOne({where: { id: `${idCulturaGastronomica}` }, relations: ["productos", "restaurantes", "recetas"]})
        if (!culturaGastronomica)
            throw new BusinessLogicException("La cultura gastronómica con el id brindado no ha sido encontrada.", BusinessError.NOT_FOUND);

        const receta: RecetaEntity = await this.recetaRepository.findOne({where: { id: `${idReceta}` }})
        if (!receta)
            throw new BusinessLogicException("La receta con el id brindado no ha sido encontrada.", BusinessError.NOT_FOUND);
   
        if (!belongsTo(receta, culturaGastronomica.recetas))
            throw new BusinessLogicException("La receta con el id brindado no pertenece a la cultura gastrónomica dada por su id.", BusinessError.PRECONDITION_FAILED);
     
        await this.recetaRepository.remove(receta);
    }
}
