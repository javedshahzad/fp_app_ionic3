import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ToastController, LoadingController, Modal, ModalController, ModalOptions, ViewController } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { Slides } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-minutesofmeeting',
  templateUrl: 'minutesofmeeting.html',
})
export class MinutesOfMeetingPage {
  @ViewChild(Slides) slides: Slides;

  today: any;
  user_role: any;
  user: any = localStorage.getItem('userData');
  userdetails: any;
  userdetailsAll: any;

  constructor(public platform: Platform, public navCtrl: NavController, public navParams: NavParams,
    public authService: RestProvider, public toastCtrl: ToastController, private modal: ModalController,
    public loadingCtrl: LoadingController, public view: ViewController
  ) {
    this.user = this.user ? JSON.parse(this.user) : {};
    this.today = Date.now();
    this.user_role = this.user.resourseData.TYPE_USER;
    console.log('User Role is ' + this.user_role);
  }


  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'middle'
    });
    toast.present();
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
      this.loading.dismissAll();
      this.loading = null
    }
  };

  ionViewDidLoad() {

  }

  getuser() {

    this.authService.getData({}, 'task/UserList/').then((result: any) => {
      this.userdetails = result.filter(x => x.USER_INFO_ID != this.user.UserInfoId);
      this.userdetailsAll = result;

    }, (err) => {
      this.presentToast(err);
    });
  }

  createNewMeeting() {
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let myModalData = [{
      user_info_id: this.user.UserInfoId
    }];

    let modelpage = '';
    modelpage = 'CreateMomPage';

    let myModal: Modal = this.modal.create(modelpage, { data: myModalData }, myModalOptions);

    myModal.present();
    myModal.onDidDismiss((data) => {
    });
    myModal.onWillDismiss((data) => {
    });
  }


  MyMeeting() {
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let myModalData = [{
      user_info_id: this.user.UserInfoId
    }];

    let modelpage = '';
    modelpage = 'MyMeetingsPage';

    let myModal: Modal = this.modal.create(modelpage, { data: myModalData }, myModalOptions);

    myModal.present();
    myModal.onDidDismiss((data) => {
    });
    myModal.onWillDismiss((data) => {
    });
  }

  
  MyMeetingDownload() {
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let myModalData = [{
      user_info_id: this.user.UserInfoId
    }];

    let modelpage = '';
    modelpage = 'DownloadMeetingsPage';

    let myModal: Modal = this.modal.create(modelpage, { data: myModalData }, myModalOptions);

    myModal.present();
    myModal.onDidDismiss((data) => {
    });
    myModal.onWillDismiss((data) => {
    });
  }

}
