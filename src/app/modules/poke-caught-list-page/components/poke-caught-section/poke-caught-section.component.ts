import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {IPokemon} from "pokeapi-typescript";
import {DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE, DEFAULT_TOTAL_ELEMENTS} from 'src/app/constants/defaults.constants';
import {DataChanged} from '../../data-changed';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'poke-caught-pokemons-section',
  templateUrl: './poke-caught-section.component.html',
  styleUrls: ['./poke-caught-section.component.scss']
})
export class PokeCaughtSectionComponent {

  @Input() public pdElementsTotal: number | null | undefined = DEFAULT_TOTAL_ELEMENTS;
  @Input() public pdPokeList: IPokemon[] | null | undefined = [];
  @Input() public pdRefreshingPokemons: boolean | null | undefined = undefined;
  @Input() public pdTitle: string | null | undefined = undefined;
  @Output() public pdDataChanged = new EventEmitter<DataChanged>();

  private pageIndex = DEFAULT_PAGE_INDEX;
  private pageSize = DEFAULT_PAGE_SIZE;

  public async pageIndexChange(newIndex: number): Promise<void> {
    this.pageIndex = newIndex;
    this.pdDataChanged.emit({
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
    });
  }

  public async pageSizeChange(newSize: number): Promise<void> {
    this.pageSize = newSize;
    this.pdDataChanged.emit({
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
    });
  }

}
