import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class PaisDto {
  @Field()
  @IsNotEmpty()
  @IsString()
  nombre: string;
}
