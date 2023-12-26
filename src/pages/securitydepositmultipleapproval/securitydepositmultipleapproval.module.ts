import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SecurityDepositMultipleApprovalPage } from './securitydepositmultipleapproval';

@NgModule({
  declarations: [
    SecurityDepositMultipleApprovalPage,
  ],
  imports: [
    IonicPageModule.forChild(SecurityDepositMultipleApprovalPage),
  ],
  exports: [
    SecurityDepositMultipleApprovalPage
  ]
})
export class SecurityDepositMultipleApprovalPageModule {}