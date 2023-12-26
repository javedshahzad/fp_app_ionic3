import { Component } from '@angular/core';
import { IonicPage, NavController, Platform, LoadingController, ToastController, NavParams, ViewController, Modal, ModalController, ModalOptions } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';

@IonicPage()
@Component({
  selector: 'page-roireport',
  templateUrl: 'roireport.html',
})
export class RoiReportPage {

  userdetails: any;
  userdetailsAll: any;
  roiReportData: any;
  roiReportDataAll: any;
  myModalData: any;
  users: any;
  header_name = 'ROI';
  modaltype = this.navParams.get('data');
  user: any = localStorage.getItem('userData');
  today_date = new Date();

  constructor(public platform: Platform, public navCtrl: NavController, public navParams: NavParams,
    public view: ViewController, public toastCtrl: ToastController, private modal: ModalController,
    public loadingCtrl: LoadingController, public authService: RestProvider
  ) {
    this.user = this.user ? JSON.parse(this.user) : {};
  }


  ionViewDidLoad() {
    
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
  
  openModal(type_string: any) {

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let myModalData = [{
      user_info_id: this.user.UserInfoId,
      ReportType: type_string
    }];

    let modelpage = '';    
      modelpage = 'RoiReportIdeasPage';

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



}
