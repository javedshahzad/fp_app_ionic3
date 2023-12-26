import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PaymentRequestBillPage } from './paymentrequestbill';

@NgModule({
  declarations: [
    PaymentRequestBillPage  ],
  imports: [
    IonicPageModule.forChild(PaymentRequestBillPage)
  ],
})
export class PaymentRequestBillPageModule {}