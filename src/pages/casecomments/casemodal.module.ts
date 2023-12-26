import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CaseModalPage } from './casemodal';

@NgModule({
  declarations: [
    CaseModalPage,
  ],
  imports: [
    IonicPageModule.forChild(CaseModalPage),
  ],
  exports: [
    CaseModalPage
  ]
})
export class CaseModalPageModule {}