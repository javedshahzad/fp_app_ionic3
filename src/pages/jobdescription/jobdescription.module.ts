import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { JobDescriptionListPage } from './jobdescription';

@NgModule({
  declarations: [
    JobDescriptionListPage  ],
  imports: [
    IonicPageModule.forChild(JobDescriptionListPage)
  ],
  entryComponents: [JobDescriptionListPage],
})
export class JobDescriptionListPageModule {}