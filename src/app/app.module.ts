import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { TreeListComponent } from './components/tree-list';
import { MaterialModule } from './material-module';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TreeService } from './services/tree.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    TreeListComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    MaterialModule,
    AppRoutingModule,
    NoopAnimationsModule
  ],
  providers: [TreeService],
  bootstrap: [TreeListComponent]
})
export class AppModule { }
