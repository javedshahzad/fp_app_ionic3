import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { callEscalationHoldpage } from './callescalationhold';

@NgModule({
  declarations: [
    callEscalationHoldpage  ],
  imports: [
    IonicPageModule.forChild(callEscalationHoldpage)
  ],
})
export class callEscalationHoldpageModule {}