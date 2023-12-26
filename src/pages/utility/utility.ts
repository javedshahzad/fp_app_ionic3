import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, Modal, ModalController, ModalOptions, ViewController } from 'ionic-angular';
import { DashboardPage } from '../dashboard/dashboard';
import { RestProvider } from '../../providers/rest/rest';

@IonicPage()
@Component({
  selector: 'page-utility',
  templateUrl: 'utility.html',
})
export class UtilityPage {

  resourcedetails: any = localStorage.getItem('resourseData');
  user: any = localStorage.getItem('userData');
  Data = this.navParams.get('data');

  utilityCountDetails: any;

  searchData = { "search_value": "" };
  pendingforbillcopyupload: any;
  utilitypaymentnotinitiated: any;
  pendingformanagerverfication: any;
  pendingforbooking: any;
  pendingforfinanceconfirmation: any;
  pendingforcooceoapproval: any;
  banktransfermollak: any;
  sentfordirectorsignature: any;
  pendingforchequedispatch: any;
  transactioncompleted: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public authService: RestProvider, public toastCtrl: ToastController, private modal: ModalController,
    public loadingCtrl: LoadingController, public view: ViewController) {
    this.user = this.user ? JSON.parse(this.user) : {};
    this.resourcedetails = this.resourcedetails ? JSON.parse(this.resourcedetails) : {};
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


  ionViewDidLoad() {
    this.getUtilityCountDetails();
  }

  getUtilityCountDetails() {
    let params = {
      user_info_id: this.user.UserInfoId
    };

    this.presentLoadingDefault(true);
    this.authService.postData(params, 'utility/getUtilityLabelCount').then((result) => {

      this.utilityCountDetails = result;
      console.log(this.utilityCountDetails);
      this.pendingforbillcopyupload = this.utilityCountDetails[0].BILL_COPY_UPLOAD;
      this.utilitypaymentnotinitiated = this.utilityCountDetails[0].PAYMENT_NOT_INITIATED;
      this.pendingformanagerverfication = this.utilityCountDetails[0].MANAGER_VERIFICATION;
      this.pendingforbooking = this.utilityCountDetails[0].PENDING_FOR_BOOKING;
      this.pendingforfinanceconfirmation = this.utilityCountDetails[0].FINANCE_CONFIRMATION;
      this.pendingforcooceoapproval = this.utilityCountDetails[0].COO_CEO_APPROVAL;
      this.banktransfermollak = this.utilityCountDetails[0].BANK_TRANSFER_MOLLAK;
      this.sentfordirectorsignature = this.utilityCountDetails[0].DIRECTOR_SIGNATURE;
      this.pendingforchequedispatch = this.utilityCountDetails[0].CHEQUE_DISPATCH;
      this.transactioncompleted = this.utilityCountDetails[0].TRANSACTION_COMPLETED;
      this.presentLoadingDefault(false);

    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });
  }

  openModalByStatus(status: any) {
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let myModalData = [{
      status: status,
      labeltype: null
    }];

    let myModal: Modal = this.modal.create('UtilityDetailPage', { data: myModalData }, myModalOptions);

    myModal.present();

    myModal.onWillDismiss(() => {
      this.ionViewDidLoad();
    });

  }

  openModal(type: any) {

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    
    let myModalData = [{
      status: status,
      labeltype: type
    }];

    let myModal: Modal = this.modal.create('UtilityDetailPage', { data: myModalData }, myModalOptions);

    myModal.present();

    myModal.onWillDismiss(() => {
      this.ionViewDidLoad();
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
