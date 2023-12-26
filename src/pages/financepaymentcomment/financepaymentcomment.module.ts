import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FinancePaymentCommentPage } from './financepaymentcomment';

@NgModule({
  declarations: [
    FinancePaymentCommentPage,
  ],
  imports: [
    IonicPageModule.forChild(FinancePaymentCommentPage),
  ],
  exports: [
    FinancePaymentCommentPage
  ]
})
export class FinancePaymentCommentPageModule {}