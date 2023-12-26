import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReturnChequePage } from './returncheque';

@NgModule({
  declarations: [
    ReturnChequePage  ],
  imports: [
    IonicPageModule.forChild(ReturnChequePage)
  ],
})
export class ReturnChequePageModule {}