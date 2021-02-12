import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, APP_INITIALIZER} from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';


import { CoreModule } from './core/core.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app/app.component';
import { SideNavComponent } from './features/side-nav/side-nav.component';
import { ChatModule } from './features/chat/chat.module';
import { HeaderComponent } from './features/header/header.component';
import { AuthModule } from './features/auth/auth.module';
import { AuthService } from './core/auth/auth.service';
import { appInitializer } from './shared/app.initializer';
import { JwtInterceptor } from './shared/jwt.interceptor';

@NgModule({
  imports: [
    // angular
    BrowserAnimationsModule,
    BrowserModule,

    // core
    CoreModule,

    // app
    AppRoutingModule,

    ChatModule,

    AuthModule
  ],
  declarations: [AppComponent, SideNavComponent, HeaderComponent],
  bootstrap: [AppComponent],
  providers: [
    { provide: APP_INITIALIZER, useFactory: appInitializer, multi: true, deps: [AuthService] },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    // { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

    // provider used to create fake backend
    // fakeBackendProvider
  ],
})
export class AppModule {}
