import { Component } from '@angular/core';
import { IonicPage, NavController, Platform, LoadingController, ToastController, NavParams, ViewController, Modal, ModalController, ModalOptions } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';

@IonicPage()
@Component({
  selector: 'page-roiweeklyreport',
  templateUrl: 'roiweeklyreport.html',
})

export class RoiWeeklyReportPage {


  userdetails:any;
  userdetailsAll:any;
  roiReportData:any;
  roiReportDataAll:any;
  myModalData: any;
  users: any;
  header_name = 'ROI Weekly Report'; 
  modaltype   = this.navParams.get('data');
  user: any   = localStorage.getItem('userData');  
  today_date  = new Date();

  constructor(public platform: Platform, public navCtrl: NavController, public navParams: NavParams,
    public view: ViewController, public toastCtrl: ToastController,private modal: ModalController,
    public loadingCtrl: LoadingController, public authService: RestProvider
  ) {      
    this.user = this.user ? JSON.parse(this.user) : {};
  }

  ionViewDidLoad() {    
      this.getuser();  
      this.generateReport();  
  }

  closeModal() {
    this.view.dismiss();
  }

  getuser() {
    this.presentLoadingDefault(true);
    this.authService.getData({}, 'task/UserList/').then((result: any) => {
      this.userdetails = result.filter(x => x.USER_INFO_ID != this.user.UserInfoId);
      this.userdetailsAll = result;
      this.presentLoadingDefault(false);
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });
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

  generateReport(){
    
    let TASK_DATA = {
      user_info_id: this.user.UserInfoId
    }

    this.presentLoadingDefault(true);
    this.authService.postData(TASK_DATA, 'task/getRoiReport').then((result:any) => {
      this.presentLoadingDefault(false); 
      this.roiReportData =  result;
      this.roiReportDataAll =  result;
      
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });
  }


  getItems(searchbar) {

    var q = searchbar.value;
    if (q.trim() == '') {
      this.roiReportData = this.roiReportDataAll;
      return;
    }

    this.roiReportData = this.roiReportDataAll.filter((v) => {

      if (v.USER_SURNAME.toLowerCase().indexOf(q.toLowerCase()) > -1) {
        return true;
      }

      return false;
    })

  }

  
  openUserChat(ASSIGNED_USER_INFO_ID: any, ASSIGNED_TO: any) {

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

  
  openTaskdailycmd(USER_INFO_ID: any,USER_SURNAME:any) {

    this.presentLoadingDefault(true);
    let data = {
      user_id: USER_INFO_ID,
      user_name:USER_SURNAME
    }
    this.authService.postData(data, 'task/weeklycomments_user_wise_list').then((result: any) => {

      this.presentLoadingDefault(false);
      const myModalOptions: ModalOptions = {
        enableBackdropDismiss: false
      };
 

      this.myModalData = [result, USER_INFO_ID, 0,USER_SURNAME];

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
