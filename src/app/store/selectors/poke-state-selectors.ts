import {createSelector} from "@ngrx/store";
import {GuiState} from "../gui-state";

export const selectPokesState = (state: GuiState) => state.pokesState;

export const selectAllPokeNames = createSelector(
  selectPokesState,
  (state) => state.allPokemonNames,
)

export const selectDisplayedPokemons = createSelector(
  selectPokesState,
  (state) => state.displayedPokemons,
)

export const selectAllCaughtPokemonNames = createSelector(
  selectPokesState,
  (state) => state.allCaughtPokemonNames,
)

export const selectAllWishlistedPokemonNames = createSelector(
  selectPokesState,
  (state) => state.allWishlistedPokemonNames,
)

export const selectDisplayedCaughtPokemons = createSelector(
  selectPokesState,
  (state) => state.displayedCaughtPokemons,
)

export const selectDisplayedWishlistedPokemons = createSelector(
  selectPokesState,
  (state) => state.displayedWishlistedPokemons,
)
