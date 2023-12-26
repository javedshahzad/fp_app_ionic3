import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CustomerServiceModalPage } from './customerservicemodal';

@NgModule({
  declarations: [
    CustomerServiceModalPage,
  ],
  imports: [
    IonicPageModule.forChild(CustomerServiceModalPage),
  ],
  exports: [
    CustomerServiceModalPage
  ]
})
export class AvailabilityModalPageModule {}