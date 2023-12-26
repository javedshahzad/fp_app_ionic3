import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContractCustomerDetailsPage } from './contractcustomerdetails';

@NgModule({
  declarations: [
    ContractCustomerDetailsPage  ],
  imports: [
    IonicPageModule.forChild(ContractCustomerDetailsPage)
  ],
})
export class ContractCustomerDetailsPageModule {}