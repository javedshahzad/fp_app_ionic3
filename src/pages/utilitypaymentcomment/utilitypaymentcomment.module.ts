import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UtilityPaymentCommentPage } from './utilitypaymentcomment';
import { RichTextModule } from 'ionic-rich-text/dist/rich-text-module';

@NgModule({
  declarations: [
    UtilityPaymentCommentPage,
  ],
  imports: [
    IonicPageModule.forChild(UtilityPaymentCommentPage),
    RichTextModule 
  ],
  exports: [
    UtilityPaymentCommentPage
  ]
})
export class UtilityPaymentCommentPageModule {}