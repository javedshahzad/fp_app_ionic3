import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChequeListLabelPage } from './chequelistlabel';

@NgModule({
  declarations: [
    ChequeListLabelPage  ],
  imports: [
    IonicPageModule.forChild(ChequeListLabelPage)
  ],
})
export class ChequeListLabelPageModule {}