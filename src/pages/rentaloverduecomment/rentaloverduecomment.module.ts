import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RentalOverdueCommentPage } from './rentaloverduecomment';

@NgModule({
  declarations: [
    RentalOverdueCommentPage
  ],
  imports: [
    IonicPageModule.forChild(RentalOverdueCommentPage)
  ],
  exports: [
    RentalOverdueCommentPage
  ]
})
export class RentalOverdueCommentPageModule {}