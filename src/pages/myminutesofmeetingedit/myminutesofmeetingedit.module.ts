import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyMinutesOfMeetingEditPage } from './myminutesofmeetingedit';
import { SelectSearchableModule } from'ionic-select-searchable';
import { CalendarModule } from "ion2-calendar";

@NgModule({
  declarations: [
    MyMinutesOfMeetingEditPage,
  ],
  imports: [
    IonicPageModule.forChild(MyMinutesOfMeetingEditPage),
    SelectSearchableModule,
    CalendarModule
    
  ],
})
export class MyMinutesOfMeetingEditPageModule {}
