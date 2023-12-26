import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyMeetingsPage } from './mymeetings';

@NgModule({
  declarations: [
    MyMeetingsPage  ],
  imports: [
    IonicPageModule.forChild(MyMeetingsPage)
  ],
})
export class MyMeetingsPageModule {}