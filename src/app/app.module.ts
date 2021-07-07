import {registerLocaleData} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import en from '@angular/common/locales/en';
import {APP_INITIALIZER, ErrorHandler, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {EffectsModule} from '@ngrx/effects';
import {Store, StoreModule} from "@ngrx/store";
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {NZ_CONFIG, NzConfig} from 'ng-zorro-antd/core/config';
import {en_US, NZ_I18N} from 'ng-zorro-antd/i18n';
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzLayoutModule} from "ng-zorro-antd/layout";
import {NzMenuModule} from "ng-zorro-antd/menu";
import {NzNotificationModule} from "ng-zorro-antd/notification";
import {NzSpinModule} from "ng-zorro-antd/spin";
import {NzTypographyModule} from "ng-zorro-antd/typography";
import {Subject} from "rxjs";
import {takeUntil} from 'rxjs/operators';
import {environment} from '../environments/environment';
import {AppErrorHandler} from "./app-error-handler";
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {PokeUtilsModule} from "./modules/utils/utils.module";
import {PokeApiService} from "./services/poke-api.service";
import {InitializeApp} from "./store/actions/app-state-actions";
import {PokeEffects} from "./store/effects";
import {GuiState} from "./store/gui-state";
import {reducers} from "./store/reducers";
import {selectAppInitialized} from "./store/selectors/app-state-selectors";

registerLocaleData(en);

const ngZorroConfig: NzConfig = {
  notification: {nzDuration: 3500}
};

export function initializeApp(api: PokeApiService, store: Store<GuiState>): () => Promise<void> {
  return () => new Promise((resolve, reject) => {
    const loaded$ = new Subject<void>();
    store.dispatch(new InitializeApp());
    store.select(selectAppInitialized)
      .pipe(takeUntil(loaded$))
      .subscribe(loaded => {
        if (loaded) {
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
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    EffectsModule.forRoot([PokeEffects]),
    HttpClientModule,
    NzIconModule,
    NzLayoutModule,
    NzMenuModule,
    NzNotificationModule,
    NzSpinModule,
    NzTypographyModule,
    PokeUtilsModule,
    StoreModule.forRoot(reducers),
    environment.production ? [] :
      StoreDevtoolsModule.instrument({
        maxAge: 25,
        name: 'Pokedex Simple'
      }),
  ],
  providers: [
    {
      provide: ErrorHandler,
      useClass: AppErrorHandler
    },
    {provide: NZ_CONFIG, useValue: ngZorroConfig},
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
export class AppCoreModule {
}
