import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RoiPendingPoints } from './roipendingpointslist';

@NgModule({
  declarations: [
    RoiPendingPoints,
  ],
  imports: [
    IonicPageModule.forChild(RoiPendingPoints),
  ],
})
export class RoiPendingPointsPageModule {}
