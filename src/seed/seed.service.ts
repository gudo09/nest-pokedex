import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { HttpService } from '@nestjs/axios';

import { PokeResponse } from './interfaces/poke-response.interface';
import { Model } from 'mongoose';

import { Pokemon } from 'src/pokemon/entities/pokemon.entity';

@Injectable()
export class SeedService {
  baseURL = 'https://pokeapi.co/api/v2/pokemon?limit=85';

  constructor(
    private readonly httpService: HttpService,

    @InjectModel(Pokemon.name) // Decorador de @nestjs/mongoose para que podamos inyectar modelos al constructor del servicio
    private readonly pokemonModel: Model<Pokemon>,
  ) {}

  async runSeed() {
    const { data } = await this.httpService.axiosRef.get<PokeResponse>(
      this.baseURL,
    );

    for (const { name, url } of data.results) { // Foreach no puede manejar promesas. For of sí puede hacerlo
      const segments = url.split('/');

      const no: number = +segments[segments.length - 2];

      await this.pokemonModel.create({ name, no });
    }
    return 'Seed executed';
  }
}
