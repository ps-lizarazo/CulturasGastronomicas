import { IsNotEmpty, IsString } from 'class-validator';

export class RestauranteDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;
}
