import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FinancePaymentAttachmentPage } from './financepaymentattachment';
import { IonicSelectableModule  } from 'ionic-selectable';

@NgModule({
  declarations: [
    FinancePaymentAttachmentPage  ],
  imports: [
    IonicPageModule.forChild(FinancePaymentAttachmentPage),
    IonicSelectableModule
  ],
  exports: [
    FinancePaymentAttachmentPage
  ]
})
export class FinancePaymentAttachmentPageModule {}