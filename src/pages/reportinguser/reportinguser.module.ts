import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReportingUserPage } from './reportinguser';

@NgModule({
  declarations: [
    ReportingUserPage,
  ],
  imports: [
    IonicPageModule.forChild(ReportingUserPage),
  ],
})
export class ReportingUserPageModule {}
