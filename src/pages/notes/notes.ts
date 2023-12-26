import { Component,ElementRef } from '@angular/core';
import { IonicPage,NavController, NavParams, ToastController, LoadingController, AlertController } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { DashboardPage } from '../dashboard/dashboard';

/**
 * Generated class for the NotesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-notes',
  templateUrl: 'notes.html',
})
export class NotesPage {
  title='Notes'
  Note :any = {}
  NotesList:any =[];
  index=0;
  content:any='';
  NOTES_ID:any;
  isList:boolean=true;
  user: any = localStorage.getItem('userData');
  reminderDate:any;
  reminderTime:any;
  reminder_model ='none';
  constructor(public navCtrl: NavController, public navParams: NavParams,public authService: RestProvider, public toastCtrl: ToastController,
    public alertCtrl:AlertController,public element:ElementRef, public loadingCtrl: LoadingController,) {
      this.user = this.user ? JSON.parse(this.user) : {};
      let nData = localStorage.getItem('notesData');
      this.NotesList = nData ? JSON.parse(nData) : [];
  }  

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotesPage');
    this.getBackUp();
  }
  
  loading = this.loadingCtrl.create();
  
  presentLoadingDefault(show) {
    if (!this.loading) {
      this.loading = this.loadingCtrl.create();
    }
    if (show) {
      this.loading.present();
    }
    else {
      if (this.loading) {
        this.loading.dismiss();
      }
      this.loading = null
    }
  };

  onCloseModelDiv(type){
    if(type =='reminder'){
      this.reminder_model ='none';
    }
  }

  
  openReminder(index){    
    var element = document.getElementById("accordionExample");
    setTimeout(()=>{element.scrollIntoView(true)},10); 
    this.reminder_model ='block';
    this.index = index;
    this.Note = this.NotesList[index];
    let dateTime  = this.Note.isReminder == 1 ? this.Note.reminderDateTime : '';
    var _split = [];
    if (this.Note.isReminder == 1){
      _split =dateTime.split(',');
    //  let time_split = _Split ? _Split[1].split(':') : '';
    }
    this.reminderDate=  this.Note.isReminder == 1 ?  _split[0] :'';
    this.reminderTime= this.Note.isReminder == 1 ?  _split[1] :'';
   
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'middle'
    });
    toast.present();
  }

  saveReminder(){
    if(this.reminderDate == '' || this.reminderDate == null){
      this.presentToast("Please enter reminder date.");
      return;
    }

    if(this.reminderTime == '' || this.reminderTime == null){
      this.presentToast("Please enter time.");
      return;
    }
    console.log(this.reminderDate + ',' + this.reminderTime)
    
      this.Note.isReminder = 1,
      this.Note.reminderDateTime = this.reminderDate + ',' + this.reminderTime;
      this.NotesList[this.index]= this.Note;
      this.reminder_model ='none';
      this.saveBackUp();
  }

  getBackUp(){
     this.presentLoadingDefault(true);
    this.authService.getData({}, `notes/getList/${this.user.UserInfoId}`).then((result:any) => {
      this.NOTES_ID=result ? result.NOTES_ID:0
      var notes = result ? result.NOTES : '[]';
      localStorage.setItem('notesData', notes);
      this.NotesList = notes != '[]' ? JSON.parse(notes) : [];
      this.index = this.NotesList.length;
      this.presentLoadingDefault(false);
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });
  }

  noteChanged(){
    this.Note.content =this.content;
    this.Note.title = this.content.length > 20 ? this.content.substring(0,20)+"..." : this.content ;
    this.NotesList[this.index]= this.Note;
    this.adjust();
    this.backup();
  }

  backTolist(){
    this.isList = true;
    this.title='Notes';
    this.saveBackUp();
  }
  
  goBack() {
    this.navCtrl.setRoot(DashboardPage);
  }

  noteAdded(){
    // let alert = this.alertCtrl.create({
    //   title: 'New Note',
    //   message: 'The title of this note be?',
    //   inputs: [
    //     {
    //       type: 'text',
    //       name: 'title'
    //     }
    //   ],
    //   buttons: [
    //     {
    //       text: 'Cancel',
    //       handler: (data) => {
    //         alert.dismiss();
    //       }
    //     },
    //     {
    //       text: 'Save',
    //       handler: (data) => {
    //         this.isList = false;
    //         let ind = this.NotesList ? this.NotesList.length : 0;
    //         this.index = 0;
    //         this.content='';
    //         let now =Date.now();
    //         let note = {
    //           id : ind +1,
    //           title : data.title,
    //           content :'',
    //           date  :  now,
    //           isReminder:0,
    //           reminderDateTime:''
    //         };
    //         this.NotesList.unshift(note) ;
    //         this.Note = note;
    //         this.title=data.title;
    //         alert.dismiss();
    //       }
    //     }
    //   ]
    // })
    //   alert.present();
    this.isList = false;
            let ind = this.NotesList.length > 1 ? this.NotesList[0].id : 0;
            this.index = 0;
            this.content='';
            let now =Date.now();
    let note = {
      id : ind +1,
      title : '',
      content :'',
      date  :  now,
      isReminder:0,
      reminderDateTime:''
    };
    this.title='';
    this.NotesList.unshift(note) ;
    this.Note = note;
  }
  
  noteEdit(ind){
    this.isList = false;
    this.index = ind;
    this.Note = this.NotesList[ind];
    this.content = this.Note.content;
    this.title=this.Note.title;
  }

  noteDelete(index){
    this.isList = true;
    this.NotesList.splice(index, 1);
    this.saveBackUp();
    this.element.nativeElement.style.overflow = "hidden";
    this.element.nativeElement.height = null;
    this.element.nativeElement.style.height = Math.min(this.element.nativeElement.scrollHeight, 460) + "px";
  }

  backup(){
    let notes = JSON.stringify(this.NotesList)
    localStorage.setItem('notesData', notes);
  }

  saveBackUp(){
    let notes = JSON.stringify(this.NotesList)
    localStorage.setItem('notesData', notes);
    let context ={
      Notes:notes,
      USER_ID:this.user.UserInfoId,
      NOTES_ID:this.NOTES_ID
    }
    this.authService.postData(context, 'notes/saveNotes').then((result) => {
     // console.log('res', result);
    });
  }

  adjust() {
    const textArea = this.element.nativeElement.getElementsByTagName('textarea')[0];
    textArea.style.overflow = 'hidden';
    textArea.style.height = 'auto';
    textArea.style.height = textArea.scrollHeight + 'px';
  }

  presentLoadingCustom(show) {
    let loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: `<img width = 50 height= 50 src="assets/imgs/logo_new.png" />`,
      duration: 5000
    });

    if (show) {
      loading.present();
    }else {
      loading.dismissAll();
      loading = null
    }
  }

}
