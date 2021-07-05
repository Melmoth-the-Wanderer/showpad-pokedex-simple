import {Action} from "@ngrx/store";
import {PokeSate, PokesStateShape} from "../../model/pokes-state";
import {ActionType} from "../actions/action-type";
import {
  AddPokemonsToCaught,
  AddPokemonsToWishlisted,
  InitialPokesResourcesLoaded,
  RemovePokemonsFromCaught,
  RemovePokemonsFromWishlisted,
  UpdateDisplayedCaughtPokemons,
  UpdateDisplayedPokemons,
  UpdateDisplayedWishlistedPokemons
} from "../actions/poke-state-actions";

export function pokeStateReducer(state: PokesStateShape = new PokeSate(), action: Action): PokesStateShape {
  switch (action.type) {
    case(ActionType.InitialPokeResourcesLoaded): {
      const payload = (action as InitialPokesResourcesLoaded).payload;
      return {
        ...state,
        allPokemonNames: [...payload.pokeResources],
      };
    }
    case(ActionType.UpdateDisplayedPokes): {
      const payload = (action as UpdateDisplayedPokemons).payload;
      return {
        ...state,
        displayedPokemons: [...payload.pokemons],
      }
    }
    case(ActionType.UpdateDisplayedCaughtPokes): {
      const payload = (action as UpdateDisplayedCaughtPokemons).payload;
      return {
        ...state,
        displayedCaughtPokemons: [...payload.pokemons],
      }
    }
    case(ActionType.AddPokemonsToCaught): {
      const payload = (action as AddPokemonsToCaught).payload;
      const uncaughtPokemons = payload.pokemonNames.filter(pokeName => !state.allCaughtPokemonNames.includes(pokeName));
      return {
        ...state,
        allCaughtPokemonNames: [
          ...state.allCaughtPokemonNames,
          ...uncaughtPokemons,
        ]
      }
    }
    case(ActionType.UpdateDisplayedWishlistedPokes): {
      const payload = (action as UpdateDisplayedWishlistedPokemons).payload;
      return {
        ...state,
        displayedWishlistedPokemons: [...payload.pokemons],
      }
    }
    case(ActionType.AddPokemonsToWishlisted): {
      const payload = (action as AddPokemonsToWishlisted).payload;
      const unwishlistedPokemons = payload.pokemonNames.filter(pokeName => !state.allWishlistedPokemonNames.includes(pokeName));
      return {
        ...state,
        allWishlistedPokemonNames: [
          ...state.allWishlistedPokemonNames,
          ...unwishlistedPokemons,
        ]
      }
    }
    case(ActionType.RemovePokemonsFromCaught): {
      const payload = (action as RemovePokemonsFromCaught).payload;
      const caughtPokemons = state.allCaughtPokemonNames.filter(caughtPoke => !payload.pokemonNames.includes(caughtPoke));
      return {
        ...state,
        allCaughtPokemonNames: [
          ...caughtPokemons
        ]
      }
    }
    case(ActionType.RemovePokemonsFromWishlisted): {
      const payload = (action as RemovePokemonsFromWishlisted).payload;
      const wishlistedPokemons = state.allWishlistedPokemonNames.filter(wishlistedPoke => !payload.pokemonNames.includes(wishlistedPoke));
      return {
        ...state,
        allWishlistedPokemonNames: [
          ...wishlistedPokemons
        ]
      }
    }
    default: {
      return state;
    }
  }
}
