import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ErrorHandler,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import {IPokemonStat, IType} from "pokeapi-typescript";
import {forkJoin, Subject} from "rxjs";
import {switchMap, takeUntil, tap} from "rxjs/operators";
import {DEFAULT_VISIBLE_POKE_DETAILS_COUNT} from "../../constants/defaults.constants";
import {PokeApiService} from "../../services/poke-api.service";
import {PokemonStatistic} from './components/details-stats/pokemon-statistic';
import {NamesWithCount} from './components/details-types/names-with-count';

export interface MoveDetails {
  damageClass: string | null;
  effects: string[];
  type: string | null;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'poke-details',
  templateUrl: './poke-details-page.component.html',
  styleUrls: ['./poke-details-page.component.scss']
})
export class PokeDetailsPageComponent implements OnInit, OnDestroy {

  @Input() public pdPokeName: string | null | undefined = undefined;
  @Output() public pdDisplayNextPoke = new EventEmitter<string>();

  private componentDestroyed$ = new Subject<void>();
  private readonly initialVisibleCount = DEFAULT_VISIBLE_POKE_DETAILS_COUNT;

  public pokeAvatarUrl = '';
  public pokeLoading = false;
  public pokeNamesByType: { [type: string]: NamesWithCount } = {};
  public pokeMoveNames: string[] = [];
  public pokeStats: PokemonStatistic[] = [];

  constructor(
    private readonly api: PokeApiService,
    private readonly cdr: ChangeDetectorRef,
    private readonly errorHandler: ErrorHandler,
  ) {
  }

  public ngOnDestroy(): void {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }


  public ngOnInit(): void {
    if (this.pdPokeName) {
      this.pokeLoading = true;
      this.api.getPokemon(this.pdPokeName)
        .pipe(
          takeUntil(this.componentDestroyed$),
          tap(pokemon => {
            this.pokeMoveNames = pokemon.moves.map(move => move.move.name).sort();
          }),
          tap(pokemon => {
            this.pokeStats = pokemon.stats.sort(this.pokeStatsSorter).map(stat => <PokemonStatistic>{
              statName: stat.stat.name,
              statValue: stat.base_stat,
            });
            this.pokeAvatarUrl = pokemon.sprites.front_default
              || pokemon.sprites.front_female
              || pokemon.sprites.front_shiny
              || pokemon.sprites.front_shiny_female;
          }),
          switchMap(pokemon => forkJoin(pokemon.types.map(type => this.api.getType(type.type.name)))),
          tap(types => types.sort(this.pokeTypesSorter).forEach(type => this.pokeNamesByType[type.name] = {
            pokeNames: type.pokemon.map(poke => poke.pokemon.name).sort(),
            visibleCount: this.initialVisibleCount,
          }))
        )
        .subscribe(
          () => {
            this.pokeLoading = false;
            this.cdr.markForCheck()
          },
          error => this.errorHandler.handleError(error)
        );
    }
  }

  private pokeStatsSorter(a: IPokemonStat, b: IPokemonStat): number {
    if (a.stat.name < b.stat.name) {
      return -1;
    }
    if (a.stat.name > b.stat.name) {
      return 1;
    }
    return 0;
  }

  private pokeTypesSorter(a: IType, b: IType): number {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  }

  public async changePoke(pokeName: string): Promise<void> {
    this.pdDisplayNextPoke.emit(pokeName);
  }

}
