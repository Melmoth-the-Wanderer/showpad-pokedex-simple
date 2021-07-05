import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Store} from '@ngrx/store';
import {IPokemon} from "pokeapi-typescript";
import {of, Subject} from 'rxjs';
import {take, takeUntil, tap} from "rxjs/operators";
import {
  ChangeDisplayedCaughtPokemons,
  ChangeDisplayedWishlistedPokemons
} from 'src/app/store/actions/poke-state-actions';
import {GuiState} from 'src/app/store/gui-state';
import {
  selectAllCaughtPokemonNames,
  selectAllWishlistedPokemonNames,
  selectDisplayedCaughtPokemons,
  selectDisplayedWishlistedPokemons
} from 'src/app/store/selectors/poke-state-selectors';
import {DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE} from "../../constants/size.constants";
import {pokeSlice} from "../../rx-pipes/poke-slice";
import {DataChanged} from './components/data-changed';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'poke-my-pokemons-page',
  templateUrl: './my-pokemons-page.component.html',
  styleUrls: ['./my-pokemons-page.component.scss']
})
export class MyPokemonsPageComponent implements OnInit, OnDestroy {

  public static readonly routeBasePath = 'my-pokemons';

  public allCaughtPokemonNames: string[] = [];
  public allWishlistedPokemonNames: string[] = [];
  public displayedCaughtPokemons: IPokemon[] = [];
  public displayedWishlistedPokemons: IPokemon[] = [];
  public refreshingPokemons = false;

  private componentDestroyed = new Subject<void>();

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly route: ActivatedRoute,
    private readonly store: Store<GuiState>,
  ) { }

  public ngOnDestroy(): void {
    this.componentDestroyed.next();
    this.componentDestroyed.complete();
  }

  public ngOnInit() {
    this.store.select(selectAllCaughtPokemonNames)
      .pipe(takeUntil(this.componentDestroyed))
      .subscribe(pokeNames => {
        this.allCaughtPokemonNames = pokeNames;
        this.refreshCaughtPokeList({
          pageIndex: DEFAULT_PAGE_INDEX,
          pageSize: DEFAULT_PAGE_SIZE,
        });
      });
      this.store.select(selectAllWishlistedPokemonNames)
        .pipe(takeUntil(this.componentDestroyed))
        .subscribe(pokeNames => {
          this.allWishlistedPokemonNames = pokeNames
          this.refreshWishlistedPokeList({
            pageIndex: DEFAULT_PAGE_INDEX,
            pageSize: DEFAULT_PAGE_SIZE,
          });
        });
    this.store.select(selectDisplayedCaughtPokemons)
      .pipe(takeUntil(this.componentDestroyed))
      .subscribe(pokemons => this.handleDisplayedCaughtPokesChanged(pokemons));
    this.store.select(selectDisplayedWishlistedPokemons)
      .pipe(takeUntil(this.componentDestroyed))
      .subscribe(pokemons => this.handleDisplayedWishlistedPokesChanged(pokemons));
  }

  public refreshCaughtPokeList(pageSetting: DataChanged): void {
    this.refreshingPokemons = true;
    of(this.allCaughtPokemonNames)
      .pipe(
        take(1),
        pokeSlice(pageSetting.pageIndex, pageSetting.pageSize),
        tap(pokeNames => this.store.dispatch(new ChangeDisplayedCaughtPokemons({
          pokemonNames: pokeNames
        })))
      ).subscribe();
  }

  private handleDisplayedCaughtPokesChanged(pokemons: IPokemon[]): void {
    this.refreshingPokemons = false;
    this.updateCaughtPokeList(pokemons);
    this.cdr.markForCheck();
  }

  private updateCaughtPokeList(pokemons: IPokemon[]): void {
    this.displayedCaughtPokemons = pokemons;
  }

  private handleDisplayedWishlistedPokesChanged(pokemons: IPokemon[]): void {
    this.refreshingPokemons = false;
    this.updateWishlistedPokeList(pokemons);
    this.cdr.markForCheck();
  }

  private updateWishlistedPokeList(pokemons: IPokemon[]): void {
    this.displayedWishlistedPokemons = pokemons;
  }

  public refreshWishlistedPokeList(pageSetting: DataChanged): void {
    this.refreshingPokemons = true;
    of(this.allWishlistedPokemonNames)
      .pipe(
        take(1),
        pokeSlice(pageSetting.pageIndex, pageSetting.pageSize),
        tap(pokeNames => this.store.dispatch(new ChangeDisplayedWishlistedPokemons({
          pokemonNames: pokeNames
        })))
      ).subscribe();
  }

}
