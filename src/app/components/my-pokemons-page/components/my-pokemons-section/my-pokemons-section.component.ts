import {Component, EventEmitter, Input, Output} from '@angular/core';
import {IPokemon} from "pokeapi-typescript";
import {DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE, DEFAULT_TOTAL_ELEMENTS} from 'src/app/constants/size.constants';
import {DataChanged} from '../data-changed';

@Component({
  selector: 'poke-my-pokemons-section',
  templateUrl: './my-pokemons-section.component.html',
  styleUrls: ['./my-pokemons-section.component.scss']
})
export class MyPokemonsSectionComponent {

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
