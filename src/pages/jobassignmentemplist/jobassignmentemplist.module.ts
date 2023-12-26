import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { JobAssignmentEmpListPage } from './jobassignmentemplist';

@NgModule({
  declarations: [
    JobAssignmentEmpListPage  ],
  imports: [
    IonicPageModule.forChild(JobAssignmentEmpListPage)
  ],
  entryComponents: [JobAssignmentEmpListPage],
})
export class JobAssignmentEmpPageModule {}