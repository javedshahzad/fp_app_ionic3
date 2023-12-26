import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RoiReminderPage } from './roi-reminder';
import { CalendarModule } from "ion2-calendar";
@NgModule({
  declarations: [
    RoiReminderPage,
  ],
  imports: [
    IonicPageModule.forChild(RoiReminderPage),
    CalendarModule
  ],
})
export class RoiReminderPageModule {}
