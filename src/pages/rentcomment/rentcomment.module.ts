import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RentCommentPage } from './rentcomment';

@NgModule({
  declarations: [
    RentCommentPage
  ],
  imports: [
    IonicPageModule.forChild(RentCommentPage)
  ],
  exports: [
    RentCommentPage
  ]
})
export class RentCommentPageModule {}