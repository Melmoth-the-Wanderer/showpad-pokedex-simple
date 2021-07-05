import {ChangeDetectionStrategy, Component, HostListener, OnInit} from '@angular/core';
import {SIZER_TOGGLE_WINDOW_WIDTH_TRIGGER_PX} from './constants/size.constants';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'poke-simple-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public isCollapsed = false;

  public ngOnInit(): void {
    this.toggleSider();
  }

  @HostListener('window:resize', ['$event'])
  public onResize(_event: Event): void {
    this.toggleSider();
  }

  private toggleSider(): void {
    this.isCollapsed = window.innerWidth < SIZER_TOGGLE_WINDOW_WIDTH_TRIGGER_PX;
  }
}
