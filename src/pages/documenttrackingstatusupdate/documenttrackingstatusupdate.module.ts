import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DocumentTrackingStatusUpdatePage } from './documenttrackingstatusupdate';

import { CalendarModule } from "ion2-calendar";

@NgModule({
  declarations: [
    DocumentTrackingStatusUpdatePage,
  ],
  imports: [
    IonicPageModule.forChild(DocumentTrackingStatusUpdatePage),
    CalendarModule
    
  ],
  exports: [
    DocumentTrackingStatusUpdatePage
  ]
})
export class DocumentTrackingStatusUpdatePageModule {}