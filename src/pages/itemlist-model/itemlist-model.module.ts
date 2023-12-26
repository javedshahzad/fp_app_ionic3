import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ItemlistModelPage } from './itemlist-model';

@NgModule({
  declarations: [
    ItemlistModelPage,
  ],
  imports: [
    IonicPageModule.forChild(ItemlistModelPage),
  ],
})
export class ItemlistModelPageModule {}
