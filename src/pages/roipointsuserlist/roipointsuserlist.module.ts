import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RoiPointsUserListPage } from './roipointsuserlist';

@NgModule({
  declarations: [
    RoiPointsUserListPage,
  ],
  imports: [
    IonicPageModule.forChild(RoiPointsUserListPage),
  ],
})
export class RoiPointsUserListPageModule {}
