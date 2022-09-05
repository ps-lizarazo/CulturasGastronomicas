import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CulturaGastronomicaEntity } from '../cultura_gastronomica/cultura_gastronomica.entity';
import { RecetaEntity } from '../receta/receta.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class RecetaCulturaGastronomicaService {
    constructor(
        @InjectRepository(CulturaGastronomicaEntity)
        private readonly culturaGastronomicaRepository: Repository<CulturaGastronomicaEntity>,

        @InjectRepository(RecetaEntity)
        private readonly recetaRepository: Repository<RecetaEntity>
    ) { }

    async addRecetaCulturaGastronomica(culturaGastronomicaId: string, recetaId: string): Promise<CulturaGastronomicaEntity> {
        const receta: RecetaEntity = await this.recetaRepository.findOne({ where: { id: recetaId } });
        if (!receta)
            throw new BusinessLogicException("No se encontro la receta con el id suministrado", BusinessError.NOT_FOUND);

        const culturaGastronomica: CulturaGastronomicaEntity = await this.culturaGastronomicaRepository.findOne({ where: { id: culturaGastronomicaId }, relations: ["recetas"] })

        if (!culturaGastronomica)
            throw new BusinessLogicException("No se encontro la cultura gastronómica con el id suministrado", BusinessError.NOT_FOUND);

        culturaGastronomica.recetas = [...culturaGastronomica.recetas, receta];
        return await this.culturaGastronomicaRepository.save(culturaGastronomica)
    }

    async findRecetaByCulturaGastronomicaIdRecetaId(culturaGastronomicaId: string, recetaId: string): Promise<RecetaEntity> {
        const receta: RecetaEntity = await this.recetaRepository.findOne({ where: { id: recetaId } });
        if (!receta)
            throw new BusinessLogicException("No se encontro la receta con el id suministrado", BusinessError.NOT_FOUND)

        const culturaGastronomica: CulturaGastronomicaEntity = await this.culturaGastronomicaRepository.findOne({ where: { id: culturaGastronomicaId }, relations: ["recetas"] });
        if (!culturaGastronomica)
            throw new BusinessLogicException("No se encontro la cultura gastronómica con el id suministrado", BusinessError.NOT_FOUND)

        const recetaCulturaGastronomica: RecetaEntity = culturaGastronomica.recetas.find(e => e.id === receta.id);

        if (!recetaCulturaGastronomica)
            throw new BusinessLogicException("La receta con el id suministrado no esta asociado a la cultura gastronómica", BusinessError.PRECONDITION_FAILED)

        return recetaCulturaGastronomica;
    }

    async findRecetasByCulturaGastronomicaId(culturaGastronomicaId: string): Promise<RecetaEntity[]> {
        const culturaGastronomica: CulturaGastronomicaEntity = await this.culturaGastronomicaRepository.findOne({ where: { id: culturaGastronomicaId }, relations: ["recetas"] });
        if (!culturaGastronomica)
            throw new BusinessLogicException("No se encontro la cultura gastronómica con el id suministrado", BusinessError.NOT_FOUND)

        return culturaGastronomica.recetas;
    }

    async associateRecetasCulturaGastronomica(culturaGastronomicaId: string, recetas: RecetaEntity[]): Promise<CulturaGastronomicaEntity> {
        const culturaGastronomica: CulturaGastronomicaEntity = await this.culturaGastronomicaRepository.findOne({ where: { id: culturaGastronomicaId }, relations: ["recetas"] });

        if (!culturaGastronomica)
            throw new BusinessLogicException("No se encontro la cultura gastronómica con el id suministrado", BusinessError.NOT_FOUND)

        for (let i = 0; i < recetas.length; i++) {
            const receta: RecetaEntity = await this.recetaRepository.findOne({ where: { id: recetas[i].id } });
            if (!receta)
                throw new BusinessLogicException("No se encontro la receta con el id suministrado", BusinessError.NOT_FOUND)
        }

        culturaGastronomica.recetas = recetas;
        return await this.culturaGastronomicaRepository.save(culturaGastronomica);
    }

    async deleteRecetaCulturaGastronomica(culturaGastronomicaId: string, recetaId: string) {
        const receta: RecetaEntity = await this.recetaRepository.findOne({ where: { id: recetaId } });
        if (!receta)
            throw new BusinessLogicException("No se encontro la receta con el id suministrado", BusinessError.NOT_FOUND)

        const culturaGastronomica: CulturaGastronomicaEntity = await this.culturaGastronomicaRepository.findOne({ where: { id: culturaGastronomicaId }, relations: ["recetas"] });
        if (!culturaGastronomica)
            throw new BusinessLogicException("No se encontro la cultura gastronómica con el id suministrado", BusinessError.NOT_FOUND)

        const recetaCulturaGastronomica: RecetaEntity = culturaGastronomica.recetas.find(e => e.id === receta.id);

        if (!recetaCulturaGastronomica)
            throw new BusinessLogicException("La receta con el id suministrado no esta asociado a la cultura gastronómica", BusinessError.PRECONDITION_FAILED)

        culturaGastronomica.recetas = culturaGastronomica.recetas.filter(e => e.id !== recetaId);
        await this.culturaGastronomicaRepository.save(culturaGastronomica);
    }
}
