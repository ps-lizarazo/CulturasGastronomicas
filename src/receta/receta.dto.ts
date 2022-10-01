import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

@InputType()
export class RecetaDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  readonly nombre: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  readonly descripcion: string;

  @Field()
  @IsUrl()
  @IsNotEmpty()
  readonly imageUrl: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  readonly preparacion: string;

  @Field()
  @IsUrl()
  @IsNotEmpty()
  readonly preparacionUrl: string;
}
