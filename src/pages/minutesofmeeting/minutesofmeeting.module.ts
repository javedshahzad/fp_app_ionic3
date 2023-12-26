import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MinutesOfMeetingPage } from './minutesofmeeting';


@NgModule({
  declarations: [
    MinutesOfMeetingPage,
  ],
  imports: [
    IonicPageModule.forChild(MinutesOfMeetingPage),
  ],
  exports: [
    MinutesOfMeetingPage
  ]
})
export class MinutesOfMeetingPageModule {}