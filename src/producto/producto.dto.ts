import {IsNotEmpty, IsString, IsUrl} from 'class-validator';


export class ProductoDto {

  @IsString()
  @IsNotEmpty()
  readonly nombre: string;

  @IsString()
  @IsNotEmpty()
  readonly descripcion: string;

  @IsString()
  readonly historia: string;

}
