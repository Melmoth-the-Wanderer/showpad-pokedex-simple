import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";
import {SEARCH_INPUT_POKE_LIST_SMALL_SIZE_BOUNDARY} from "../../../../constants/size.constants";
import {PokeViewportSizeService} from "../../../../services/poke-viewport-size.service";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'poke-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss']
})
export class SearchInputComponent implements OnInit, OnDestroy { // TODO: Implement Control Value Accessor

  @Input() public pdIsTyping: boolean | null | undefined;
  @Output() public pdIsTypingChange = new EventEmitter<boolean>();
  @Output() public pdInput = new EventEmitter<string>();
  @Output() public pdClearClick = new EventEmitter<void>();

  public isSmallViewport = false;

  @ViewChild('searchInput') private searchInput: ElementRef | undefined = undefined;
  private componentDestroyed$ = new Subject<void>();

  constructor(
    private viewport: PokeViewportSizeService,
    private cdr: ChangeDetectorRef,
  ) {
  }

  public ngOnDestroy(): void {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }

  public ngOnInit() {
    this.viewport.viewportWidth
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe(viewportWidth => {
        this.isSmallViewport = viewportWidth <= SEARCH_INPUT_POKE_LIST_SMALL_SIZE_BOUNDARY;
        this.cdr.markForCheck();
      });
  }

  public clearInput(): void {
    this.pdClearClick.next();
    (this.searchInput?.nativeElement as HTMLInputElement).value = '';
  }
}
