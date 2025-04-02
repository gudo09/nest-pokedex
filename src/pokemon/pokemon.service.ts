import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model, mongo } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';

import { CreatePokemonDto, UpdatePokemonDto } from './dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel(Pokemon.name) // Decorador de @nestjs/mongoose para que podamos inyectar modelos al constructor del servicio
    private readonly pokemonModel: Model<Pokemon>,
  ) {}

  async create(createPokemonDto: CreatePokemonDto) {
    try {
      createPokemonDto.name = createPokemonDto.name.toLowerCase();
      const pokemon = await this.pokemonModel.create(createPokemonDto); // las insersiones en la base de datos son asincronas
      return pokemon;
    } catch (error: unknown) {
      this.handleExcetions(error);
    }
  }

  findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto; //Desestructuro y le asigno valores por defecto

    return this.pokemonModel
      .find()
      .limit(limit)
      .skip(offset)
      .sort({ no: 1 }) // ordeno de manera ascendente por "no"
      .select('-__v'); // oculto el campo "__v" de la respuesta
  }

  async findOne(term: string): Promise<Pokemon> {
    let pokemon: Pokemon | null = null;

    // si el termino es un numero
    if (!isNaN(+term)) pokemon = await this.pokemonModel.findOne({ no: term });

    // si el termino es un id de mongo
    if (!pokemon && isValidObjectId(term))
      pokemon = await this.pokemonModel.findById(term);

    // si el termino es un nombre de pokemon
    if (!pokemon) pokemon = await this.pokemonModel.findOne({ name: term });

    if (!pokemon)
      throw new NotFoundException(
        `No se encontró ningun pokemon con el id, no ó nombre ${term}.`,
      );

    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    try {
      // uso la funcion findOne() propia del servicio para encontrar el pokemon que quierp modificar
      const pokemon = await this.findOne(term);
      // Me aseguro de que el name venga en minusculas
      if (updatePokemonDto.name)
        updatePokemonDto.name = updatePokemonDto.name.toLowerCase();

      await pokemon.updateOne(updatePokemonDto);
      // Esparzo las propiedasdes del pokemon y le reescribo loas cambios del updatePokemonDto que ya está aprobado como valido en este punto
      return { ...pokemon.toJSON(), ...updatePokemonDto };
    } catch (error: unknown) {
      this.handleExcetions(error);
    }
  }

  async remove(id: string) {
    // uso la funcion findOne() propia del servicio para encontrar el pokemon que quierp modificar
    // const pokemon = await this.findOne(term);
    // await pokemon.deleteOne();
    // return { id };

    //const result = await this.pokemonModel.findByIdAndDelete(id);

    const { deletedCount } = await this.pokemonModel.deleteOne({
      _id: id,
    });

    if (deletedCount === 0)
      throw new BadRequestException(
        `No se ha encontrado un pokemon con el id ${id} para eliminar.`,
      );

    return;
  }

  private handleExcetions(error: unknown) {
    //unknown se maneja mas facil que any
    if (error instanceof mongo.MongoServerError && error.code === 11000)
      throw new BadRequestException(
        `El pokemon ya existe en la base de datos. ${JSON.stringify(error.keyValue)}`,
      );

    console.log(error);
    throw new InternalServerErrorException(
      'No se pudo crear el pokemon. Revise la consola.',
    );
  }
}
