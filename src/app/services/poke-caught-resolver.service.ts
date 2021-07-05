import {ErrorHandler, Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {Store} from "@ngrx/store";
import {IPokemon} from "pokeapi-typescript";
import {Observable} from "rxjs";
import {catchError, mergeMap, switchMap, take, tap} from "rxjs/operators";
import {DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE} from "../constants/size.constants";
import {pokeSlice} from "../rx-pipes/poke-slice";
import {UpdateDisplayedCaughtPokemons, UpdateDisplayedWishlistedPokemons} from "../store/actions/poke-state-actions";
import {GuiState} from "../store/gui-state";
import {selectAllCaughtPokemonNames, selectAllWishlistedPokemonNames} from "../store/selectors/poke-state-selectors";
import {PokeApiService} from "./poke-api.service";

@Injectable({
  providedIn: 'root'
})
export class PokeCaughtResolverService implements Resolve<IPokemon[]> {

  constructor(
    private readonly api: PokeApiService,
    private readonly errorHandler: ErrorHandler,
    private readonly store: Store<GuiState>,
  ) {
  }

  public resolve(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Observable<IPokemon[]> {
    return this.store.select(selectAllCaughtPokemonNames)
      .pipe(
        take(1),
        pokeSlice(DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE),
        mergeMap(pokeNames => this.api.getPokemons(pokeNames).pipe(
          take(1),
          tap(pokemons => this.store.dispatch(new UpdateDisplayedCaughtPokemons({
            pokemons: pokemons
          }))),
          catchError(error => {
            this.handlePokemonApiError(error);
            throw error;
          }),
        )),
        mergeMap(() => this.store.select(selectAllWishlistedPokemonNames).pipe(
          take(1),
          pokeSlice(DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE),
          switchMap(pokeNames => this.api.getPokemons(pokeNames).pipe(
            tap(pokemons => this.store.dispatch(new UpdateDisplayedWishlistedPokemons({
              pokemons: pokemons
            }))),
          )),
        ))
      )
  }

  private handlePokemonApiError(error: any): void {
    this.errorHandler.handleError({
      error: error,
      when: 'retrieving poke details',
    });
  }

}
