import {ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, Output} from '@angular/core';
import {DEFAULT_VISIBLE_POKE_DETAILS_COUNT} from 'src/app/constants/defaults.constants';
import {NamesWithCount} from "./names-with-count";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'poke-details-types',
  templateUrl: './details-types.component.html',
  styleUrls: ['./details-types.component.scss']
})
export class DetailsTypesComponent {

  @Input() public pdPokeName: string | null | undefined = undefined;
  @Input() public pdPokeNamesWithCount: NamesWithCount | null | undefined = undefined;
  @Input() public pdPokeTypeName: string | null | undefined = undefined;
  @Output() public pdPokeNameClick = new EventEmitter<string>();

  @HostBinding('attr.data-smoke') private smokeTestAttrValue = 'poke-details-types';
  private readonly initialVisibleCount = DEFAULT_VISIBLE_POKE_DETAILS_COUNT;

  public isCurrentPoke(pokeName: string): boolean {
    return this.pdPokeName === pokeName;
  }

  public showAllPokemons(): void {
    if (this.pdPokeNamesWithCount) {
      this.pdPokeNamesWithCount.visibleCount = this.pdPokeNamesWithCount.pokeNames.length;
    }
  }

  public showLessPokemons(): void {
    if (this.pdPokeNamesWithCount) {
      this.pdPokeNamesWithCount.visibleCount = this.initialVisibleCount;
    }
  }

}
