import { Component } from '@angular/core';
import { IonicPage, NavController, ModalController, Platform, LoadingController, ToastController, NavParams, Modal, ViewController, ModalOptions } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { RestProvider } from '../../providers/rest/rest';
import { TaskManagementPage } from '../taskmanagement/taskmanagement';
// import { ChatPage } from '../chat/chat';

@IonicPage()
@Component({
  selector: 'page-reporting',
  templateUrl: 'reportinguser.html',
})
export class ReportingUserPage { 

  message: string = '';
  messages = [] as any;
  users: any;
  userdetails: any;
  userdetailsAll: any;
  login_user: any;
  modaltype = this.navParams.get('data');
  user: any = localStorage.getItem('userData');
  header_name = 'Reporting User And ROI';
  user_status: any;
  received_user_id: any;
  online_offline = 'white';
  showuseraccess = "block";
  userarry = [] as any;
  reportinguserlist: any;
  reportinguserlist1:any;
  myModalData: any;
  show_model_1 = 0;
  show_model_2 = 0;


  constructor(public platform: Platform, public navCtrl: NavController, public navParams: NavParams,
    public db: AngularFireDatabase, public view: ViewController, public toastCtrl: ToastController,
    public loadingCtrl: LoadingController, public authService: RestProvider, private modal: ModalController
  ) {
    this.user = this.user ? JSON.parse(this.user) : {};
    this.users = this.user.Surname;
    this.login_user = this.user.UserInfoId;

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReportingPage');
    console.log(this.modaltype);
    this.getuser();  
    this.getReportinguserList(this.modaltype[0].USER_INFO_ID);
  }

  getuser() {
    this.authService.getData({}, 'task/UserList/').then((result: any) => {
      this.userdetails = result.filter(x => x.USER_INFO_ID != this.user.UserInfoId);
      this.userdetailsAll = result;
    }, (err) => {
      this.presentToast(err);
    });
  }

  getReportinguserList(USER_INFO_ID:any) {
    this.presentLoadingDefault(true);
    let data = {
      user_info_id: USER_INFO_ID
    }

    this.authService.postData(data, 'task/reportinguserlist').then((result) => {
      this.reportinguserlist = result;
      this.reportinguserlist1 = result;
      this.presentLoadingDefault(false);

    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });
    
  }

  openReportUser2(USER_INFO_ID:any){
      this.getReportinguserList(USER_INFO_ID);
      this.show_model_1 = 1;
      this.show_model_2 = 1;
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
      this.loading.dismiss();
      this.loading = null
    }
  };

  closeModal() {
    if(this.show_model_1 == 1 && this.show_model_2 == 1){
      this.ionViewDidLoad();
      this.show_model_1 = 0;
      this.show_model_2 = 0;
    }else{
      //this.navCtrl.push(TaskManagementPage, {}, { animate: true, direction: 'forward' });
      this.view.dismiss();
    } 
    
  }


  openTaskdailycmd(USER_INFO_ID: any) {

    this.presentLoadingDefault(true);
    let data = {
      user_id: USER_INFO_ID,
    }
    this.authService.postData(data, 'task/weeklycomments_user_wise_list').then((result: any) => {

      this.presentLoadingDefault(false);
      const myModalOptions: ModalOptions = {
        enableBackdropDismiss: false
      };


      this.myModalData = [result, USER_INFO_ID];

      let myModal: Modal = this.modal.create('UserweeklycommentsPage', { data: this.myModalData }, myModalOptions);
      myModal.present();
      myModal.onDidDismiss((data) => {
      });
      myModal.onWillDismiss((data) => {
      });

    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });

  }
  
  openUserChat(ASSIGNED_USER_INFO_ID: any) {

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let myModalData = [{
      user_details: this.userdetailsAll.filter(x => x.USER_INFO_ID == ASSIGNED_USER_INFO_ID),
      msg_to_user_id: ASSIGNED_USER_INFO_ID,
      TRANS_TYPE: 'CHAT'
    }]

    let myModal: Modal = this.modal.create('ChatMessagePage', { data: myModalData }, myModalOptions);

    myModal.present();
    myModal.onDidDismiss((data) => {
    });
    myModal.onWillDismiss((data) => {
    });
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
