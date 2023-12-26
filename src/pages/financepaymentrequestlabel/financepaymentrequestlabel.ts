import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController, Modal, ModalController, ModalOptions, ViewController } from 'ionic-angular';
import { DashboardPage } from '../dashboard/dashboard';
import { RestProvider } from '../../providers/rest/rest';
import { FinancePaymentDetailPage } from '../financepaymentrequestdetails/financepaymentrequestdetails';
import { FinancePaymentCeoApprovalPage } from '../financepaymentceoapproval/financepaymentceoapproval';
import { FinancePaymentMultipleApprovalPage } from '../financepaymentmultipleapproval/financepaymentmultipleapproval';

import * as moment from 'moment';

@Component({
  selector: 'page-financepaymentrequestlabel',
  templateUrl: 'financepaymentrequestlabel.html',
})
export class FinancePaymentRequestLabelPage {

  paymentdetailsall: any;
  searchpaymentdetails = [] as any;
  insertedValues: any;
  modalnavigationdata: any;
  payment_list_show = 'none';
  payment_list = 'block';
  searchData = { "search_value": "" };
  user: any = localStorage.getItem('userData');

  resourse: any = JSON.parse(localStorage.getItem('resourseData'));
  ResourseList: any;
  search_value: any = "";

  multipleapprovepaymentlist: any;
  draft_payment_request_count: any;
  coo_ceo_approved_count: any;
  cancellation_finance_mgr_count: any;
  cancellation_coo_ceo_count: any;
  cancelled_payment_request_count: any;
  rejected_payment_request_count: any;
  waiting_for_manager_verification_count: any;
  wait_for_finance_confirmation_count: any;
  wait_for_general_manager_approval_count: any;
  wait_for_COO_approval_count: any;
  wait_for_CEO_approval_count: any;
  cheque_preparation_count: any;
  director_signature_count: any;
  ready_for_dispatch_count: any;
  completed_count: any;
  escalation_to_coo_ceo_count: any;


  resourcedetails: any = localStorage.getItem('resourseData');

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

