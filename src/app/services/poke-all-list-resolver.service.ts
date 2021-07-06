import {ErrorHandler, Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {Store} from "@ngrx/store";
import {IPokemon} from "pokeapi-typescript";
import {Observable} from "rxjs";
import {catchError, switchMap, take, tap} from "rxjs/operators";
import {DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE} from "../constants/size.constants";
import {pokeSlice} from "../modules/utils/rx-pipes/poke-slice";
import {ReportAppRouteLoaded, ReportAppRouteLoading} from "../store/actions/app-state-actions";
import {UpdateDisplayedPokemons} from "../store/actions/poke-state-actions";
import {GuiState} from "../store/gui-state";
import {selectAllPokeNames} from "../store/selectors/poke-state-selectors";
import {PokeApiService} from "./poke-api.service";

@Injectable({
  providedIn: 'root'
})
export class PokeAllListResolverService implements Resolve<IPokemon[]> {

  constructor(
    private readonly api: PokeApiService,
    private readonly errorHandler: ErrorHandler,
    private readonly store: Store<GuiState>,
  ) {
  }

  public resolve(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Observable<IPokemon[]> {
    this.store.dispatch(new ReportAppRouteLoading());

    return this.store.select(selectAllPokeNames)
      .pipe(
        take(1),
        pokeSlice(DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE),
        switchMap(pokeNames => this.api.getPokemons(pokeNames).pipe(
          tap(pokemons => this.store.dispatch(new UpdateDisplayedPokemons({
            pokemons: pokemons
          }))),
          tap(() => this.store.dispatch(new ReportAppRouteLoaded())),
          catchError(error => {
            this.handlePokemonApiError(error);
            throw error;
          }),
        )),
      )
  }

  private handlePokemonApiError(error: any): void {
    this.errorHandler.handleError({
      error: error,
      when: 'retrieving poke details',
    });
  }

}
