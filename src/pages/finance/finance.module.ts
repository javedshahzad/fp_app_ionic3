import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FinanceListPage } from './finance';

@NgModule({
  declarations: [
    FinanceListPage  ],
  imports: [
    IonicPageModule.forChild(FinanceListPage)
  ],
})
export class FinanceListPageModule {}