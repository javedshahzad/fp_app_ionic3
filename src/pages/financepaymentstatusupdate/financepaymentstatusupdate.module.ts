import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FinancePaymentStatusUpdatePage } from './financepaymentstatusupdate';

@NgModule({
  declarations: [
    FinancePaymentStatusUpdatePage,
  ],
  imports: [
    IonicPageModule.forChild(FinancePaymentStatusUpdatePage),
  ],
  exports: [
    FinancePaymentStatusUpdatePage
  ]
})
export class FinancePaymentStatusUpdatePageModule {}