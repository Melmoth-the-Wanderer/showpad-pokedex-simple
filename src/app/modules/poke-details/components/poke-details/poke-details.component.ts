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
import {forkJoin, Subject} from "rxjs";
import {switchMap, takeUntil, tap} from "rxjs/operators";
import {PokeApiService} from "../../../../services/poke-api.service";

export interface PokemonStatistic {
  statName: string;
  statValue: number;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'poke-details',
  templateUrl: './poke-details.component.html',
  styleUrls: ['./poke-details.component.scss']
})
export class PokeDetailsComponent implements OnInit, OnDestroy {

  @Input() public pdPokeName: string | null | undefined = undefined;
  @Output() public pdDisplayNextPoke = new EventEmitter<string>();

  public pokeAvatarUrl = '';
  public pokeLoading = false;
  public pokeNamesByType: { [type: string]: string[] } = {};
  public pokeStats: PokemonStatistic[] = [];

  private componentDestroyed$ = new Subject<void>();

  constructor(
    private readonly api: PokeApiService,
    private readonly cdr: ChangeDetectorRef,
    private readonly errorHandler: ErrorHandler,
  ) {
  }

  public ngOnInit(): void {
    if (this.pdPokeName) {
      this.pokeLoading = true;
      this.api.getPokemon(this.pdPokeName)
        .pipe(
          takeUntil(this.componentDestroyed$),
          tap(pokemon => {
            this.pokeStats = pokemon.stats.map(stat => <PokemonStatistic>{
              statName: stat.stat.name,
              statValue: stat.base_stat,
            });
            this.pokeAvatarUrl = pokemon.sprites.front_default
              || pokemon.sprites.front_female
              || pokemon.sprites.front_shiny
              || pokemon.sprites.front_shiny_female;
          }),
          switchMap(pokemon => forkJoin(pokemon.types.map(type => this.api.getType(type.type.name)))),
          tap(types =>
            types.forEach(type => this.pokeNamesByType[type.name] = type.pokemon.map(poke => poke.pokemon.name))
          )
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

  public isCurrentPoke(pokeName: string): boolean {
    return this.pdPokeName === pokeName;
  }

  public ngOnDestroy(): void {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }

  public async changePoke(pokeName: string): Promise<void> {
    this.pdDisplayNextPoke.emit(pokeName);
  }

}
