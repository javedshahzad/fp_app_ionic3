import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CalendarViewEditPage } from './calendarviewedit';

@NgModule({
  declarations: [
    CalendarViewEditPage,
  ],
  imports: [
    IonicPageModule.forChild(CalendarViewEditPage),
  ],
})
export class CalendarViewEditPageModule {}
