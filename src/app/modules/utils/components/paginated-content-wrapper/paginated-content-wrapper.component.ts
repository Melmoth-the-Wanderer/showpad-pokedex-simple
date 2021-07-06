import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output, TemplateRef} from '@angular/core';
import {DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE, DEFAULT_TOTAL_ELEMENTS} from "../../../../constants/size.constants";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'poke-paginated-list-page',
  templateUrl: './paginated-content-wrapper.component.html',
  styleUrls: ['./paginated-content-wrapper.component.scss']
})
export class PaginatedContentWrapperComponent {

  @Input() public pdContentTemplate: TemplateRef<any> | null | undefined;
  @Input() public pdElementsTotal: number | null | undefined = DEFAULT_TOTAL_ELEMENTS;
  @Input() public pdPageIndex: number | null | undefined = DEFAULT_PAGE_INDEX;
  @Input() public pdPageSize: number | null | undefined = DEFAULT_PAGE_SIZE;
  @Input() public pdShowPagination: boolean | null | undefined;
  @Input() public pdSpinning: boolean | null | undefined;
  @Output() public pdPageIndexChange = new EventEmitter<number>();
  @Output() public pdPageSizeChange = new EventEmitter<number>();

}
