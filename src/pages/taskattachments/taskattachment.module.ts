import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TaskFileUploadsPage } from './taskattachment';
import { AngularCropperjsModule } from 'angular-cropperjs';
@NgModule({
  declarations: [
    TaskFileUploadsPage,
  ],
  imports: [
    IonicPageModule.forChild(TaskFileUploadsPage),
    AngularCropperjsModule
  ],
  exports: [
    TaskFileUploadsPage
  ]
})
export class TaskFileUploadsPageModule {}