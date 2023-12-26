import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { lpoItemInList } from './lpoiteminlist';

@NgModule({
  declarations: [
    lpoItemInList,
  ],
  imports: [
    IonicPageModule.forChild(lpoItemInList),
  ],
})
export class lpoItemInListModule {}
