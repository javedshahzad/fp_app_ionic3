import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PaymentMultipleApprovalPage } from './paymentmultipleapproval';

@NgModule({
  declarations: [
    PaymentMultipleApprovalPage  ],
  imports: [
    IonicPageModule.forChild(PaymentMultipleApprovalPage)
  ],
})
export class PaymentMultipleApprovalPageModule {}