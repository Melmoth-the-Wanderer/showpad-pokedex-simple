import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges
} from '@angular/core';
import {Router} from "@angular/router";
import {Store} from '@ngrx/store';
import {IPokemon} from "pokeapi-typescript";
import {Subject} from 'rxjs/internal/Subject';
import {takeUntil} from "rxjs/operators";
import {CatchPokemon, ReleasePokemon, UnwishlitPokemon, WishlistPokemon} from "../../../store/actions/poke-state-actions";
import {GuiState} from "../../../store/gui-state";
import {selectAllCaughtPokemonNames, selectAllWishlistedPokemonNames} from "../../../store/selectors/poke-state-selectors";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'poke-list',
  templateUrl: './poke-list.component.html',
  styleUrls: ['./poke-list.component.scss']
})
export class PokeListComponent implements OnChanges, OnInit, OnDestroy {

  @Input() public pdPokemonList: IPokemon[] | null | undefined = [];

  public pokeTypesByName: { [type: string]: string } = {};
  public isCatchPopoverVisible = false;

  private allCaughtPokeNames: string[] = [];
  private allWishlistedPokeNames: string[] = [];
  private componentDestroyed$ = new Subject<void>();

  constructor(
    private readonly store: Store<GuiState>,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef,
  ) {
  }

  public ngOnDestroy(): void {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }

  public ngOnInit(): void {
    this.store.select(selectAllCaughtPokemonNames)
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe(coughtNames => {
        this.allCaughtPokeNames = coughtNames;
        this.cdr.markForCheck();
      });
    this.store.select(selectAllWishlistedPokemonNames)
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe(wishlistedNames => {
        this.allWishlistedPokeNames = wishlistedNames;
        this.cdr.markForCheck();
      });
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes.pdPokemonList) {
      if (changes.pdPokemonList.currentValue) {
        (changes.pdPokemonList.currentValue as IPokemon[]).forEach(pokemon =>
          this.pokeTypesByName[pokemon.name] = pokemon.types.map(type => type.type.name).join(' | ')
        );
      }
      else {
        this.pokeTypesByName = {};
      }
    }
  }

  public showDetails(pokeName: string): void {
    this.router.navigate([{outlets: {'drawer-outlet': ['poke-details', 'drawer', pokeName]}}]);
  }

  public isCaught(pokeName: string): boolean {
    return this.allCaughtPokeNames.includes(pokeName);
  }

  public isWishlisted(pokeName: string): boolean {
    return this.allWishlistedPokeNames.includes(pokeName);
  }

  public wishlistPokemon(pokemonName: string): void {
    this.store.dispatch(new WishlistPokemon({
      pokemonName
    }));
    this.cdr.markForCheck();
  }

  public catchPokemon(pokemonName: string): void {
    this.store.dispatch(new CatchPokemon({
      pokemonName
    }));
    this.cdr.markForCheck();
  }

  public unwishlistPokemon(pokemonName: string): void {
    this.store.dispatch(new UnwishlitPokemon({
      pokemonName
    }));
    this.cdr.markForCheck();
  }

  public releasePokemon(pokemonName: string): void {
    this.store.dispatch(new ReleasePokemon({
      pokemonName
    }));
  }

}
