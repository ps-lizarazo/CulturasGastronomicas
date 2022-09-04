import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriaEntity } from '../../categoria/categoria.entity';
import { ProductoEntity } from '../../producto/producto.entity';
import { CulturaGastronomicaEntity } from '../../cultura_gastronomica/cultura_gastronomica.entity';
import { RecetaEntity } from '../../receta/receta.entity';
import { RestauranteEntity } from '../../restaurante/restaurante.entity';
import { EstrellasMichelinEntity } from '../../estrellas_michelin/estrellas_michelin.entity';
import { CiudadEntity } from '../../ciudad/ciudad.entity';
import { PaisEntity } from '../../pais/pais.entity';

export const TypeOrmTestingConfig = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: [
      CategoriaEntity,
      ProductoEntity,
      CulturaGastronomicaEntity,
      RecetaEntity,
      RestauranteEntity,
      EstrellasMichelinEntity,
      CiudadEntity,
      PaisEntity,
    ],
    synchronize: true,
    keepConnectionAlive: true,
  }),
  TypeOrmModule.forFeature([
    CategoriaEntity,
    ProductoEntity,
    CulturaGastronomicaEntity,
    RecetaEntity,
    RestauranteEntity,
    EstrellasMichelinEntity,
    CiudadEntity,
    PaisEntity,
  ]),
];
