import { IsNotEmpty, IsString } from 'class-validator';
export class CategoriaDto {
  @IsString()
  @IsNotEmpty()
  readonly nombre: string;
}
