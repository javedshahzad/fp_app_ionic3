import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChequeCommentPage } from './chequecomment';

@NgModule({
  declarations: [
    ChequeCommentPage
  ],
  imports: [
    IonicPageModule.forChild(ChequeCommentPage)
  ],
  exports: [
    ChequeCommentPage
  ]
})
export class ChequeCommentPageModule {}