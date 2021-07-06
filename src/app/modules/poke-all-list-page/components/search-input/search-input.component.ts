import {ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'poke-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss']
})
export class SearchInputComponent { // TODO: Implement Control Value Accessor

  @Input() public pdIsTyping: boolean | null | undefined;
  @Output() public pdIsTypingChange = new EventEmitter<boolean>();
  @Output() public pdInput = new EventEmitter<string>();
  @Output() public pdClearClick = new EventEmitter<void>();

  @ViewChild('searchInput') private searchInput: ElementRef | undefined = undefined;

  public clearInput(): void {
    this.pdClearClick.next();
    (this.searchInput?.nativeElement as HTMLInputElement).value = '';
  }
}
