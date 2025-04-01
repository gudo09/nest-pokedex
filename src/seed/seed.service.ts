import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { PokeResponse } from './interfaces/poke-response.interface';

@Injectable()
export class SeedService {
  baseURL = 'https://pokeapi.co/api/v2/pokemon?limit=85';
  constructor(private readonly httpService: HttpService) {}

  async runSeed() {
    const { data } = await this.httpService.axiosRef.get<PokeResponse>(
      this.baseURL,
    );

    data.results.forEach(({ name, url }) => {
      const segments = url.split('/');

      const no: number = +segments[segments.length - 2];

      console.log({ name, no });
    });
    return data.results;
  }
}
