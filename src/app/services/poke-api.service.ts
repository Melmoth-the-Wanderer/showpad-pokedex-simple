import {Injectable} from '@angular/core';
import PokeAPI, {INamedApiResourceList, IPokemon, IType} from "pokeapi-typescript";
import {INamedApiResource} from "pokeapi-typescript/dist/interfaces/Utility/NamedApiResourceList";
import {forkJoin, from, Observable, of} from 'rxjs';
import {map, switchMap, take} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PokeApiService {

  public getAllPokemonResources(): Observable<INamedApiResource<IPokemon>[]> {
    return from(PokeAPI.Pokemon.list(1, 0))
      .pipe(
        switchMap(pokeResourceResult => this.getApiPokeList(pokeResourceResult.count, 0)),
        map(allResourceList => allResourceList.results.sort(this.pokeResourceSorter)),
      );
  }

  private pokeResourceSorter(a: INamedApiResource<IPokemon>, b: INamedApiResource<IPokemon>): number {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  }

  private getApiPokeList(limit: number, offset: number): Observable<INamedApiResourceList<IPokemon>> {
    return from(PokeAPI.Pokemon.list(limit, offset));
  }

  public getPokemons(pokemonNames: string[]): Observable<IPokemon[]> {
    if (pokemonNames.length) {

      return forkJoin(pokemonNames.map(name => from(PokeAPI.Pokemon.fetch(name))));
    }

    return of([]);
  }

  public getPokemon(pokemonName: string): Observable<IPokemon> {
    if (!pokemonName) {

      throw new Error(`Invalid Pokemon name`);
    }
    return from(PokeAPI.Pokemon.fetch(pokemonName)).pipe(take(1));
  }

  public getType(typeName: string): Observable<IType> {
    return from(PokeAPI.Type.fetch(typeName)).pipe(take(1));
  }

}
