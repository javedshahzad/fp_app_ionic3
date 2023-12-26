import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SecurityDepositListPage } from './securitydepositlist';

@NgModule({
  declarations: [
    SecurityDepositListPage  ],
  imports: [
    IonicPageModule.forChild(SecurityDepositListPage)
  ],
})
export class SecurityDepositListPageModule {}