import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UtilityPaymentDetailPage } from './utilitypaymentdetail';

@NgModule({
  declarations: [
    UtilityPaymentDetailPage  ],
  imports: [
    IonicPageModule.forChild(UtilityPaymentDetailPage)
  ],
})
export class UtilityPaymentDetailPageModule {}