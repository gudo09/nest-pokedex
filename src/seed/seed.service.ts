import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { HttpService } from '@nestjs/axios';

import { PokeResponse } from './interfaces/poke-response.interface';
import { Model } from 'mongoose';

import { Pokemon } from 'src/pokemon/entities/pokemon.entity';

@Injectable()
export class SeedService {
  baseURL = 'https://pokeapi.co/api/v2/pokemon?limit=385';

  constructor(
    private readonly httpService: HttpService,

    @InjectModel(Pokemon.name) // Decorador de @nestjs/mongoose para que podamos inyectar modelos al constructor del servicio
    private readonly pokemonModel: Model<Pokemon>,
  ) {}

  async runSeed() {
    await this.pokemonModel.deleteMany({}); // borro toda la info que tengo en la coleccion antes de generar la seed

    const { data } = await this.httpService.axiosRef.get<PokeResponse>(
      this.baseURL,
    );
    // ----------------------------------------------------------------

    /*  // Método 1- Esta manera no es eficiente porque espera por cada iteracion del forof a que la promesa se resuelva
    for (const { name, url } of data.results) { // Foreach no puede manejar promesas. For of sí puede hacerlo
      const segments = url.split('/');
      const no: number = +segments[segments.length - 2];
      await this.pokemonModel.create({ name, no });
    } */

    // ----------------------------------------------------------------
    /*  // Método 2 - Es más rápido que el metodo 1 pero sigo teniendo el problema que hago muchas consultas a la base de datos
    const insertPromiseArray: Promise<Pokemon>[] = [];

    data.results.forEach(({ name, url }) => {
      const segments = url.split('/');
      const no: number = +segments[segments.length - 2];
      insertPromiseArray.push(this.pokemonModel.create({ no, name }));
    });

    await Promise.all(insertPromiseArray); //Espero que el arreglo de Promesas se resuelva */

    // ----------------------------------------------------------------

    // Método 3 - Una sola consulta para insertar muchos documentos
    const pokemonToInsert: { no: number; name: string }[] = [];

    data.results.forEach(({ name, url }) => {
      const segments = url.split('/');
      const no: number = +segments[segments.length - 2];
      pokemonToInsert.push({ no, name });
    });

    await this.pokemonModel.insertMany(pokemonToInsert);
    // ----------------------------------------------------------------

    return 'Seed executed';
  }
}
