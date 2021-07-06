import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {fromEvent, Subject} from "rxjs";
import {debounceTime, takeUntil} from "rxjs/operators";
import {SIZER_TOGGLE_WINDOW_WIDTH_TRIGGER_PX} from './constants/size.constants';
import {PokeViewportSizeService} from "./services/poke-viewport-size.service";
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
    private readonly viewport: PokeViewportSizeService,
  ) {
  }

  public ngOnDestroy(): void {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }

  public ngOnInit(): void {
    this.viewport.viewportWidth
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe(viewportWidth => {
        const isSmallViewport = viewportWidth <= SIZER_TOGGLE_WINDOW_WIDTH_TRIGGER_PX;
        this.resizeSider(isSmallViewport ? 'smaller' : 'larger');
      });
    this.store.select(selectAppInitialized)
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe(isAppInitialized => this.isInitializing = !isAppInitialized);
    this.store.select(selectAppRouteLoaded)
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe(isRouteLoaded => this.isRouteLoading = !isRouteLoaded);
    this.updateViewportServiceOnWindowResize();
  }

  private updateViewportServiceOnWindowResize(): void {
    fromEvent(window, 'resize')
      .pipe(
        takeUntil(this.componentDestroyed$),
        debounceTime(250)
      )
      .subscribe(() => {
        this.viewport.triggerViewportUpdate();
      });
  }

  private resizeSider(direction: 'smaller' | 'larger'): void {
    this.isCollapsed = direction === 'smaller';
  }
}
