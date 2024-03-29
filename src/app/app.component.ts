import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {RouteConfigLoadEnd, RouteConfigLoadStart, Router} from '@angular/router';
import {Store} from "@ngrx/store";
import {fromEvent, Subject} from "rxjs";
import {debounceTime, takeUntil} from "rxjs/operators";
import {SIZER_TOGGLE_WINDOW_WIDTH_TRIGGER_PX} from './constants/size.constants';
import {PokeViewportSizeService} from "./services/poke-viewport-size.service";
import {GuiState} from "./store/gui-state";
import {selectAppInitialized, selectAppRouteResolved} from "./store/selectors/app-state-selectors";

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
  public isRouteResolvingData = true;

  private componentDestroyed$ = new Subject<void>();

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly router: Router,
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
        this.cdr.markForCheck();
      });
    this.store.select(selectAppInitialized)
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe(isAppInitialized => this.isInitializing = !isAppInitialized);
    this.store.select(selectAppRouteResolved)
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe(isRouteLoaded => this.isRouteResolvingData = !isRouteLoaded);
    this.updateViewportServiceOnWindowResize();
    this.indicateRouteLoading();

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

  private indicateRouteLoading(): void {
    this.router.events.subscribe(event => {
      if (event instanceof RouteConfigLoadStart) {
        this.isRouteLoading = true;
      } else if (event instanceof RouteConfigLoadEnd) {
        this.isRouteLoading = false;
      }
    });
  }

  private resizeSider(direction: 'smaller' | 'larger'): void {
    this.isCollapsed = direction === 'smaller';
  }
}
