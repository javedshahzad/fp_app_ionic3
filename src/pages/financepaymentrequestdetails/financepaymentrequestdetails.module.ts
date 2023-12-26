import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FinancePaymentDetailPage } from './financepaymentrequestdetails';

@NgModule({
  declarations: [
    FinancePaymentDetailPage  ],
  imports: [
    IonicPageModule.forChild(FinancePaymentDetailPage)
  ],
})
export class FinancePaymentDetailPageModule {}