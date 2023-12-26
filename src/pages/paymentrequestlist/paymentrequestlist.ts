import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController, Modal, ModalController, ModalOptions, ViewController } from 'ionic-angular';
import { DashboardPage } from '../dashboard/dashboard';
import { RestProvider } from '../../providers/rest/rest';
 
@Component({
  selector: 'page-paymentrequestlist',
  templateUrl: 'paymentrequestlist.html',
}) 
export class PaymentRequestListPage {
  
  paymentdetailsall: any;
  searchpaymentdetails = [] as any;
  insertedValues: any;
  modalnavigationdata: any;
  payment_list_show = 'none';
  payment_list = 'block';
  searchData = { "search_value": "" };
  user: any = localStorage.getItem('userData');
  multipleapprovepaymentlist: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public authService: RestProvider, public toastCtrl: ToastController, private modal: ModalController,
    public loadingCtrl: LoadingController, public view: ViewController
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

  closeModal() {
    this.view.dismiss();
  }

  paymentdetails() {
    this.presentLoadingDefault(true);
    this.authService.getData({}, 'payment/PaymentList').then((result) => {
      this.searchpaymentdetails = result;
      this.presentLoadingDefault(false);
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });
  }

  ionViewDidLoad() {
    this.paymentdetails();
    this.multipleapprovalpaymentdetails();
  }

  openModal(CASE_REQUEST_ID: any) {

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let myModalData = [{
      CASE_REQUEST_ID: CASE_REQUEST_ID
    }];

    let myModal: Modal = this.modal.create('PaymentRequestCreatePage', { data: myModalData }, myModalOptions);

    myModal.present();

    myModal.onDidDismiss((data) => {
    });

    myModal.onWillDismiss((data) => {
    });

  }

  openDetailModal(type: any) {

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    if (type == "Pendnig MGR Approval") {
      this.modalnavigationdata = this.searchpaymentdetails.pendingmgrdata;
    } else if (type == "Pendnig Leasing MGR Approval") {
      this.modalnavigationdata = this.searchpaymentdetails.pendingleasmgrdata;
    } else if (type == "Pending CEO Approval") {
      this.modalnavigationdata = this.searchpaymentdetails.pendingceodata;
    } else if (type == "Panding For Finance") {
      this.modalnavigationdata = this.searchpaymentdetails.pendingfinancedata;
    } else if (type == "Waiting For Legal To Acknowledge") {
      this.modalnavigationdata = this.searchpaymentdetails.paiddata;
    } else if (type == "Waiting For Bill Submission") {
      this.modalnavigationdata = this.searchpaymentdetails.billsubmissiondata;
    } else if (type == "Waiting For Finance Acknowledgement") {
      this.modalnavigationdata = this.searchpaymentdetails.waitforfinancedata;
    } else if (type == "Waiting For FInance MGR Acknowledgement") {
      this.modalnavigationdata = this.searchpaymentdetails.waitforfinancemgrdata;
    } else if (type == "All Payment Request") {
      this.modalnavigationdata = this.searchpaymentdetails.all;
    } else if (type == "Payment Request Cash more than 7 days with Legal") {
      this.modalnavigationdata = this.searchpaymentdetails.paymentRequestCash_7daysdata;
    } else if(type == 'Escalation to CEO'){
      this.modalnavigationdata = this.searchpaymentdetails.escalation_to_ceo;
    }

    let myModalData = [{
      paymentrequestdata: this.modalnavigationdata,
      type: type
    }];

    let myModal: Modal = this.modal.create('PaymentPage', { data: myModalData }, myModalOptions);

    myModal.present();

    myModal.onDidDismiss((data) => {
    });

    myModal.onWillDismiss((data) => {
      this.ionViewDidLoad();
    });

  }

  openMultipleApproval(type: any) {

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let myModalData = [{
      paymentrequestdata: [],
      type: type
    }];

    let myModal: Modal = this.modal.create('PaymentMultipleApprovalPage', { data: myModalData }, myModalOptions);

    myModal.present();

    myModal.onDidDismiss((data) => {
    });

    myModal.onWillDismiss((data) => {
      this.ionViewDidLoad();
    });

  }

  openpaymentDetailModal(CASE_REQUEST_ID: any, CASE_REQUEST: any) {
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let myModalData = [{
      CASE_REQUEST_ID: CASE_REQUEST_ID,
      CASE_REQUEST: CASE_REQUEST
    }];

    let myModal: Modal = this.modal.create('PaymentDetailPage', { data: myModalData }, myModalOptions);

    myModal.present();

    myModal.onDidDismiss((data) => {
    });

    myModal.onWillDismiss((data) => {
    });
  }

  SearchpaymentDetail() {
    let case_val = this.searchData.search_value;
    if (case_val != '') {
      this.payment_list = 'none';
      this.payment_list_show = 'block';
      this.paymentdetailsall = this.searchpaymentdetails.all.filter(item => {
        let _val = item['CLIENT_DESCRIPTION'] ? item['CLIENT_DESCRIPTION'].toString().toUpperCase() : '';
        let _val2 = item['REQUEST_TYPE_DESCRIPTION'] ? item['REQUEST_TYPE_DESCRIPTION'].toString().toUpperCase() : '';
        let _val3 = item['CASE_REQUEST_ID'] ? item['CASE_REQUEST_ID'].toString() : '';
        return (_val.includes(case_val.toUpperCase()) || _val2.includes(case_val.toUpperCase()) || _val3.includes(case_val.toUpperCase()))
      })
      //(item.CLIENT_DESCRIPTION.toUpperCase() ? item.CLIENT_DESCRIPTION.toUpperCase().includes(case_val):'') || (item.REQUEST_TYPE_DESCRIPTION.toUpperCase() ? item.REQUEST_TYPE_DESCRIPTION.toUpperCase().includes(case_val):'') || (String(item.CASE_REQUEST_ID) ? String(item.CASE_REQUEST_ID).includes(case_val):''));
    } else {
      this.payment_list_show = 'none';
      this.payment_list = 'block';
      this.paymentdetailsall = this.searchpaymentdetails.all;
    }
    console.log(this.paymentdetailsall);
  }

  multipleapprovalpaymentdetails() {

    let params = {
      CASE_REQUEST_ID: 0,
      GET_TYPE: 'request_trans_id',
      PAY_REQ_STATUS: null
    };

    this.presentLoadingDefault(true);
    this.authService.postData(params, 'payment/getpaymentmultipleapproval').then((result) => {
      this.presentLoadingDefault(false);
      this.multipleapprovepaymentlist = result;
      if (this.multipleapprovepaymentlist.length > 0) {
        this.multipleapprovepaymentlist = this.multipleapprovepaymentlist.filter(item => item.CREATEDBY != 2)
      }
      console.log(this.multipleapprovepaymentlist);

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
