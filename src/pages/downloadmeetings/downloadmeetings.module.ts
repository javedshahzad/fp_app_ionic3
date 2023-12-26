import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DownloadMeetingsPage } from './downloadmeetings';

@NgModule({
  declarations: [
    DownloadMeetingsPage,
  ],
  imports: [
    IonicPageModule.forChild(DownloadMeetingsPage),
  ],
})
export class DownloadMeetingsPageModule {}
