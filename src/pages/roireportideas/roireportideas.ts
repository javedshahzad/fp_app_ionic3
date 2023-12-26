import { Component } from '@angular/core';
import { IonicPage, NavController, Platform, LoadingController, ToastController, NavParams, ViewController, Modal, ModalController, ModalOptions } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';

@IonicPage()
@Component({
  selector: 'page-roireportideas',
  templateUrl: 'roireportideas.html',
})
export class RoiReportIdeasPage {

  userdetails: any;
  userdetailsAll: any;
  roiReportData: any;
  roiReportDataAll: any;
  myModalData: any;
  users: any;
  header_name = 'ROI Reporting User';
  modaltype = this.navParams.get('data');
  user: any = localStorage.getItem('userData');
  today_date = new Date();
  label_name: any;

  constructor(public platform: Platform, public navCtrl: NavController, public navParams: NavParams,
    public view: ViewController, public toastCtrl: ToastController, private modal: ModalController,
    public loadingCtrl: LoadingController, public authService: RestProvider
  ) {
    this.user = this.user ? JSON.parse(this.user) : {};
    this.label_name = this.modaltype[0].ReportType;
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
      UserInfoId: this.user.UserInfoId,
      roi_type: this.modaltype[0].ReportType
    }

    this.presentLoadingDefault(true);
    this.authService.postData(TASK_DATA, 'task/getReportingUserList').then((result: any) => {
      this.presentLoadingDefault(false);
      console.log('getRoiIdeasUser ', result);
      this.roiReportData = result;
      this.roiReportDataAll = result;
      console.log(this.roiReportData);

    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });
  }

  
  generateIdeaReport(user_id:any,reportType: any) {

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let myModalData = [{
      user_info_id: user_id,
      ReportType: this.modaltype[0].ReportType
    }]
    let modelpage = '';
    if (reportType == 'Weekly')
      modelpage = 'RoiWeeklyReportPage';
    else if (reportType == 'Idea')
      modelpage = 'RoiTypeReportPage';

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
