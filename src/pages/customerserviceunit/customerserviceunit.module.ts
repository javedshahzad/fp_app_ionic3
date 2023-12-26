import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CustomerServiceUnitPage } from './customerserviceunit';

@NgModule({
  declarations: [
    CustomerServiceUnitPage,
  ],
  imports: [
    IonicPageModule.forChild(CustomerServiceUnitPage),
  ],
})
export class CustomerServiceUnitPageModule {}
