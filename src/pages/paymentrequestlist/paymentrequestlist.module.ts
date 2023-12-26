import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PaymentRequestListPage } from './paymentrequestlist';

@NgModule({
  declarations: [
    PaymentRequestListPage  ],
  imports: [
    IonicPageModule.forChild(PaymentRequestListPage)
  ],
})
export class PaymentRequestListPageModule {}