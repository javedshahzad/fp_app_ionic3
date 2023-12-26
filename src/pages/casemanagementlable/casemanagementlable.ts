import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController, Modal, ModalController, ModalOptions, ViewController } from 'ionic-angular';
import { DashboardPage } from '../dashboard/dashboard';
import { RestProvider } from '../../providers/rest/rest';

@Component({
  selector: 'page-casemanagementlable',
  templateUrl: 'casemanagementlable.html',
})

export class CasemanagementlablePage {

  paymentdetailsall: any;
  CaseManagementlable = [] as any;
  insertedValues: any;
  modalnavigationdata: any;
  NOTICE: any;
  LEGALNOTICE: any;
  NOTIFICATIONUNT: any;
  HEARINGNOT: any;
  CASENOTYETREG: any;
  PENDINGEXECUTENOTIFY: any;
  PENDINGDEFENDAR: any;
  PERIODUNDRNOTICEOVR: any;
  PERIODUNDRNOTICE: any;
  PENDING_LEASE_VERIFY: any;
  PENDING_LEASE_VERIFY_AMT: any;
  LEGAL_NOTICE_PROCESS: any;
  LEGAL_NOTICE_PROCESS_AMT: any;
  CASE_NOT_REGISTER: any;
  CASE_NOT_REGISTER_AMT: any;
  CASE_REGISTER_PROCESS: any;
  CASE_REGISTER_PROCESS_AMT: any;
  CASE_EXEC_NOT_STARTED: any;
  CASE_EXEC_NOT_STARTED_AMT: any;
  CASE_EXEC_PROCESS: any;
  CASE_EXEC_PROCESS_AMT: any;
  HOLDED: any;
  HOLDED_AMT: any;
  SETTLED: any;
  SETTLED_AMT: any;
  ALL_CASE: any;
  ALL_CASE_AMT: any;
  search_value: any = "";
  ESCALATIONTOCEO: any;

  user: any = localStorage.getItem('userData');

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public authService: RestProvider, public toastCtrl: ToastController,
    private modal: ModalController, public loadingCtrl: LoadingController,
    public view: ViewController
  ) {
    this.user = this.user ? JSON.parse(this.user) : {};
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

  goBack() {
    this.navCtrl.setRoot(DashboardPage);
  }

  Labledetails() {
    this.presentLoadingDefault(true);
    this.authService.getData({}, 'case_management/CaseManagementList_lable/' + this.user.UserInfoId).then((result) => {
      this.NOTICE = result[0].NOTICE;
      this.LEGALNOTICE = result[0].LEGALNOTICE;
      this.NOTIFICATIONUNT = result[0].NOTIFICATIONUNT;
      this.HEARINGNOT = result[0].HEARINGNOT;
      this.CASENOTYETREG = result[0].CASENOTYETREG;
      this.PENDINGEXECUTENOTIFY = result[0].PENDINGEXECUTENOTIFY;
      this.PENDINGDEFENDAR = result[0].PENDINGDEFENDAR;
      this.PERIODUNDRNOTICEOVR = result[0].PERIODUNDRNOTICEOVR;
      this.PERIODUNDRNOTICE = result[0].PERIODUNDRNOTICE;
      this.PENDING_LEASE_VERIFY = result[0].PENDING_LEASE_VERIFY;
      this.PENDING_LEASE_VERIFY_AMT = result[0].PENDING_LEASE_VERIFY_AMT;
      this.LEGAL_NOTICE_PROCESS = result[0].LEGAL_NOTICE_PROCESS;
      this.LEGAL_NOTICE_PROCESS_AMT = result[0].LEGAL_NOTICE_PROCESS_AMT;
      this.CASE_NOT_REGISTER = result[0].CASE_NOT_REGISTER;
      this.CASE_NOT_REGISTER_AMT = result[0].CASE_NOT_REGISTER_AMT;
      this.CASE_REGISTER_PROCESS = result[0].CASE_REGISTER_PROCESS;
      this.CASE_REGISTER_PROCESS_AMT = result[0].CASE_REGISTER_PROCESS_AMT;
      this.CASE_EXEC_NOT_STARTED = result[0].CASE_EXEC_NOT_STARTED;
      this.CASE_EXEC_NOT_STARTED_AMT = result[0].CASE_EXEC_NOT_STARTED_AMT;
      this.CASE_EXEC_PROCESS = result[0].CASE_EXEC_PROCESS;
      this.CASE_EXEC_PROCESS_AMT = result[0].CASE_EXEC_PROCESS_AMT;
      this.HOLDED = result[0].HOLDED;
      this.HOLDED_AMT = result[0].HOLDED_AMT;
      this.SETTLED = result[0].SETTLED;
      this.SETTLED_AMT = result[0].SETTLED_AMT;
      this.ALL_CASE = result[0].ALL_CASE;
      this.ALL_CASE_AMT = result[0].ALL_CASE_AMT;
      this.ESCALATIONTOCEO = result[0].ESCALATIONTOCEO;

      this.presentLoadingDefault(false);
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });
  }
  ionViewDidLoad() {
    this.Labledetails();
  }

  openDetailModal(type: any) {

    this.openModel(type, '')

  }

  openModel(type, searchValue) {
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let myModalData = {
      Type: type,
      SearchData: searchValue
    };

    let myModal: Modal = this.modal.create('CasemanagementPage', { data: myModalData }, myModalOptions);

    myModal.present();

    myModal.onDidDismiss((data) => {
      // console.log("I have dismissed.");
      // console.log(data);
      this.ionViewDidLoad();
    });

    myModal.onWillDismiss((data) => {
      // console.log("I'm about to dismiss");
      // console.log(data);
      this.ionViewDidLoad();
    });
  }

  SearchCase() {
    if (this.search_value != '') {
      this.openModel('ALL_CASE', this.search_value)
    }
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
