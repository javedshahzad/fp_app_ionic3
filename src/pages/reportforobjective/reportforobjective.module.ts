import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReportForObjective } from './reportforobjective';


@NgModule({
  declarations: [
    ReportForObjective,
  ],
  imports: [
    IonicPageModule.forChild(ReportForObjective),
  ],
  exports: [
    ReportForObjective
  ]
})
export class ReportForObjectivePageModule {}