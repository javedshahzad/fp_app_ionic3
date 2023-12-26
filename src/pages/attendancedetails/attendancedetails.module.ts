import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { attendanceDetailPage } from './attendancedetails';
import { SelectSearchableModule } from'ionic-select-searchable';
import { CalendarModule } from "ion2-calendar";

@NgModule({
  declarations: [
    attendanceDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(attendanceDetailPage),
    SelectSearchableModule,
    CalendarModule
  ],
})
export class attendanceDetailPageModule {}
