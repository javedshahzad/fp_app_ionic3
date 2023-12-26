import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateMomPage } from './createminutesofmeeting';
import { SelectSearchableModule } from'ionic-select-searchable';
import { CalendarModule } from "ion2-calendar";

@NgModule({
  declarations: [
    CreateMomPage,
  ],
  imports: [
    IonicPageModule.forChild(CreateMomPage),
    SelectSearchableModule,
    CalendarModule
    
  ],
})
export class CreateMomPageModule {}
