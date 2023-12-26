import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PaymentAttachmentPage } from './paymentattachment';

@NgModule({
  declarations: [
    PaymentAttachmentPage  ],
  imports: [
    IonicPageModule.forChild(PaymentAttachmentPage),
  ],
  exports: [
    PaymentAttachmentPage
  ]
})
export class PaymentAttachmentPageModule {}