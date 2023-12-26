import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { userAttendanceReportPage } from './userattendancereport';

@NgModule({
  declarations: [
    userAttendanceReportPage,
  ],
  imports: [
    IonicPageModule.forChild(userAttendanceReportPage)
  ],
})
export class userAttendanceReportPageModule {}
