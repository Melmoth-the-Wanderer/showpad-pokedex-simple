import {Action} from "@ngrx/store";
import {ActionType} from "./action-type";
import {
  SinglePokemonNamePayload,
  MultiplePokemonNamesPayload,
  MultiplePokeResourcesPayload,
  MultiplePokemonsPayload as MultiplePokemonsPayload
} from "./poke-state-payloads";

export class InitialPokesResourcesLoaded implements Action {
  public type = ActionType.InitialPokeResourcesLoaded;
  constructor(
    public payload: MultiplePokeResourcesPayload,
  ) {
  }
}

export class UpdateDisplayedPokemons implements Action {
  public type = ActionType.UpdateDisplayedPokes;
  constructor(
    public payload: MultiplePokemonsPayload,
  ) {
  }
}

export class UpdateDisplayedCaughtPokemons implements Action {
  public type = ActionType.UpdateDisplayedCaughtPokes;
  constructor(
    public payload: MultiplePokemonsPayload,
  ) {
  }
}

export class UpdateDisplayedWishlistedPokemons implements Action {
  public type = ActionType.UpdateDisplayedWishlistedPokes;
  constructor(
    public payload: MultiplePokemonsPayload,
  ) {
  }
}

export class ChangeDisplayedPokemons implements Action {
  public type = ActionType.ChangeDisplayedPokemons;
  constructor(
    public payload: MultiplePokemonNamesPayload,
  ) {
  }
}

export class ChangeDisplayedCaughtPokemons implements Action {
  public type = ActionType.ChangeDisplayedCaughtPokemons;
  constructor(
    public payload: MultiplePokemonNamesPayload,
  ) {
  }
}

export class ChangeDisplayedWishlistedPokemons implements Action {
  public type = ActionType.ChangeDisplayedWishlistedPokemons;
  constructor(
    public payload: MultiplePokemonNamesPayload,
  ) {
  }
}


export class CatchPokemon implements Action {
  public type = ActionType.CatchPokemon;
  constructor(
    public payload: SinglePokemonNamePayload,
  ) {
  }
}


export class AddPokemonsToCaught implements Action {
  public type = ActionType.AddPokemonsToCaught;
  constructor(
    public payload: MultiplePokemonNamesPayload,
  ) {
  }
}

export class WishlistPokemon implements Action {
  public type = ActionType.WishlistPokemon;
  constructor(
    public payload: SinglePokemonNamePayload,
  ) {
  }
}

export class AddPokemonsToWishlisted implements Action {
  public type = ActionType.AddPokemonsToWishlisted;
  constructor(
    public payload: MultiplePokemonNamesPayload,
  ) {
  }
}

export class ReleasePokemon implements Action {
  public type = ActionType.ReleasePokemon;
  constructor(
    public payload: SinglePokemonNamePayload,
  ) {
  }
}

export class RemovePokemonsFromCaught implements Action {
  public type = ActionType.RemovePokemonsFromCaught;
  constructor(
    public payload: MultiplePokemonNamesPayload,
  ) {
  }
}

export class UnwishlitPokemon implements Action {
  public type = ActionType.UnwishlistPokemon;
  constructor(
    public payload: SinglePokemonNamePayload,
  ) {
  }
}

export class RemovePokemonsFromWishlisted implements Action {
  public type = ActionType.RemovePokemonsFromWishlisted;
  constructor(
    public payload: MultiplePokemonNamesPayload,
  ) {
  }
}
