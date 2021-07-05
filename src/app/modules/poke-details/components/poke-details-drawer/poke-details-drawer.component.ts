import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {NzDrawerRef, NzDrawerService} from "ng-zorro-antd/drawer";
import {Subject} from "rxjs";
import {takeUntil} from 'rxjs/operators';
import {PokeDetailsComponent} from '../poke-details/poke-details.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'poke-details-drawer',
  template: '',
  styles: [],
})
export class PokeDetailsDrawerComponent implements OnInit, OnDestroy {

  private componentDestroyed = new Subject<void>();
  private drawerRef: NzDrawerRef | undefined = undefined;

  constructor(
    private readonly drawerService: NzDrawerService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {
  }

  public ngOnDestroy(): void {
    this.componentDestroyed.next();
    this.componentDestroyed.complete();
  }

  public ngOnInit(): void {
    this.route.params.subscribe(() => {
      this.openDrawer();
    });
  }

  private openDrawer(): void {
    if (this.drawerRef) {
      this.drawerRef.close();
    }
    this.drawerRef = this.drawerService.create({
      nzContent: PokeDetailsComponent,
      nzFooter: 'Footer',
      nzPlacement: 'right',
      nzTitle: 'Title',
      nzWidth: 200,
    });
    this.drawerRef.afterClose
      .pipe(takeUntil(this.componentDestroyed))
      .subscribe(() => this.clearDrawerOutlet())
  }

  private clearDrawerOutlet(): void {
    this.router.navigate([{outlets: {'drawer-outlet': []}}]);
  }

}
