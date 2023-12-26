import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DrecAttachmentsPage } from './drecattachment';

@NgModule({
  declarations: [
    DrecAttachmentsPage,
  ],
  imports: [
    IonicPageModule.forChild(DrecAttachmentsPage),
  ],
  exports: [
    DrecAttachmentsPage
  ]
})
export class DrecAttachmentsPageModule {}