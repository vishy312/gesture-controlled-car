import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatSidenavModule} from '@angular/material/sidenav'
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { WebBluetoothModule } from '@manekinekko/angular-web-bluetooth';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatSidenavModule,
    BrowserAnimationsModule,
    WebBluetoothModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
