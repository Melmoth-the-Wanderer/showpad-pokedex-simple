import {registerLocaleData} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import en from '@angular/common/locales/en';
import {APP_INITIALIZER, ErrorHandler, NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {EffectsModule} from '@ngrx/effects';
import {Store, StoreModule} from "@ngrx/store";
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {NzBreadCrumbModule} from "ng-zorro-antd/breadcrumb";
import {NZ_CONFIG, NzConfig} from 'ng-zorro-antd/core/config';
import {NzEmptyModule} from "ng-zorro-antd/empty";
import {NzFormModule} from 'ng-zorro-antd/form';
import {en_US, NZ_I18N} from 'ng-zorro-antd/i18n';
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzLayoutModule} from "ng-zorro-antd/layout";
import {NzListModule} from "ng-zorro-antd/list";
import {NzMenuModule} from "ng-zorro-antd/menu";
import {NzNotificationModule} from "ng-zorro-antd/notification";
import {NzPageHeaderModule} from "ng-zorro-antd/page-header";
import {NzPaginationModule} from "ng-zorro-antd/pagination";
import {NzSkeletonModule} from 'ng-zorro-antd/skeleton';
import {NzSpinModule} from "ng-zorro-antd/spin";
import {NzToolTipModule} from "ng-zorro-antd/tooltip";
import {NzTypographyModule} from "ng-zorro-antd/typography";
import {Subject} from "rxjs";
import {takeUntil} from 'rxjs/operators';
import {environment} from '../environments/environment';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {MyPokemonsPageComponent} from './components/my-pokemons-page/my-pokemons-page.component';
import {PokeListComponent} from './utils/components/poke-list/poke-list.component';
import {PokeListPageComponent} from "./components/poke-list-page/poke-list-page.component";
import {PokeApiService} from "./services/poke-api.service";
import {InitializeApp} from "./store/actions/app-state-actions";
import {PokeEffects} from "./store/effects";
import {GuiState} from "./store/gui-state";
import {reducers} from "./store/reducers";
import {selectAppInitialized} from "./store/selectors/app-state-selectors";
import {PaginatedContentWrapperComponent} from "./utils/components/paginated-content-wrapper/paginated-content-wrapper.component";
import {PaginatedPokemonListComponent} from './utils/components/paginated-pokemon-list/paginated-pokemon-list.component';
import {PokeErrorHandler} from "./utils/poke-error-handler";
import { MyPokemonsSectionComponent } from './components/my-pokemons-page/components/my-pokemons-section/my-pokemons-section.component';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzButtonModule } from 'ng-zorro-antd/button';

registerLocaleData(en);

const ngZorroConfig: NzConfig = {
  notification: { nzDuration: 3500 }
};

export function initializeApp(api: PokeApiService, store: Store<GuiState>): () => Promise<void> {
  return () => new Promise((resolve, reject) => {
    const loaded$ = new Subject<void>();
    store.dispatch(new InitializeApp());
    store.select(selectAppInitialized)
      .pipe(takeUntil(loaded$))
      .subscribe(loaded => {
        if(loaded) {
          loaded$.next();
          loaded$.complete();
          resolve();
        }
      }, error => reject(error));
  });
}

@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
    PokeListPageComponent,
    PokeListComponent,
    PaginatedContentWrapperComponent,
    PaginatedPokemonListComponent,
    MyPokemonsPageComponent,
    MyPokemonsSectionComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    EffectsModule.forRoot([PokeEffects]),
    FormsModule,
    HttpClientModule,
    NzBreadCrumbModule,
    NzButtonModule,
    NzEmptyModule,
    NzFormModule,
    NzIconModule,
    NzInputModule,
    NzLayoutModule,
    NzListModule,
    NzMenuModule,
    NzNotificationModule,
    NzPageHeaderModule,
    NzPaginationModule,
    NzPopoverModule,
    NzSkeletonModule,
    NzSpinModule,
    NzToolTipModule,
    NzTypographyModule,
    ReactiveFormsModule,
    StoreModule.forRoot(reducers),
    StoreDevtoolsModule.instrument({maxAge: 25, logOnly: environment.production}),
  ],
  providers: [
    {
      provide: ErrorHandler,
      useClass: PokeErrorHandler
    },
    { provide: NZ_CONFIG, useValue: ngZorroConfig },
    {provide: NZ_I18N, useValue: en_US},
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [
        PokeApiService,
        Store
      ],
      multi: true,
    }
  ],
})
export class AppModule {
}
