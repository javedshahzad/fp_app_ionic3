import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReturnChequeListPage } from './returnchequelist';

@NgModule({
  declarations: [
    ReturnChequeListPage  ],
  imports: [
    IonicPageModule.forChild(ReturnChequeListPage)
  ],
})
export class ReturnChequeListPageModule {}