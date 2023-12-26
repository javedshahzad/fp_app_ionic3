import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PaymentCaseCommentsModalPage } from './paymentcasecomments';

@NgModule({
  declarations: [
    PaymentCaseCommentsModalPage,
  ],
  imports: [
    IonicPageModule.forChild(PaymentCaseCommentsModalPage),
  ],
  exports: [
    PaymentCaseCommentsModalPage
  ]
})
export class PaymentCaseCommentsModalPageModule {}