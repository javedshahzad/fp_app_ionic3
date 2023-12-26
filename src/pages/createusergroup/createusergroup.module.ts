import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateUserGroupPage } from './createusergroup';
import { SelectSearchableModule } from'ionic-select-searchable';
import { CalendarModule } from "ion2-calendar";

@NgModule({
  declarations: [
    CreateUserGroupPage,
  ],
  imports: [
    IonicPageModule.forChild(CreateUserGroupPage),
    SelectSearchableModule,
    CalendarModule
    
  ],
})
export class CreateUserGroupPageModule {}
