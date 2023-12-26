import { NgModule,NO_ERRORS_SCHEMA,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateReturnChequePage } from './createreturncheque';

@NgModule({
  declarations: [
    CreateReturnChequePage
  ],
  imports: [
    IonicPageModule.forChild(CreateReturnChequePage)
  ],
  exports: [
    CreateReturnChequePage
  ],
  schemas:[NO_ERRORS_SCHEMA,CUSTOM_ELEMENTS_SCHEMA]
})
export class CreateReturnChequePageModule {}