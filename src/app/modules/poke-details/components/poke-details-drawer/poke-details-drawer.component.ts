import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {NzDrawerRef, NzDrawerService} from "ng-zorro-antd/drawer";
import {Subject} from "rxjs";
import {takeUntil} from 'rxjs/operators';
import {DRAWER_TOGGLE_SMALL_SIZE_BOUNDARY} from "../../../../constants/size.constants";
import {PokeViewportSizeService} from "../../../../services/poke-viewport-size.service";
import {getViewportWidth} from "../../../utils/functions/get-viewport-width";
import {PokeDetailsPageComponent} from '../poke-details-page/poke-details-page.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'poke-details-drawer',
  template: `
    <ng-template #drawerFooter>
      <button
        (click)="closeDrawer()"
        nz-button
        [nzType]="'primary'"
      >Close
      </button>
    </ng-template>
  `,
  styles: [
    ':host { display: block; }'
  ],
})
export class PokeDetailsDrawerComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('drawerFooter', {read: TemplateRef}) private drawerFooter: TemplateRef<any> | undefined = undefined;

  private componentDestroyed$ = new Subject<void>();
  private drawerRef: NzDrawerRef<PokeDetailsPageComponent> | undefined = undefined;
  private drawerWidth = this.getDrawerSize(getViewportWidth());
  private pokeName = '';

  constructor(
    private readonly drawerService: NzDrawerService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
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
        const oldDrawerWidth = this.drawerWidth;
        this.drawerWidth = this.getDrawerSize(viewportWidth);
        if (oldDrawerWidth !== this.drawerWidth) {
          this.openDrawer(this.pokeName);
        }
      });
  }

  public ngAfterViewInit(): void {
    this.route.params.subscribe((params) => {
      this.pokeName = params['pokeName'];
      this.openDrawer(this.pokeName);
    });
  }

  private openDrawer(pokeName: string): void {
    if (this.drawerRef) {
      this.drawerRef.close();
    }
    this.drawerRef = this.drawerService.create({
      nzClosable: false,
      nzContent: PokeDetailsPageComponent,
      nzContentParams: {
        pdPokeName: pokeName,
      },
      nzFooter: this.drawerFooter,
      nzKeyboard: false,
      nzPlacement: 'right',
      nzTitle: `Pokemon details`,
      nzWidth: this.drawerWidth,
    });
    window.setTimeout(() => {
      this.drawerRef!.getContentComponent()!.pdDisplayNextPoke
        .pipe(takeUntil(this.componentDestroyed$))
        .subscribe(newPokeName => {
          if (newPokeName === pokeName) {
            return;
          }
          this.drawerRef?.close();
          this.router.navigate([{outlets: {'drawer-outlet': ['poke-details', 'drawer', newPokeName]}}]);
        });
    }, 0);
  }

  private getDrawerSize(viewportWidth: number): string {
    if (viewportWidth && viewportWidth < DRAWER_TOGGLE_SMALL_SIZE_BOUNDARY) {
      return '80vw';
    }
    return '60vw';
  }


  public closeDrawer(): void {
    this.drawerRef?.close();
    this.clearDrawerOutlet();
  }

  private clearDrawerOutlet(): void {
    this.router.navigate([{outlets: {'drawer-outlet': []}}]);
  }

}
