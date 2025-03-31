import { IsInt, IsPositive, IsString, MinLength } from 'class-validator';

export class CreatePokemonDto {
  @IsInt({ message: 'El campo "no" debe ser un número.' })
  @IsPositive({ message: 'El campo "no" debe ser un positivo.' })
  no: number;

  @IsString({ message: 'El campo "name" debe ser un string.' })
  @MinLength(1, {
    message: 'El campo "name" debe ser de mínimo 1 caracter.',
  })
  name: string;
}
