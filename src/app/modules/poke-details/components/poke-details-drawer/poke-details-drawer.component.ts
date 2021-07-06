import {AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {NzDrawerRef, NzDrawerService} from "ng-zorro-antd/drawer";
import {Subject} from "rxjs";
import {takeUntil} from 'rxjs/operators';
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
export class PokeDetailsDrawerComponent implements AfterViewInit, OnDestroy {

  @ViewChild('drawerFooter', {read: TemplateRef}) private drawerFooter: TemplateRef<any> | undefined = undefined;

  private componentDestroyed$ = new Subject<void>();
  private drawerRef: NzDrawerRef<PokeDetailsPageComponent> | undefined = undefined;

  constructor(
    private readonly drawerService: NzDrawerService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {
  }

  public ngOnDestroy(): void {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }

  public ngAfterViewInit(): void {
    this.route.params.subscribe((params) => {
      this.openDrawer(params['pokeName']);
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
      nzWidth: this.getDrawerSize(),
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

  private getDrawerSize(): string {
    const viewport = this.getViewportSize();
    if (viewport < 500) {
      return '90vw';
    }
    if (viewport < 700) {
      return '70vw';
    }
    return '50vw';
  }

  private getViewportSize(): number {
    return Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
  }

  public closeDrawer(): void {
    this.drawerRef?.close();
    this.clearDrawerOutlet();
  }

  private clearDrawerOutlet(): void {
    this.router.navigate([{outlets: {'drawer-outlet': []}}]);
  }

}
