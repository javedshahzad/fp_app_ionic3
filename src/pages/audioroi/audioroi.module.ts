import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AudioRoiPage } from './audioroi';


@NgModule({
  declarations: [
    AudioRoiPage,
  ],
  imports: [
    IonicPageModule.forChild(AudioRoiPage),
  ],
  exports: [
    AudioRoiPage
  ]
})
export class AudioRoiPageModule {}