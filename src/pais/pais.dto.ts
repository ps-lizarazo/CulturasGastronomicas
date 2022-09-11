import { IsNotEmpty, IsString } from 'class-validator';

export class PaisDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;
}
