import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContractDetailsPage } from './contractdetails';

@NgModule({
  declarations: [
    ContractDetailsPage  ],
  imports: [
    IonicPageModule.forChild(ContractDetailsPage)
  ],
})
export class ContractDetailsPageModule {}