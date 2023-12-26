import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, Modal, ModalController, ModalOptions, ViewController } from 'ionic-angular';
import { DashboardPage } from '../dashboard/dashboard';
import { RestProvider } from '../../providers/rest/rest';
import Swal from 'sweetalert2'


@IonicPage()
@Component({
  selector: 'page-paymentmultipleapproval',
  templateUrl: 'paymentmultipleapproval.html',
})
export class PaymentMultipleApprovalPage {
  searchpaymentdetails: any;
  insertedValues: any;
  resourcedetails: any = localStorage.getItem('resourseData');
  old_status: any;
  new_status: any;
  PAYMENT_REQ_ID: any;
  paymentbilldetailsall: any;
  comment_modal = 'none';
  multiple_approval_comment_modal = 'none';
  Bill_comment_modal = 'none';
  new_bill_status: any;
  PAYMENT_REQUEST_BILL_ID: any;
  COMMENTS: any
  CASE_REQUEST_Item: any;
  CASE_REQUEST: any;
  btnTxtApprove: any = "Approve";
  btnTxtReject: any = "Reject";
  btnTxtSave: any = "Save";
  payment_approvetxt = '';
  user: any = localStorage.getItem('userData');
  Data = this.navParams.get('data');

  payment_request_id_arr = [];

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

    const Data = this.navParams.get('data');
    this.CASE_REQUEST_Item = Data[0].CASE_REQUEST;
    this.CASE_REQUEST = Data[0].CASE_REQUEST;

    let params = {
      CASE_REQUEST_ID: Data[0].CASE_REQUEST_ID,
      GET_TYPE: 'request_trans_id',
      PAY_REQ_STATUS: null
    };

    if (params.CASE_REQUEST_ID == 0) {
      params.PAY_REQ_STATUS = Data[0].PAY_REQ_STATUS,
        params.GET_TYPE = 'payment_request_status'
    }

