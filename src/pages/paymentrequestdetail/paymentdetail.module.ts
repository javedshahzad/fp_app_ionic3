import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PaymentDetailPage } from './paymentdetail';

@NgModule({
  declarations: [
    PaymentDetailPage  ],
  imports: [
    IonicPageModule.forChild(PaymentDetailPage)
  ],
})
export class PaymentDetailPageModule {}