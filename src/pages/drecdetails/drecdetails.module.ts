import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DrecDetailsPage } from './drecdetails';

@NgModule({
  declarations: [
    DrecDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(DrecDetailsPage),
  ],
  exports: [
    DrecDetailsPage
  ]
})
export class DrecDetailsPageModule {}