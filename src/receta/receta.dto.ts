import { IsNotEmpty, IsString, IsUrl } from "class-validator";

export class RecetaDto {
    @IsString()
    @IsNotEmpty()
    readonly nombre: string;

    @IsString()
    @IsNotEmpty()
    readonly descripcion: string;

    @IsUrl()
    @IsNotEmpty()
    readonly imageUrl: string;

    @IsString()
    @IsNotEmpty()
    readonly preparacion: string;

    @IsUrl()
    @IsNotEmpty()
    readonly preparacionUrl: string;
}
