import {IPokemon} from "pokeapi-typescript";

export interface PokesStateShape {
  allPokemonNames: string[];
  allCaughtPokemonNames: string[];
  allWishlistedPokemonNames: string[];
  displayedPokemons: IPokemon[];
  displayedCaughtPokemons: IPokemon[];
  displayedWishlistedPokemons: IPokemon[];
}

export class PokeSate implements PokesStateShape {
  public allPokemonNames: string[] = [];
  public allCaughtPokemonNames: string[] = [];
  public allWishlistedPokemonNames: string[] = [];
  public displayedPokemons: IPokemon[] = [];
  public displayedCaughtPokemons: IPokemon[] = [];
  public displayedWishlistedPokemons: IPokemon[] = [];
}
