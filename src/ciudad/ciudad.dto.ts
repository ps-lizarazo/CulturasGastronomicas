import { IsNotEmpty, IsString } from 'class-validator';

export class CiudadDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;
}
