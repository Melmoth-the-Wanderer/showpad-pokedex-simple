import {ChangeDetectionStrategy, Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";
import {SIZER_TOGGLE_WINDOW_WIDTH_TRIGGER_PX} from './constants/size.constants';
import {GuiState} from "./store/gui-state";
import {selectAppInitialized, selectAppRouteLoaded} from "./store/selectors/app-state-selectors";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'poke-simple-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  public isCollapsed = false;
  public isInitializing = true;
  public isRouteLoading = true;

  private componentDestroyed$ = new Subject<void>();

  constructor(
    private readonly store: Store<GuiState>,
  ) {
  }

  public ngOnDestroy(): void {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }

  public ngOnInit(): void {
    this.toggleSider();
    this.store.select(selectAppInitialized)
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe(isAppInitialized => this.isInitializing = !isAppInitialized);
    this.store.select(selectAppRouteLoaded)
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe(isRouteLoaded => this.isRouteLoading = !isRouteLoaded);
  }

  @HostListener('window:resize', ['$event'])
  public onResize(_event: Event): void {
    this.toggleSider();
  }

  private toggleSider(): void {
    this.isCollapsed = window.innerWidth < SIZER_TOGGLE_WINDOW_WIDTH_TRIGGER_PX;
  }
}
