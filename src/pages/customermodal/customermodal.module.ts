import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CustomerModalPage } from './customermodal';

@NgModule({
  declarations: [
    CustomerModalPage,
  ],
  imports: [
    IonicPageModule.forChild(CustomerModalPage),
  ],
  exports: [
    CustomerModalPage
  ]
})
export class CustomerModalPageModule {}