import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PropertyModalPage } from './propertymodal';

@NgModule({
  declarations: [
    PropertyModalPage,
  ],
  imports: [
    IonicPageModule.forChild(PropertyModalPage),
  ],
})
export class PropertyModalPageModule {}
