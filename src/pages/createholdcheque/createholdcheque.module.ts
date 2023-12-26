import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateHoldChequePage } from './createholdcheque';

@NgModule({
  declarations: [
    CreateHoldChequePage  ],
  imports: [
    IonicPageModule.forChild(CreateHoldChequePage)
  ],
})
export class ChequePageModule {}