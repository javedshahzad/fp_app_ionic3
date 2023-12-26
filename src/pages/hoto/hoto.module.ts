import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HotoPage } from './hoto';

@NgModule({
  declarations: [
    HotoPage  ],
  imports: [
    IonicPageModule.forChild(HotoPage)
  ],
})
export class HotoPageModule {}