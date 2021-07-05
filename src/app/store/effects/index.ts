import { ErrorHandler, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { of } from "rxjs";
import { catchError, map, switchMap, tap } from "rxjs/operators";
import { PokeApiService } from "../../services/poke-api.service";
import { PokeStorageService } from "../../services/poke-storage.service";
import { ActionType } from "../actions/action-type";
import { InitializeApp, ReportAppInitialized } from "../actions/app-state-actions";
import {
  AddPokemonsToCaught,
  AddPokemonsToWishlisted,
  CatchPokemon,
  ChangeDisplayedCaughtPokemons,
  ChangeDisplayedPokemons,
  ChangeDisplayedWishlistedPokemons,
  InitialPokesResourcesLoaded,
  RemovePokemonsFromCaught,
  RemovePokemonsFromWishlisted,
  UnwishlitPokemon,
  UpdateDisplayedCaughtPokemons,
  UpdateDisplayedPokemons,
  UpdateDisplayedWishlistedPokemons,
  WishlistPokemon
} from "../actions/poke-state-actions";
import { GuiState } from "../gui-state";

@Injectable()
export class PokeEffects {

  public initializeApp$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType<InitializeApp>(ActionType.InitializeApp),
        tap(() =>  {
          const caughtPokeNames = this.storage.getCaughtPokeNames();
          this.store.dispatch(new AddPokemonsToCaught({
            pokemonNames: caughtPokeNames,
          }))}
        ),
        tap(() => {
          const wishlistedPokeNames = this.storage.getWishlistedPokeNames();
          this.store.dispatch(new AddPokemonsToWishlisted({
            pokemonNames: wishlistedPokeNames,
          }))
        }),
        switchMap((_action) => this.api.getAllPokemonResources().pipe(
          map(allPokeResources => allPokeResources.map(resource => resource.name)),
          tap(allPokesNames => this.store.dispatch(new InitialPokesResourcesLoaded({
            pokeResources: allPokesNames,
          }))),
          map(() => new ReportAppInitialized()),
          catchError(error => {
            this.errorHandler.handleError(error);
            return of(error); // TODO:
          }),
        )),
      )
    }
  );

  public changeDisplayedPokemons$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType<ChangeDisplayedPokemons>(ActionType.ChangeDisplayedPokemons),
        switchMap(action => this.api.getPokemons(action.payload.pokemonNames).pipe(
          map(pokemonsToDisplay => new UpdateDisplayedPokemons({
            pokemons: pokemonsToDisplay
          })),
          catchError(error => {
            this.errorHandler.handleError(error);
            return of(error); // TODO:
          })
        ))
      )
    }
  );

  public changeDisplayedCaughtPokemons$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType<ChangeDisplayedCaughtPokemons>(ActionType.ChangeDisplayedCaughtPokemons),
        switchMap(action => this.api.getPokemons(action.payload.pokemonNames).pipe(
          map(pokemonsToDisplay => new UpdateDisplayedCaughtPokemons({
            pokemons: pokemonsToDisplay
          })),
          catchError(error => {
            this.errorHandler.handleError(error);
            return of(error); // TODO:
          })
        ))
      )
    }
  );

  public catchPokemon$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType<CatchPokemon>(ActionType.CatchPokemon),
        tap(action => this.storage.addCaughtPoke(action.payload.pokemonName)),
        tap(results => this.store.dispatch(new RemovePokemonsFromWishlisted({
          pokemonNames: [results.payload.pokemonName],
        }))),
        map(results => new AddPokemonsToCaught({
          pokemonNames: [results.payload.pokemonName],
        })),
        catchError(error => {
          this.errorHandler.handleError(error);
          return of(new AddPokemonsToCaught({
            pokemonNames: [],
          }));
        })
      )
    }
  )

  public releasePokemon$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType<CatchPokemon>(ActionType.ReleasePokemon),
        tap(action => this.storage.removeCaughtPoke(action.payload.pokemonName)),
        map(action => new RemovePokemonsFromCaught({
          pokemonNames: [action.payload.pokemonName],
        })),
        catchError(error => {
          this.errorHandler.handleError(error);
          return of(new RemovePokemonsFromCaught({
            pokemonNames: [],
          }));
        }),
      )
    }
  )

  public changeDisplayedWishlistedPokemons$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType<ChangeDisplayedWishlistedPokemons>(ActionType.ChangeDisplayedWishlistedPokemons),
        switchMap(action => this.api.getPokemons(action.payload.pokemonNames).pipe(
          map(pokemonsToDisplay => new UpdateDisplayedWishlistedPokemons({
            pokemons: pokemonsToDisplay
          })),
          catchError(error => {
            this.errorHandler.handleError(error);
            return of(error); // TODO:
          })
        ))
      )
    }
  );

  public wishlistPokemon$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType<WishlistPokemon>(ActionType.WishlistPokemon),
        tap(action => this.storage.addWishlistedPoke(action.payload.pokemonName)),
        map(results => new AddPokemonsToWishlisted({
          pokemonNames: [results.payload.pokemonName],
        })),
        catchError(error => {
          this.errorHandler.handleError(error);
          return of(error); // TODO:
        })
      )
    }
  )

  public unwishlistPokemon$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType<UnwishlitPokemon>(ActionType.UnwishlistPokemon),
        tap(action => this.storage.removeCaughtPoke(action.payload.pokemonName)),
        map(action => new RemovePokemonsFromWishlisted({
          pokemonNames: [action.payload.pokemonName],
        })),
        catchError(error => {
          this.errorHandler.handleError(error);
          return of(error); // TODO:
        }),
      )
    }
  )

  constructor(
    private readonly actions$: Actions,
    private readonly api: PokeApiService,
    private readonly errorHandler: ErrorHandler,
    private readonly storage: PokeStorageService,
    private readonly store: Store<GuiState>,
  ) {
  }
}
