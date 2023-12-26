import { Component } from '@angular/core';
import { ViewController, NavParams, NavController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { DashboardPage } from '../dashboard/dashboard';

@Component({
  template:
    `
  <ion-list>    
    <button ion-item (click)="clearchat()">Clear Chat</button>
    <button ion-item (click)="close()">Close</button>
  </ion-list>
`
})

export class PopoverChatPage {

  constructor(public viewCtrl: ViewController,
    public navParams: NavParams,public db: AngularFireDatabase, public navCtrl: NavController) {
  }

  close() {
    //this.viewCtrl.dismiss();
    //this.navCtrl.push(DashboardPage, {});
    this.navCtrl.push(DashboardPage, {}, { animate: true, direction: 'forward' });
  }

  clearchat() {
    let userId = this.navParams.get('userId');
    let chatList = JSON.parse(this.navParams.get('chatList'));
   // console.log('chatList : ' + chatList)
    for ( var i=0; i < chatList.length;i++) {
      let clear_ids = chatList[i].clear_ids ? chatList[i].clear_ids :[];
      if(clear_ids.indexOf(userId) == -1){
        const items = this.db.list('/user_message');
        clear_ids.push(userId);
        items.update(chatList[i].key, { clear_ids: clear_ids }).then(() => {    });        
      }    
    }
    // this.db.list('/user_message').snapshotChanges().subscribe(snapshots =>  snapshots.forEach(i => {
    //   let item = i.payload.val()
    //   item.key = i.payload.key
    //     console.log( + ' : ' + i.payload.key)
    //   })
    //   ); 
      //.child('sender_id').equalTo(senderId).orderByChild('receiver_id').equalTo(receiverId).on('snapshotChanges', item=> console.log(item.ref))
    // snapshotChanges().subscribe(snapshots => snapshots.forEach(snapshot => {
    //   console.log(snapshot.payload.ref);
    // }));
    // this.db.list('/user_message',ref => ref.orderByChild('sender_id').equalTo(senderId).orderByChild('receiver_id').equalTo(receiverId)).snapshotChanges().subscribe(snapshots => snapshots.forEach(snapshot => {
    //   console.log(snapshot.payload.ref);
    // }));
    

    this.viewCtrl.dismiss();
  }

}
