import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SecurityDepositCommentPage } from './securitydepositcomment';

@NgModule({
  declarations: [
    SecurityDepositCommentPage,
  ],
  imports: [
    IonicPageModule.forChild(SecurityDepositCommentPage),
  ],
  exports: [
    SecurityDepositCommentPage
  ]
})
export class DrecCommentsPageModule {}