import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PaymentCaseAttachmentModalPage } from './paymentcaseattachment';

@NgModule({
  declarations: [
    PaymentCaseAttachmentModalPage,
  ],
  imports: [
    IonicPageModule.forChild(PaymentCaseAttachmentModalPage),
  ],
  exports: [
    PaymentCaseAttachmentModalPage
  ]
})
export class PaymentCaseAttachmentModalPageModule {}