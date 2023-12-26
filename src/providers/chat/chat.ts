import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
//import { File } from '@ionic-native/file';
//import {FileTransfer,FileTransferObject} from '@ionic-native/file-transfer';  
//import { FileChooser } from '@ionic-native/file-chooser';
//import { FilePath } from '@ionic-native/file-path';
import { Events } from 'ionic-angular';
import { Observable } from 'rxjs/observable';
import { map } from 'rxjs/operators/map';
import firebase from 'firebase';
/*
  Generated class for the ChatProvider provider.
  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ChatProvider {
  singleChat: any;
  singleChatList: AngularFireList<any>;
  chatList: Observable<any>;
  user: any;
  usermessages = [];
  nativepath: any;
  firestore = firebase.storage();
  constructor(public events: Events, public db: AngularFireDatabase) {
    this.singleChatList = this.db.list('/user_message');
    this.chatList = this.singleChatList.snapshotChanges().pipe(
      map((changes: any, i) => changes.map(c => ({ key: c.payload.key, ...c.payload.val() })))
    );
  }

  initializebuddy(user) {
    this.user = user;
  }

  addnewmessage(msg) {
    if (this.user) {
      var promise = '';
      return promise;
    }
  }

  getUsermessages(UserId, to_user_id) {
    return this.chatList.filter(x => (x.sender_id == UserId && x.receiver_id == to_user_id) || (x.receiver_id == UserId && x.sender_id == to_user_id))
  }

  // uploadimage() {
  //   var promise = new Promise((resolve, reject) => {
  //       this.filechooser.open().then((url) => {
  //         (<any>window).FilePath.resolveNativePath(url, (result) => {
  //           this.nativepath = result;
  //           (<any>window).resolveLocalFileSystemURL(this.nativepath, (res) => {
  //             res.file((resFile) => {
  //               var reader = new FileReader();
  //               reader.readAsArrayBuffer(resFile);
  //               reader.onloadend = (evt: any) => {
  //                 var imgBlob = new Blob([evt.target.result], { type: 'image/jpeg' });
  //                 var imageStore = this.firestore.ref('/profileimages').child(firebase.auth().currentUser.uid);
  //                 imageStore.put(imgBlob).then((res) => {
  //                   this.firestore.ref('/profileimages').child(firebase.auth().currentUser.uid).getDownloadURL().then((url) => {
  //                     resolve(url);
  //                   }).catch((err) => {
  //                       reject(err);
  //                   })
  //                 }).catch((err) => {
  //                   reject(err);
  //                 })
  //               }
  //             })
  //           })
  //         })
  //     })
  //   })    
  //    return promise;   
  // }

  // grouppicstore(groupname) {
  //   var promise = new Promise((resolve, reject) => {
  //       this.filechooser.open().then((url) => {
  //         (<any>window).FilePath.resolveNativePath(url, (result) => {
  //           this.nativepath = result;
  //           (<any>window).resolveLocalFileSystemURL(this.nativepath, (res) => {
  //             res.file((resFile) => {
  //               var reader = new FileReader();
  //               reader.readAsArrayBuffer(resFile);
  //               reader.onloadend = (evt: any) => {
  //                 var imgBlob = new Blob([evt.target.result], { type: 'image/jpeg' });
  //                 var imageStore = this.firestore.ref('/groupimages').child(firebase.auth().currentUser.uid).child(groupname);
  //                 imageStore.put(imgBlob).then((res) => {
  //                   this.firestore.ref('/profileimages').child(firebase.auth().currentUser.uid).child(groupname).getDownloadURL().then((url) => {
  //                     resolve(url);
  //                   }).catch((err) => {
  //                       reject(err);
  //                   })
  //                 }).catch((err) => {
  //                   reject(err);
  //                 })
  //               }
  //             })
  //           })
  //         })
  //     })
  //   })    
  //    return promise;   
  // }

  // picmsgstore() {
  //   var promise = new Promise((resolve, reject) => {
  //       this.filechooser.open().then((url) => {
  //         (<any>window).FilePath.resolveNativePath(url, (result) => {
  //           this.nativepath = result;
  //           (<any>window).resolveLocalFileSystemURL(this.nativepath, (res) => {
  //             res.file((resFile) => {
  //               var reader = new FileReader();
  //               reader.readAsArrayBuffer(resFile);
  //               reader.onloadend = (evt: any) => {
  //                 var imgBlob = new Blob([evt.target.result], { type: 'image/jpeg' });
  //                 var uuid = this.guid();
  //                 var imageStore = this.firestore.ref('/filemsgs').child('filemsg' + uuid);
  //                 imageStore.put(imgBlob).then((res) => {
  //                     resolve(res.downloadURL);
  //                   }).catch((err) => {
  //                       reject(err);
  //                 })
  //                 .catch((err) => {
  //                   reject(err);
  //                 })
  //               }
  //             })
  //           })
  //         })
  //     })
  //   })    
  //    return promise;   
  // }


  filemsgstore(url, contentType, extn) {
    var promise = new Promise((resolve, reject) => {
      // (<any>window).FilePath.resolveNativePath(url, (result) => {
      //    this.nativepath = result;
      (<any>window).resolveLocalFileSystemURL(url, (res) => {
        res.file((resFile) => {
          var reader = new FileReader();
          reader.readAsArrayBuffer(resFile);
          reader.onloadend = (evt: any) => {
            var imgBlob = new Blob([evt.target.result], { type: contentType });
            var uuid = this.guid() + '.' + extn;
            var imageStore = this.firestore.ref('/chatfiles').child(uuid);
            imageStore.put(imgBlob).then((res) => {
              res.metadata
              resolve(res.downloadURL);
            }).catch((err) => {
              reject(err);
            })
              .catch((err) => {
                reject(err);
              })
          }
        })
      })
    })
    //  })    
    return promise;
  }

  getFirebaseFileUri(file_uri) {
    var promise = new Promise((resolve, reject) => {
      var imageStore = firebase.storage();
      imageStore.refFromURL(file_uri).getDownloadURL().then(url => resolve(url)).catch(err => reject(err));
    });
    return promise;
  }

  guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    return `${s4() + s4()}-${s4() + s4()}-${s4() + s4()}-${s4() + s4()}`;
  }


  audiofilestore(url, contentType, extn) {
    debugger;
    var promise = new Promise((resolve, reject) => {
      (<any>window).resolveLocalFileSystemURL(url, (res) => {
        res.file((resFile) => {
          debugger;
          var reader = new FileReader();
          reader.readAsArrayBuffer(resFile);
          reader.onloadend = (evt: any) => {
            var imgBlob = new Blob([evt.target.result], { type: contentType });
            var uuid = this.guid() + '.' + extn;
            var imageStore = this.firestore.ref('/audiofiles').child(uuid);
            imageStore.put(imgBlob).then((res) => {
              res.metadata
              resolve(res.downloadURL);
            }).catch((err) => {
              reject(err);
              alert(JSON.stringify(err));
            })
              .catch((err) => {
                reject(err);
                alert(JSON.stringify(err));
              })
          }
        })
      })
    })
    return promise;
  }

}