import { Component } from '@angular/core';
import { IonicPage, NavController, Platform, LoadingController, ToastController, NavParams, ViewController, Modal, ModalController, ModalOptions } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';

@IonicPage()
@Component({
  selector: 'page-roipointsuserlist',
  templateUrl: 'roipointsuserlist.html',
})
export class RoiPointsUserListPage {

  userdetails: any;
  userdetailsAll: any;
  roiReportData: any;
  roiReportDataAll: any;
  myModalData: any;
  users: any;
  header_name = 'Pending Points';
  modaltype   = this.navParams.get('data');
  user: any   = localStorage.getItem('userData');
  today_date  = new Date();

  constructor(public platform: Platform, public navCtrl: NavController, public navParams: NavParams,
    public view: ViewController, public toastCtrl: ToastController, private modal: ModalController,
    public loadingCtrl: LoadingController, public authService: RestProvider
  ) {
    this.user = this.user ? JSON.parse(this.user) : {};
  }


  ionViewDidLoad() {
    this.generateReport();
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'middle'
    });
    toast.present();
  }

  closeModal() {
    this.view.dismiss();
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

  generateReport() {

    let TASK_DATA = {
      UserInfoId: this.user.UserInfoId
    }

    this.presentLoadingDefault(true);
    this.authService.postData(TASK_DATA, 'task/getRoiPointsUserList').then((result: any) => {
      this.presentLoadingDefault(false);
      console.log('getRoiPointsUserList ', result);
      this.roiReportData = result;
      this.roiReportDataAll = result;

    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });
  }

  
  generatePendingPoints(user_id:any, user_name:any) {

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let myModalData = [{
      user_info_id: user_id,
      user_name: user_name
    }];

    let modelpage = '';
    
      modelpage = 'RoiUserWeekPointsPage';


    let myModal: Modal = this.modal.create(modelpage, { data: myModalData }, myModalOptions);

    myModal.present();
    myModal.onDidDismiss((data) => {
    });
    myModal.onWillDismiss((data) => {
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
