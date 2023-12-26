import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SecurityDepositDetailPage } from './securitydepositdetail';

@NgModule({
  declarations: [
    SecurityDepositDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(SecurityDepositDetailPage),
  ],
  exports: [
    SecurityDepositDetailPage
  ]
})
export class SecurityDepositDetailPageModule {}