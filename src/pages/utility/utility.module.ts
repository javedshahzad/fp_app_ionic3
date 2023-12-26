import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UtilityPage } from './utility';

@NgModule({
  declarations: [
    UtilityPage  ],
  imports: [
    IonicPageModule.forChild(UtilityPage)
  ],
})
export class UtilityPageModule {}