  paymentdetails() {
    // let params = {
    //   user_info_id: this.user.UserInfoId,
    //   resource_type_id: this.resourcedetails.TYPE_ID,
    //   resource_type_user: this.resourcedetails.TYPE_USER
    // };

    console.log(moment().format('DD-MMM-YYYY hh:mm:ss.SSSSSSSSS A'));
    this.ResourseList = this.resourse;

    let params = {
      user_info_id: this.user.UserInfoId,
      resource_type_id: this.ResourseList.TYPE_ID,
      resource_type_user: this.ResourseList.TYPE_USER,
      isteppan: this.ResourseList.ISTEPPAN,
      isfm: this.ResourseList.ISFM,
      isallPR: this.ResourseList.ISALLFP
    }

    this.presentLoadingDefault(true);
    this.authService.postData(params, 'payment/getNewFinancePaymentCount').then((result) => {
      this.searchpaymentdetails = result;
      console.log(this.searchpaymentdetails);
      this.draft_payment_request_count = this.searchpaymentdetails.DRAFT_PAYMENT_REQUEST;
      this.coo_ceo_approved_count = this.searchpaymentdetails.COO_CEO_APPROVED;
      this.cancellation_finance_mgr_count = this.searchpaymentdetails.CANCELLATION_FINANCE_MGR;
      this.cancellation_coo_ceo_count = this.searchpaymentdetails.CANCELLATION_COO_CEO;
      this.cancelled_payment_request_count = this.searchpaymentdetails.CANCEL_PAYMENT_REQUEST;
      this.rejected_payment_request_count = this.searchpaymentdetails.REJECT_PAYMENT_REQUEST;
      this.waiting_for_manager_verification_count = this.searchpaymentdetails.MANAGER_VERIFICATION;
      this.wait_for_finance_confirmation_count = this.searchpaymentdetails.FINANCE_CONFIRMATION;
      this.wait_for_general_manager_approval_count = this.searchpaymentdetails.GENERAL_MANAGER_APPROVAL;
      this.wait_for_COO_approval_count = this.searchpaymentdetails.WAITING_COO_APPROVAL;
      this.wait_for_CEO_approval_count = this.searchpaymentdetails.WAITING_CEO_APPROVAL;
      this.cheque_preparation_count = this.searchpaymentdetails.UNDER_CHEQUE_PREPARATION;
      this.director_signature_count = this.searchpaymentdetails.SENT_FOR_DIRECTOR_SIGN;
      this.ready_for_dispatch_count = this.searchpaymentdetails.READY_FOR_DIAPATCH;
      this.completed_count = this.searchpaymentdetails.COMPLETED;
      this.escalation_to_coo_ceo_count = this.searchpaymentdetails.ESCALATION_COO_CEO;

      this.presentLoadingDefault(false);
      console.log(moment().format('DD-MMM-YYYY hh:mm:ss.SSSSSSSSS A'));

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

    let flag = 'N';
    let label = '';

    if (type == "Draft Payment Request") {
      flag = 'Y';
    } else if (type == "COO-CEO Approved") {
      flag = 'Y';
    } else if (type == "Cancellation Finance-MGR") {
      flag = 'Y';
    } else if (type == "Cancellation COO-CEO") {
      flag = 'Y';
    } else if (type == "Cancelled Payment Request") {
      flag = 'Y';
    } else if (type == "Rejected Payment Request") {
      flag = 'Y';
    } else if (type == "Waiting For Manager Verification") {
      flag = 'Y';
    } else if (type == "Wait for finance confirmation") {
      flag = 'Y';
    } else if (type == "Wait for general manager approval") {
      flag = 'Y';
    } else if (type == "Wait for COO approval") {
      flag = 'Y';
      label = 'COO';
    } else if (type == "Wait for CEO approval") {
      flag = 'Y';
      label = 'CEO';
    } else if (type == "Cheque Preparation") {
      flag = 'Y';
    } else if (type == "Sent for Director Signature") {
      flag = 'Y';
    } else if (type == "Ready for dispatch") {
      flag = 'Y';
    } else if (type == "Completed") {
      flag = 'Y';
    } else if (type == "Escalation to COO-CEO") {
      flag = 'Y';
    } else {
      flag = 'N';
    }

    if (flag == 'Y') {

      if (label == 'CEO' || label == 'COO') {
        let myModalData = [{
          type: type
        }];

        let myModal: Modal = this.modal.create(FinancePaymentCeoApprovalPage, { data: myModalData }, myModalOptions);

        myModal.present();

        myModal.onDidDismiss((data) => {
        });

        myModal.onWillDismiss((data) => {
          this.ionViewDidLoad();
        });
      } else {

        let myModalData = [{
          type: type
        }];

        let myModal: Modal = this.modal.create(FinancePaymentDetailPage, { data: myModalData }, myModalOptions);

        myModal.present();

        myModal.onDidDismiss((data) => {
        });

        myModal.onWillDismiss((data) => {
          this.ionViewDidLoad();
        });
      }



    }

  }

  openMultipleApproval(type: any) {

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let myModalData = [{
      paymentrequestdata: [],
      type: type
    }];

    // let myModal: Modal = this.modal.create('FinancePaymentMultipleApprovalPage', { data: myModalData }, myModalOptions);
    let myModal: Modal = this.modal.create(FinancePaymentMultipleApprovalPage, { data: myModalData }, myModalOptions);

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
    //let case_val = this.searchData.search_value;
    if (this.search_value != '') {
      this.openModel('Search', this.search_value)
    }
  }
 
  openModel(type: any, search_value: any) {
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let myModalData = [{
      type: type,
      SearchData: search_value
    }];

    let myModal: Modal = this.modal.create(FinancePaymentDetailPage, { data: myModalData }, myModalOptions);

    myModal.present();

    myModal.onDidDismiss((data) => {
      this.ionViewDidLoad();
    });

    myModal.onWillDismiss((data) => {
      this.ionViewDidLoad();
    });

  }

  multipleapprovalpaymentdetails() {
    console.log(moment().format('DD-MMM-YYYY hh:mm:ss.SSSSSSSSS A'));
    let params = {
      user_info_id: this.user.UserInfoId,
      resource_type_id: this.resourcedetails.TYPE_ID,
      resource_type_user: this.resourcedetails.TYPE_USER
    };

    this.presentLoadingDefault(true);
    this.authService.postData(params, 'payment/getFinancePaymentRequestMultipleApproval').then((result) => {
      this.presentLoadingDefault(false);
      this.multipleapprovepaymentlist = result;
      if (this.multipleapprovepaymentlist.length > 0) {
        this.multipleapprovepaymentlist = this.multipleapprovepaymentlist.filter(item => item.CREATEDBY != 2)
      }
      console.log(this.multipleapprovepaymentlist);
      console.log(moment().format('DD-MMM-YYYY hh:mm:ss.SSSSSSSSS A'));
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
