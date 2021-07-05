import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl} from "@angular/forms";
import {Store} from '@ngrx/store';
import {IPokemon} from "pokeapi-typescript";
import {of, Subject} from "rxjs";
import {debounceTime, distinctUntilChanged, take, takeUntil, tap} from "rxjs/operators";
import {DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE} from '../../constants/size.constants';
import {pokeSlice} from "../../rx-pipes/poke-slice";
import {ChangeDisplayedPokemons} from "../../store/actions/poke-state-actions";
import {GuiState} from "../../store/gui-state";
import {selectAllPokeNames, selectDisplayedPokemons} from "../../store/selectors/poke-state-selectors";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-poke-list',
  templateUrl: './poke-list-page.component.html',
  styleUrls: ['./poke-list-page.component.scss']
})
export class PokeListPageComponent implements OnInit, OnDestroy {

  public static readonly routeBasePath = 'poke-list';

  public refreshingPokemons = false;
  public pokeList: IPokemon[] = [];
  public pokeSearchControl = new FormControl('');

  public get pokemonNames(): string[] {
    if (this.filteredPokemonNames) {
      return this.filteredPokemonNames;
    }
    return this.allPokemonNames;
  }

  private componentDestroyed = new Subject<void>();
  private pageIndex = DEFAULT_PAGE_INDEX;
  private pageSize = DEFAULT_PAGE_SIZE;

  private allPokemonNames: string[] = [];
  private filteredPokemonNames: string[] | null = null;

  constructor(
    public readonly store: Store<GuiState>,
    private readonly cdr: ChangeDetectorRef,
  ) {
  }

  public ngOnDestroy(): void {
    this.componentDestroyed.next();
    this.componentDestroyed.complete();
  }

  public ngOnInit(): void {
    this.store.select(selectAllPokeNames)
      .pipe(takeUntil(this.componentDestroyed))
      .subscribe(pokeNames => this.allPokemonNames = pokeNames);
    this.store.select(selectDisplayedPokemons)
      .pipe(takeUntil(this.componentDestroyed))
      .subscribe(pokemons => this.handleDisplayedPokesChanged(pokemons));
    this.pokeSearchControl.valueChanges
      .pipe(
        takeUntil(this.componentDestroyed),
        debounceTime(750),
        distinctUntilChanged(),
      )
      .subscribe((searchTerm: string) => {
        this.refreshPokeListWithFilter(searchTerm);
      });
  }

  private refreshPokeListWithFilter(filter: string | null): void {
    this.filterPokeList(filter);
    this.pageIndex = 1;
    this.refreshPokeList();
  }

  private filterPokeList(searchPokeName: string | null): void {
    if (!!searchPokeName) {
      this.filteredPokemonNames = this.allPokemonNames.filter(name =>
        this.pokeNameMatches(name, searchPokeName)
      );
    } else {
      this.filteredPokemonNames = null;
    }
  }

  private pokeNameMatches(pokeName: string, searchTerm: string): boolean {
    return pokeName === searchTerm || pokeName.includes(searchTerm);
  }

  public async pageIndexChange(newIndex: number): Promise<void> {
    this.pageIndex = newIndex;
    this.refreshPokeList();
  }

  public async pageSizeChange(newSize: number): Promise<void> {
    this.pageSize = newSize;
    this.refreshPokeList();
  }

  private refreshPokeList(): void {
    this.refreshingPokemons = true;
    of(this.pokemonNames)
      .pipe(
        take(1),
        pokeSlice(this.pageIndex, this.pageSize),
        tap(pokeNames => this.store.dispatch(new ChangeDisplayedPokemons({
          pokemonNames: pokeNames
        })))
      ).subscribe();
  }

  private handleDisplayedPokesChanged(pokemons: IPokemon[]): void {
    this.refreshingPokemons = false;
    this.updatePokeList(pokemons);
    this.cdr.markForCheck();
  }

  private updatePokeList(pokemons: IPokemon[]): void {
    this.pokeList = pokemons;
  }

  public clearSearchInput(): void {
    this.pokeSearchControl.setValue('', {emitEvent: false});
    this.refreshPokeListWithFilter('');
  }

}
