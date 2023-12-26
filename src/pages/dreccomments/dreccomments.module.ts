import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DrecCommentsPage } from './dreccomments';

@NgModule({
  declarations: [
    DrecCommentsPage,
  ],
  imports: [
    IonicPageModule.forChild(DrecCommentsPage),
  ],
  exports: [
    DrecCommentsPage
  ]
})
export class DrecCommentsPageModule {}