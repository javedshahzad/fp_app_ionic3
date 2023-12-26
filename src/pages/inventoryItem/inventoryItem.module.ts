import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InventoryItemPage } from './inventoryItem';

@NgModule({
  declarations: [
    InventoryItemPage,
  ],
  imports: [
    IonicPageModule.forChild(InventoryItemPage),
  ],
})
export class InventoryItemPageModule {}
