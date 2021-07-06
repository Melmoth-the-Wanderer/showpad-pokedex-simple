import {
  ChangeDetectionStrategy,
  Component,
  ErrorHandler,
  HostBinding,
  Input,
  OnDestroy,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {NzModalService} from "ng-zorro-antd/modal";
import {IMove} from "pokeapi-typescript";
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";
import {DEFAULT_VISIBLE_POKE_DETAILS_COUNT} from "../../../../constants/defaults.constants";
import {PokeApiService} from "../../../../services/poke-api.service";
import {MoveDetails} from "../../poke-details-page.component";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'poke-details-moves',
  templateUrl: './details-moves.component.html',
  styleUrls: ['./details-moves.component.scss']
})
export class DetailsMovesComponent implements OnDestroy {

  @Input() public pdPokeMoveNames: string[] | null | undefined = undefined;

  @ViewChild('movesModalContent') private movesModalContentTemplate: TemplateRef<unknown> | undefined = undefined;
  @HostBinding('attr.data-smoke') private smokeTestAttrValue = 'poke-details-moves';

  private componentDestroyed$ = new Subject<void>();
  private readonly initialVisibleCount = DEFAULT_VISIBLE_POKE_DETAILS_COUNT;

  public pokeMoveDetails: MoveDetails = this.resetMovesDetails();
  public pokeMoveLoading = false;
  public pokeMovesVisibleCount = this.initialVisibleCount;
  public previouslyClickedMove: string | null = null;

  constructor(
    private readonly api: PokeApiService,
    private readonly errorHandler: ErrorHandler,
    private readonly modals: NzModalService,
  ) {
  }

  public ngOnDestroy(): void {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }

  public showAllMoves(): void {
    this.pokeMovesVisibleCount = this.pdPokeMoveNames?.length || this.initialVisibleCount;
  }

  public showLessMoves(): void {
    this.pokeMovesVisibleCount = this.initialVisibleCount;
  }

  public openMoveDetails(moveName: string): void {
    this.pokeMoveLoading = true;
    this.previouslyClickedMove = moveName;
    this.api.getMove(moveName)
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe(
        details => {
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
    const outerReg = /\$.*?%/;
    const group = effectText.match(outerReg);
    if (group) {
      group.forEach(elem => {
        const innerReg = /(?<=\$)(.*)(?=%)/;
        const propName = elem.match(innerReg)![0];
        const replacement = moveDetails[propName as keyof IMove] as string;
        if (replacement) {
          effectText = effectText.replace(outerReg, `${replacement}%`);
        }
      });
    }

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


}
