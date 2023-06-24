import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { ActionSheetController } from '@ionic/angular';
import { EditTodoModalComponent } from '../app/edit-todo-modal/edit-todo-modal.component';

@NgModule({
  declarations: [AppComponent, EditTodoModalComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule, FormsModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, ActionSheetController],
  bootstrap: [AppComponent],
})
export class AppModule {}
