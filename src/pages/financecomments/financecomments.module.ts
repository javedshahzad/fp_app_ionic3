import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FinanceCommentPage } from './financecomments';

@NgModule({
  declarations: [
    FinanceCommentPage
  ],
  imports: [
    IonicPageModule.forChild(FinanceCommentPage)
  ],
  exports: [
    FinanceCommentPage
  ]
})
export class FinanceCommentPageModule {}