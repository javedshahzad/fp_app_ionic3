import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RentalBalanceCommentPage } from './rentalbalancecomment';

@NgModule({
  declarations: [
    RentalBalanceCommentPage
  ],
  imports: [
    IonicPageModule.forChild(RentalBalanceCommentPage)
  ],
  exports: [
    RentalBalanceCommentPage
  ]
})
export class RentalBalanceCommentPageModule {}