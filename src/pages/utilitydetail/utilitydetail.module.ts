import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UtilityDetailPage } from './utilitydetail';

@NgModule({
  declarations: [
    UtilityDetailPage  ],
  imports: [
    IonicPageModule.forChild(UtilityDetailPage)
  ],
})
export class UtilityDetailPageModule {}