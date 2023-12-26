import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PropertyManagementPage } from './propertymanagement';

@NgModule({
  declarations: [
    PropertyManagementPage,
  ],
  imports: [
    IonicPageModule.forChild(PropertyManagementPage),
  ],
})
export class PropertyManagementPageModule {}
