import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CompletedPage } from './completed.page';

import { CompletedPageRoutingModule } from './completed-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    CompletedPageRoutingModule
  ],
  declarations: [CompletedPage]
})
export class CompletedPageModule {}
