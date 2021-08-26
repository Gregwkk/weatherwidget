import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { PoFieldModule, PoMenuModule, PoModule, PoPageModule, PoToolbarModule } from '@po-ui/ng-components';
import ptBr from '@angular/common/locales/pt';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoaderComponent } from './components/loader/loader.component';
import { BaseComponent } from './routes/base/base.component';
import { AuthInterceptor } from './services/auth.interceptor';
import { registerLocaleData } from '@angular/common';
import moment from 'moment';


registerLocaleData(ptBr);
moment.locale('pt-br');

@NgModule({
  declarations: [
    AppComponent,
    BaseComponent,
    LoaderComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    PoPageModule,
    PoFieldModule,
    PoToolbarModule,
    PoMenuModule,
    FormsModule,
    PoModule,
    RouterModule.forRoot([])
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    { provide: LOCALE_ID, useValue: 'pt-BR' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
