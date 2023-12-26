import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CallManagementCommentPage } from './callmanagementcomment';

@NgModule({
  declarations: [
    CallManagementCommentPage
  ],
  imports: [
    IonicPageModule.forChild(CallManagementCommentPage)
  ],
  exports: [
    CallManagementCommentPage
  ]
})
export class CallManagementCommentPageModule {}