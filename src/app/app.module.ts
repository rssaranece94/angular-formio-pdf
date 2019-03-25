import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AngularFormioPdfModule } from 'angular-formio-pdf';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AngularFormioPdfModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
