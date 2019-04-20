import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { TreeListComponent } from './tree-list';
import { MaterialModule } from './material-module';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    TreeListComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    MaterialModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [TreeListComponent]
})
export class AppModule { }
