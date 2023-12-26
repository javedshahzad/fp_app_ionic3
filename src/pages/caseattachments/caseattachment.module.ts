import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CaseFileUploadsPage } from './caseattachment';

@NgModule({
  declarations: [
    CaseFileUploadsPage,
  ],
  imports: [
    IonicPageModule.forChild(CaseFileUploadsPage),
  ],
  exports: [
    CaseFileUploadsPage
  ]
})
export class CaseFileUploadsPageModule {}