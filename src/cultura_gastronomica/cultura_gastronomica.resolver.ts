import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { plainToInstance } from 'class-transformer';
import { CulturaGastronomicaDto } from './cultura_gastronomica.dto';
import { CulturaGastronomicaEntity } from './cultura_gastronomica.entity';
import { CulturaGastronomicaService } from './cultura_gastronomica.service';

@Resolver()
export class CulturaGastronomicaResolver {
    constructor(private culturaGastronomicaService: CulturaGastronomicaService) { }

    @Query(() => [CulturaGastronomicaEntity])
    culturasGastronomicas(): Promise<CulturaGastronomicaEntity[]> {
        return this.culturaGastronomicaService.findAll();
    }

    @Query(() => CulturaGastronomicaEntity)
    culturasGastronomica(@Args('id') id: string): Promise<CulturaGastronomicaEntity> {
        return this.culturaGastronomicaService.findOne(id);
    }

    @Mutation(() => CulturaGastronomicaEntity)
    createCulturaGastronomica(@Args('culturaGastronomica') culturaGastronomicaDto: CulturaGastronomicaDto): Promise<CulturaGastronomicaEntity> {
        const culturaGastronomica = plainToInstance(CulturaGastronomicaEntity, culturaGastronomicaDto);
        return this.culturaGastronomicaService.create(culturaGastronomica);
    }

    @Mutation(() => CulturaGastronomicaEntity)
    updateCulturaGastronomica(@Args('id') id: string, @Args('culturaGastronomica') culturaGastronomicaDto: CulturaGastronomicaDto): Promise<CulturaGastronomicaEntity> {
        const culturaGastronomica = plainToInstance(CulturaGastronomicaEntity, culturaGastronomicaDto);
        return this.culturaGastronomicaService.update(id, culturaGastronomica);
    }

    @Mutation(() => String)
    deleteCulturaGastronomica(@Args('id') id: string) {
        this.culturaGastronomicaService.delete(id);
        return id;
    }
}