    this.presentLoadingDefault(true);
    this.authService.postData(params, 'payment/PaymentList/Search').then((result) => {
      this.presentLoadingDefault(false);
      this.searchpaymentdetails = result;
      console.log(this.searchpaymentdetails);


    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });
  }

  multipleapprovalpaymentdetails() {
    
    this.payment_request_id_arr = [];

    let params = {
      CASE_REQUEST_ID: 0,
      GET_TYPE: 'request_trans_id',
      PAY_REQ_STATUS: null
    };

    this.presentLoadingDefault(true);
    this.authService.postData(params, 'payment/getpaymentmultipleapproval').then((result) => {
      this.presentLoadingDefault(false);
      this.searchpaymentdetails = result;
      // if (this.searchpaymentdetails.length > 0) {
      //   this.searchpaymentdetails = this.searchpaymentdetails.filter(item => item.CREATEDBY != 2)
      // }
      console.log(this.searchpaymentdetails);

    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });
  }

  ionViewDidLoad() {
    this.multipleapprovalpaymentdetails();
    this.getbill();
  }

  openModal(PAYMENT_REQUEST_ID: any, type: any, PAYMENT_REQ_BILL_ID: any, PAYMENT_DETAIL: any) {
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };
    let myModalData = [{
      PAYMENT_REQUEST_ID: PAYMENT_REQUEST_ID,
      type: type,
      PAYMENT_REQ_BILL_ID: PAYMENT_REQ_BILL_ID,
      PAYMENT_DETAIL: PAYMENT_DETAIL
    }];
    let myModal: Modal = this.modal.create('PaymentModalPage', { data: myModalData }, myModalOptions);

    myModal.present();


    myModal.onWillDismiss(() => {
      this.ionViewDidLoad();
    });

  }

  getresource() {
    this.authService.getData({}, 'cheque/ResourceList/' + this.user.UserEmployeeId).then((result) => {
      this.resourcedetails = result;
      if (this.resourcedetails.length > 0) {
        console.log("Data Found In Resource Master");
      } else {
        console.log("Data Not Found In Resource Master");
      }
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });
  }

  closeModal() {
    this.view.dismiss();
  }

  showBtn = -1;
  isOpen = false;
  oldBtn = -1;

  showUndoBtn(index) {
    if (this.isOpen == false) {
      this.isOpen = true;
      this.oldBtn = index;
      this.showBtn = index;
    } else {
      if (this.oldBtn == index) {
        this.isOpen = false;
        this.showBtn = -1;
        this.oldBtn = -1;
      } else {
        this.showBtn = index;
        this.oldBtn = index;
      }
    }
  }

  opencommentmodal(status: any, PAYMENT_REQUEST_ID: any) {

    const Data = this.navParams.get('data');
    this.COMMENTS = '';
    this.old_status = status;
    this.PAYMENT_REQ_ID = PAYMENT_REQUEST_ID;

    if (status == 6) {
      this.new_status = 8;
      if (Data[0].CASE_REQUEST_ID == 0) {
        this.CASE_REQUEST_Item = this.CASE_REQUEST.filter(x => x.PAYMENT_REQUEST_ID == PAYMENT_REQUEST_ID);
        this.CASE_REQUEST_Item = this.CASE_REQUEST_Item[0];
      }

      if (this.CASE_REQUEST_Item.COURT_ID == 1) {
        this.new_status = 7;
      }
    } else if (status == 8) {
      this.new_status = 7;
    } else if (status == 7) {
      this.new_status = 2;
    } else if (status == 2) {
      this.new_status = 5;
    } else if (status == 5) {
      this.new_status = 3;
    } else if (status == 3) {
      this.new_status = 4;
    }
    this.comment_modal = 'block';
  }

  updatebillstatus(PAYMENT_REQ_BILL_ID: any, STATUS: any) {
    this.PAYMENT_REQUEST_BILL_ID = PAYMENT_REQ_BILL_ID;
    if (STATUS == 2) {
      this.new_bill_status = 3;
    } else if (STATUS == 3) {
      this.new_bill_status = 4;
    }
    this.Bill_comment_modal = 'block';
  }

  onCloseBill_comment_modal() {
    this.Bill_comment_modal = 'none';
  }

  onClosecomment_modal() {
    this.comment_modal = 'none';
    this.multiple_approval_comment_modal = 'none';
  }

  updatebillpaymentstatus(BILL_COMMENTS: any, ORACLE_INVOICE_NUMBER: any) {
    let updatebilldata = [{
      old_data: this.paymentbilldetailsall.filter(item => item.PAYMENT_REQ_BILL_ID === this.PAYMENT_REQUEST_BILL_ID),
      created_by: this.user.UserInfoId,
      BILL_COMMENTS: BILL_COMMENTS,
      BILL_STATUS: this.new_bill_status,
      ORACLE_INVOICE_NUMBER: ORACLE_INVOICE_NUMBER
    }];

    BILL_COMMENTS = BILL_COMMENTS.trim();
    if (BILL_COMMENTS != '') {
      this.presentLoadingDefault(true);
      this.btnTxtSave = "In Progress...";
      this.authService.postData(updatebilldata[0], 'payment/UpdatePaymentBill').then((result) => {
        this.presentLoadingDefault(false);
        this.btnTxtSave = "Save";
        this.presentToast("Payment Request Created successfully");
        this.insertedValues = result;
        this.onCloseBill_comment_modal();
      }, (err) => {
        this.btnTxtSave = "Save";
        this.presentLoadingDefault(false);
        this.presentToast(err);
      });
    } else {
      this.presentToast("Comments cannot be blank...");
    }

  }

  updatepaymentstatus(COMMENTS: any, PaymentStatus: any) {

    //const Data = this.navParams.get('data');

    let Type_List = ['CEO', 'COO', 'Legal-MGR', 'Leasing-MGR'];

    if (PaymentStatus == 'Reject' && (Type_List.indexOf(this.resourcedetails.TYPE_USER) > -1)) {
      this.new_status = 1;
    }


    let updatedata = [{
      old_data: this.searchpaymentdetails.filter(item => item.PAYMENT_REQUEST_ID === this.PAYMENT_REQ_ID),
      COMMENTS: COMMENTS,
      COURT_ID: 0, //this.CASE_REQUEST_Item.COURT_ID,
      status: this.new_status,
      modified_by: this.user.UserInfoId,
      USERNAME: this.user.Surname,
      resourceType: this.resourcedetails.TYPE_USER
    }];

    COMMENTS = COMMENTS.trim();
    if (COMMENTS != '') {
      console.log(updatedata[0]);
      this.btnTxtApprove = "In Progress...";
      this.btnTxtReject = "In Progress...";
      this.presentLoadingDefault(true);
      this.authService.postData(updatedata[0], 'payment/UpdatePaymentRequest').then((result) => {
        this.presentLoadingDefault(false);
        this.btnTxtApprove = "Approve";
        this.btnTxtReject = "Reject";
        this.insertedValues = result;
        //this.paymentdetails();
        this.multipleapprovalpaymentdetails();
        this.presentToast("Payment Request status updated successfully");
        this.onClosecomment_modal();
      }, (err) => {
        this.btnTxtApprove = "Approve";
        this.btnTxtReject = "Reject";
        this.presentLoadingDefault(false);
        this.presentToast(err);
      });
    } else {
      this.presentToast("Comments cannot be blank...");
    }
  }

  createPaymentBill(PAYMENT_REQUEST_ID: any, AMOUNT: any) {
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };
    let paymentbillfilterall = this.paymentbilldetailsall.filter(item => item.PAYMENT_REQUEST_ID === PAYMENT_REQUEST_ID);
    let initialValue = 0;
    let amount_val = paymentbillfilterall.reduce(function (total, currentValue) {
      return total + currentValue.AMOUNT;
    }, initialValue);

    if (amount_val > AMOUNT) {
      Swal.fire('Oops...', 'You Already Created the bills with excess of Amount');
    } else {
      let myModalData = [{
        PAYMENT_REQUEST_ID: this.searchpaymentdetails.filter(item => item.PAYMENT_REQUEST_ID === PAYMENT_REQUEST_ID),
      }];

      let myModal: Modal = this.modal.create('PaymentRequestBillPage', { data: myModalData }, myModalOptions);

      myModal.present();


      myModal.onWillDismiss(() => {
        this.ionViewDidLoad();
      });
    }
  }

  getbill() {
    this.presentLoadingDefault(true);
    this.authService.getData({}, 'payment/AllPaymentRequestBill/').then((result) => {
      this.paymentbilldetailsall = result;
      this.presentLoadingDefault(false);
      if (this.paymentbilldetailsall.length > 0) {
        //console.log(this.paymentbilldetailsall);
        //this.presentToast(`Data found in ${myTitle}`);
      } else {
        this.presentLoadingDefault(false);
        this.presentToast(`No data found.`);
      }
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });
  }

  showBtnbill = -1;
  isOpenbill = false;
  oldBtnbill = -1;
  showUndoBtnbill(index) {
    if (this.isOpenbill == false) {
      this.isOpenbill = true;
      this.oldBtnbill = index;
      this.showBtnbill = index;
    } else {
      if (this.oldBtnbill == index) {
        this.isOpenbill = false;
        this.showBtnbill = -1;
        this.oldBtnbill = -1;
      } else {
        this.showBtnbill = index;
        this.oldBtnbill = index;
      }
    }
  }

  openAttachment(PAYMENT_REQ_BILL_ID: any, PAYMENT_REQUEST_ID: any) {
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let myModalData = [{
      PAYMENT_REQUEST_ID: PAYMENT_REQUEST_ID,
      PAYMENT_REQ_BILL_ID: PAYMENT_REQ_BILL_ID
    }];

    let myModal: Modal = this.modal.create('PaymentAttachmentPage', { data: myModalData }, myModalOptions);

    myModal.present();


    myModal.onWillDismiss(() => {
      this.ionViewDidLoad();
    });
  }

  CheckboxClicked(status: any, payment_request_id: any, event: any) {

    console.log(status);
    console.log(payment_request_id);
    console.log(event.checked);

    if (event.checked) {
      this.payment_request_id_arr.push(payment_request_id);
    } else {
      var index = this.payment_request_id_arr.findIndex(item => item == payment_request_id);
      if (index > -1) {
        this.payment_request_id_arr.splice(index, 1);
      }
    }

    console.log(this.payment_request_id_arr);
  }

  multiplePaymentRejectbtn(status: any) {

    //const Data = this.navParams.get('data');

    this.COMMENTS = '';
    this.old_status = 7;

    if (status == 7) {
      this.new_status = 2;
    }

    if (this.payment_request_id_arr.length > 0) {
      this.multiple_approval_comment_modal = 'block';
    } else {
      this.presentToast('Please select LPO.');
      return;
    }

  }

  multiplePaymentApprovebtn(status: any) {

    //const Data = this.navParams.get('data');

    this.COMMENTS = '';
    this.old_status = 7;

    if (status == 7) {
      this.new_status = 2;
    }

    if (this.payment_request_id_arr.length > 0) {
      this.multiple_approval_comment_modal = 'block';
    } else {
      this.presentToast('Please select Payment Request.');
      return;
    }
  }


  opencasecomments(CASE_REQUEST_ID: any, PAYMENT_REQUEST_ID: any, PAYMENT_REQ_BILL_ID: any, PAYMENT_NUMBER: any, CASE_ID: any, type: any, PAYMENT_DETAIL: any) {


    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let myModalData = [{
      CASE_REQ_ID: CASE_REQUEST_ID,
      CASE_ID: CASE_ID,
      PAYMENT_REQUEST_ID: PAYMENT_REQUEST_ID,
      PAYMENT_REQ_BILL_ID: PAYMENT_REQ_BILL_ID,
      PAYMENT_NUMBER: PAYMENT_NUMBER,
      TYPE: type,
      PAYMENT_DETAIL: PAYMENT_DETAIL
    }];

    let myModal: Modal = this.modal.create('PaymentCaseCommentsModalPage', { data: myModalData }, myModalOptions);

    myModal.present();

    myModal.onDidDismiss((data) => {
    });

    myModal.onWillDismiss((data) => {
    });

  }

  // Multiple Approve 

  updatemultiplepaymentstatus(COMMENTS: any, PaymentStatus: any) {


    let Type_List = ['CEO', 'COO', 'Legal-MGR', 'Leasing-MGR'];

    if (PaymentStatus == 'Reject' && (Type_List.indexOf(this.resourcedetails.TYPE_USER) > -1)) {
      this.new_status = 1;
    }

    if (this.payment_request_id_arr.length > 0) {

      let length = 1;
      this.btnTxtApprove = "In Progress...";
      this.btnTxtReject = "In Progress...";
      this.presentLoadingDefault(true);

      COMMENTS = COMMENTS.trim();

      if (COMMENTS != '') {

        for (let i = 0; i < this.payment_request_id_arr.length; i++) {

          let updatedata = [{
            old_data: this.searchpaymentdetails.filter(item => item.PAYMENT_REQUEST_ID === this.payment_request_id_arr[i]),
            COMMENTS: COMMENTS,
            COURT_ID: 0,
            status: this.new_status,
            modified_by: this.user.UserInfoId,
            USERNAME: this.user.Surname,
            resourceType: this.resourcedetails.TYPE_USER
          }];

          console.log(updatedata[0]);

          this.authService.postData(updatedata[0], 'payment/UpdatePaymentRequest').then((result) => {

            if (this.payment_request_id_arr.length == length) {
              this.presentLoadingDefault(false);
              this.btnTxtApprove = "Approve";
              this.btnTxtReject = "Reject";
              this.insertedValues = result;
              this.payment_request_id_arr = [];
              this.multipleapprovalpaymentdetails();
              this.presentToast("Payment Request status updated successfully");
              this.onClosecomment_modal();
            }
            length++;

          }, (err) => {
            this.btnTxtApprove = "Approve";
            this.btnTxtReject = "Reject";
            this.presentLoadingDefault(false);
            this.presentToast(err);
          });

        }

      } else {
        this.btnTxtApprove = "Approve";
        this.btnTxtReject = "Reject";
        this.presentLoadingDefault(false);
        this.presentToast("Comments cannot be blank...");
        return;
      }

    } else {
      this.presentToast("Please select payment request.");
      return;
    }

  }


  openpaymentCaseAttachment(PAYMENT_REQ_BILL_ID: any, PAYMENT_REQUEST_ID: any, CASE_REQUEST_ID: any) {
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let myModalData = [{
      PAYMENT_REQUEST_ID: PAYMENT_REQUEST_ID,
      PAYMENT_REQ_BILL_ID: PAYMENT_REQ_BILL_ID,
      CASE_REQUEST_ID: CASE_REQUEST_ID
    }];

    let myModal: Modal = this.modal.create('PaymentCaseAttachmentModalPage', { data: myModalData }, myModalOptions);

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
    } else {
      loading.dismissAll();
      loading = null
    }
  }

}
