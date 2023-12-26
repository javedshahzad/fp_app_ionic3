import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RoiReportingUserList } from './reportinguserlist';


@NgModule({
  declarations: [
    RoiReportingUserList,
  ],
  imports: [
    IonicPageModule.forChild(RoiReportingUserList),
  ],
  exports: [
    RoiReportingUserList
  ]
})
export class RoiReportingUserListPageModule {}