import { IsNotEmpty, IsString } from 'class-validator';

export class EstrellasMichelinDto {
  @IsNotEmpty()
  @IsString()
  fechaConsecucion: Date;
}
