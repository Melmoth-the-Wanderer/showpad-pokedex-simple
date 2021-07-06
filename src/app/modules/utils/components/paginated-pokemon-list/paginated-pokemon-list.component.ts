import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output, TemplateRef} from '@angular/core';
import {IPokemon} from "pokeapi-typescript";
import {DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE, DEFAULT_TOTAL_ELEMENTS} from "../../../../constants/size.constants";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'poke-paginated-pokemon-list',
  templateUrl: './paginated-pokemon-list.component.html',
  styleUrls: ['./paginated-pokemon-list.component.scss']
})
export class PaginatedPokemonListComponent {

  @Input() public pdCustomTemplate: TemplateRef<any> | null | undefined = undefined;
  @Input() public pdElementsTotal: number | null | undefined = DEFAULT_TOTAL_ELEMENTS;
  @Input() public pdPokemonList: IPokemon[] | null | undefined = undefined;
  @Input() public pdSpinning: boolean | null | undefined = undefined;
  @Input() public pdTitle: string | null | undefined = undefined;
  @Output() public pdPageIndexChange = new EventEmitter<number>();
  @Output() public pdPageSizeChange = new EventEmitter<number>();

  public pageIndex = DEFAULT_PAGE_INDEX;
  public pageSize = DEFAULT_PAGE_SIZE;

  public async pageIndexChange(newIndex: number): Promise<void> {
    this.pageIndex = newIndex;
    this.pdPageIndexChange.emit(newIndex);
  }

  public async pageSizeChange(newSize: number): Promise<void> {
    this.pageSize = newSize;
    this.pdPageSizeChange.emit(newSize);
  }

}
