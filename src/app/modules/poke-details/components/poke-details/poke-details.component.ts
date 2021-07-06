import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ErrorHandler,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output, TemplateRef,
  ViewChild
} from '@angular/core';
import {NzModalService} from "ng-zorro-antd/modal";
import {IMove} from "pokeapi-typescript";
import {forkJoin, Subject} from "rxjs";
import {switchMap, takeUntil, tap} from "rxjs/operators";
import {PokeApiService} from "../../../../services/poke-api.service";

export interface PokemonStatistic {
  statName: string;
  statValue: number;
}

export interface NameAndVisibleCount {
  pokeNames: string[];
  visibleCount: number;
}

export interface MoveDetails {
  damageClass: string | null;
  effects: string[];
  type: string | null;
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

  @ViewChild('movesModalContent') public movesModalContentTemplate: TemplateRef<unknown> | undefined = undefined;
  private componentDestroyed$ = new Subject<void>();
  private readonly initialVisibleCount = 10;

  public pokeAvatarUrl = '';
  public pokeLoading = false;
  public pokeNamesByType: { [type: string]: NameAndVisibleCount } = {};
  public pokeMoveNames: string[] = [];
  public pokeMovesVisibleCount = this.initialVisibleCount;
  public pokeMoveDetails: MoveDetails = this.resetMovesDetails();
  public pokeMoveLoading = false;
  public pokeStats: PokemonStatistic[] = [];
  public previouslyClickedMove: string | null = null;

  constructor(
    private readonly api: PokeApiService,
    private readonly cdr: ChangeDetectorRef,
    private readonly errorHandler: ErrorHandler,
    private readonly modals: NzModalService,
  ) {
  }

  public ngOnInit(): void {
    if (this.pdPokeName) {
      this.pokeLoading = true;
      this.api.getPokemon(this.pdPokeName)
        .pipe(
          takeUntil(this.componentDestroyed$),
          tap(pokemon => {
            this.pokeMoveNames = pokemon.moves.map(move => move.move.name);
          }),
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
          tap(types => types.forEach(type => this.pokeNamesByType[type.name] = {
            pokeNames: type.pokemon.map(poke => poke.pokemon.name),
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

  public openMoveDetails(moveName: string): void {
    this.pokeMoveLoading = true;
    this.previouslyClickedMove = moveName;
    this.api.getMove(moveName)
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe(
        details => {
          console.log(details);
          this.pokeMoveLoading = false;
          this.pokeMoveDetails = {
            damageClass: details.damage_class.name,
            effects: details.effect_entries.map(entry =>
              this.parseEffectText(entry.short_effect, details)),
            type: details.type.name,
          }
        },
        error => {
          this.pokeMoveLoading = false;
          this.errorHandler.handleError(error)
        }
      );
    console.log(this.movesModalContentTemplate);
    this.modals.create({
      nzCancelText: null,
      nzContent: this.movesModalContentTemplate,
      nzOnCancel: () => {
        this.resetMovesDetails();
      },
      nzOkText: 'Close',
      nzTitle: `${moveName} move details`,
    })
  }

  private parseEffectText(effectText: string, moveDetails: IMove): string {
    console.log(effectText);
    const outerReg = /\$.*?\%/;
    const group = effectText.match(outerReg);
    if(group) {
      group.forEach(elem => {
        const innerReg = /(?<=\$)(.*)(?=\%)/;
        const propName = elem.match(innerReg)![0];
        const replacement = moveDetails[propName as keyof IMove] as string;
        if(replacement) {
          effectText = effectText.replace(outerReg, `${replacement}%`);
        }
      });
    }
    console.log(group);
    return effectText;
  }

  private resetMovesDetails(): MoveDetails {
    this.pokeMoveDetails = {
      damageClass: null,
      effects: [],
      type: null,
    }
    return this.pokeMoveDetails;
  }

  public showAllMoves(): void {
    this.pokeMovesVisibleCount = this.pokeMoveNames.length;
  }

  public showLessMoves(): void {
    this.pokeMovesVisibleCount = this.initialVisibleCount;
  }

  public showAllPokemonsOfType(type: string): void {
    this.pokeNamesByType[type].visibleCount = this.pokeNamesByType[type].pokeNames.length;
  }

  public showLessPokemonsOfType(type: string): void {
    this.pokeNamesByType[type].visibleCount = this.initialVisibleCount;
  }

}
