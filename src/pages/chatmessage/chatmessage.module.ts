import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChatMessagePage } from './chatmessage';
@NgModule({
  declarations: [
    ChatMessagePage,
  ],
  imports: [
    IonicPageModule.forChild(ChatMessagePage),
  ],
  providers: [
    
  ],
})
export class ChatMessagePageModule {}
