import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UpdateUserGroupPage } from './updateusergroup';
import { SelectSearchableModule } from'ionic-select-searchable';
import { CalendarModule } from "ion2-calendar";

@NgModule({
  declarations: [
    UpdateUserGroupPage,
  ],
  imports: [
    IonicPageModule.forChild(UpdateUserGroupPage),
    SelectSearchableModule,
    CalendarModule
    
  ],
})
export class UpdateUserGroupPageModule {}
