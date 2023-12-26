import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChatPage } from './chat';
import { SelectSearchableModule } from'ionic-select-searchable';

@NgModule({
  declarations: [
    ChatPage
  ],
  imports: [
    IonicPageModule.forChild(ChatPage),
    SelectSearchableModule
  ],
  exports: [
    ChatPage
  ]
})
export class ChatPageModule {}