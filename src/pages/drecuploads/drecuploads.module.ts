import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DrecUploadsPage } from './drecuploads';

@NgModule({
  declarations: [
    DrecUploadsPage,
  ],
  imports: [
    IonicPageModule.forChild(DrecUploadsPage),
  ],
  exports: [
    DrecUploadsPage
  ]
})
export class DrecUploadsPageModule {}