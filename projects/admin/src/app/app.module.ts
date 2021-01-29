import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { CoreModule } from './core/core.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app/app.component';
import { SideNavComponent } from './features/side-nav/side-nav.component';
import { ChatModule } from './features/chat/chat.module';
import { HeaderComponent } from './features/header/header.component';

@NgModule({
  imports: [
    // angular
    BrowserAnimationsModule,
    BrowserModule,

    // core
    CoreModule,

    // app
    AppRoutingModule,

    ChatModule
  ],
  declarations: [AppComponent, SideNavComponent, HeaderComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
