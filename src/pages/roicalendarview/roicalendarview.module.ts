import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RoiCalendarView } from './roicalendarview';
import { CalendarModule } from 'ionic3-calendar-en';

@NgModule({
  declarations: [
    RoiCalendarView,
  ],
  imports: [    
    CalendarModule,
    IonicPageModule.forChild(RoiCalendarView),
  ],
})
export class RoiCalendarViewPageModule {}
