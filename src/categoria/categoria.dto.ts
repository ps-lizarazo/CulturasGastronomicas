import {IsNotEmpty, IsString, IsUrl} from 'class-validator';
export class CategoriaDto {

  @IsString()
  @IsNotEmpty()
  readonly nombre: string;
}
