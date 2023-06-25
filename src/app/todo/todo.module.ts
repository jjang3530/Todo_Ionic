import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TodoPage } from './todo.page';

import { TodoPageRoutingModule } from './todo-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TodoPageRoutingModule
  ],
  declarations: [TodoPage]
})
export class TodoPageModule {}
