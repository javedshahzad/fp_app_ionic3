import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PaymentRequestCreatePage } from './paymentrequestcreate';

@NgModule({
  declarations: [
    PaymentRequestCreatePage  ],
  imports: [
    IonicPageModule.forChild(PaymentRequestCreatePage)
  ],
})
export class PaymentRequestCreatePageModule {}