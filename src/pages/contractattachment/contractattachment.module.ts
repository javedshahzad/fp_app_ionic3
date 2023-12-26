import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContractAttachmentPage } from './contractattachment';
import { IonicSelectableModule  } from 'ionic-selectable';

@NgModule({
  declarations: [
    ContractAttachmentPage  ],
  imports: [
    IonicPageModule.forChild(ContractAttachmentPage),
    IonicSelectableModule
  ],
  exports: [
    ContractAttachmentPage
  ]
})
export class ContractAttachmentPageModule {}