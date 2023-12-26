import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WeeklyCmtFileUploadsPage } from './weeklycmtattachment';

@NgModule({
  declarations: [
    WeeklyCmtFileUploadsPage,
  ],
  imports: [
    IonicPageModule.forChild(WeeklyCmtFileUploadsPage),
  ],
  exports: [
    WeeklyCmtFileUploadsPage
  ]
})
export class WeeklyCmtFileUploadsPageModule {}