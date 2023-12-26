import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReturnCommentPage } from './returncomment';

@NgModule({
  declarations: [
    ReturnCommentPage
  ],
  imports: [
    IonicPageModule.forChild(ReturnCommentPage)
  ],
  exports: [
    ReturnCommentPage
  ]
})
export class ReturnCommentPageModule {}