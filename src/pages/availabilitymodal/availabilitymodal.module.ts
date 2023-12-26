import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AvailabilityModalPage } from './availabilitymodal';

@NgModule({
  declarations: [
    AvailabilityModalPage,
  ],
  imports: [
    IonicPageModule.forChild(AvailabilityModalPage),
  ],
  exports: [
    AvailabilityModalPage
  ]
})
export class AvailabilityModalPageModule {}