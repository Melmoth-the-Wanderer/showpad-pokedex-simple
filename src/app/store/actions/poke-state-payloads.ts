import {IPokemon} from "pokeapi-typescript";

export interface MultiplePokeResourcesPayload {
  pokeResources: string[];
}

export interface MultiplePokemonsPayload {
  pokemons: IPokemon[];
}

export interface MultiplePokemonNamesPayload {
  pokemonNames: string[];
}

export interface SinglePokemonNamePayload {
  pokemonName: string;
}
