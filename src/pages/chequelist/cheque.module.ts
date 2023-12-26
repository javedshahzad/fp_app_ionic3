import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChequePage } from './cheque';

@NgModule({
  declarations: [
    ChequePage  ],
  imports: [
    IonicPageModule.forChild(ChequePage)
  ],
})
export class ChequePageModule {}