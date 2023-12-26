import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CasemanagementPage } from './casemanagement';

@NgModule({
  declarations: [
    CasemanagementPage  ],
  imports: [
    IonicPageModule.forChild(CasemanagementPage)
  ],
})
export class CasemanagementPageModule {}
