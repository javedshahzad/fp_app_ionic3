import { Component } from '@angular/core';
import { IonicPage, Platform, NavController, NavParams, ToastController, Modal, ModalController, ModalOptions,  LoadingController, ViewController, AlertController } from 'ionic-angular';
import { FormGroup, FormBuilder } from '@angular/forms';
import { RestProvider } from '../../providers/rest/rest';
import { CallNumber } from '@ionic-native/call-number';


@IonicPage()
@Component({
  selector: 'page-financepaymentstatusupdate',
  templateUrl: 'financepaymentstatusupdate.html',
})
export class FinancePaymentStatusUpdatePage {
 
  paymentcommentsdetails: any;
  pushnotificationValues: any;
  paymentcommentsForm: FormGroup
  insertedValues: any;
  payment_req_data = this.navParams.get('data');
  user: any = localStorage.getItem('userData');
  PAYMENT_DETAIL: any;
  COMMENT_TYPE: any;
  userlist: any;


  resourcedetails: any = localStorage.getItem('resourseData');
  btnTxtApprove: any = "Approve";
  btnTxtReject: any = "Reject";
  btnTxtSave: any = "Save";
  btnTxtYes: any = 'Approve';
  btnTxtApproveandForward: any = 'Approve & Forward';
  btnTxtCheck: any = 'Check';

  lnkceoapp = 0;
  lnkmanagement = 0;
  lbkConf = 0;
  lnkrevertcheck = 1;
  showDetailsBox = 0;

  showIsHardCopyCheckBox = 0;
  isChecked: boolean = false;

  PAYMENT_REQUEST_ID: any = this.payment_req_data[0].PAYMENT_REQUEST_ID;
  PAYMENT_DETAILS: any;
  PAYMENT_COMMENTS: any;

  paymentattachmentlist: any;
  paymentattachmentDelete: any;
  lpoManagerList: any;

  mlist: any;

  constructor(public platform: Platform, public navCtrl: NavController, public navParams: NavParams,
    public authService: RestProvider, public toastCtrl: ToastController, private callNumber: CallNumber,
    public loadingCtrl: LoadingController, public view: ViewController, public alertCtrl: AlertController,
    private modal: ModalController
  ) {
    this.user = this.user ? JSON.parse(this.user) : {};
    this.resourcedetails = this.resourcedetails ? JSON.parse(this.resourcedetails) : {};

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

  ionViewWillLoad() {
    const Data = this.navParams.get('data');

    this.getLpoManagerList();

    this.PAYMENT_DETAIL = Data[0].PAYMENT_DETAIL;
    this.PAYMENT_REQUEST_ID = this.PAYMENT_DETAIL.FINANCE_PAY_REQ_ID
    console.log(this.PAYMENT_DETAIL);

    if (this.PAYMENT_DETAIL.STATUS_ID == 1 && (this.resourcedetails.TYPE_ID == 13 || this.resourcedetails.TYPE_ID == 9)) {
      this.showIsHardCopyCheckBox = 1;
      this.showDetailsBox = 0;
      this.isChecked = false;
    } else {
      this.showIsHardCopyCheckBox = 0;
      this.showDetailsBox = 0;
      this.isChecked = false;
    }

    if (this.PAYMENT_DETAIL.STATUS_ID == 4) {
      this.btnTxtYes = 'Confirm & Print';
    }

    if (this.PAYMENT_DETAIL.STATUS_ID == 3 && this.resourcedetails.TYPE_ID == 22) {
      this.lnkceoapp = 1;
    } else {
      this.lnkceoapp = 0;
    }

    if (this.PAYMENT_DETAIL.STATUS_ID == 3 && this.PAYMENT_DETAIL.APPROVAL_1 == 0) {
      this.lnkceoapp = 0;
      this.lnkmanagement = 1;
      this.lbkConf = 0;
    } else {
      this.lnkmanagement = 0;
      this.lbkConf = 1;
    }

    if (this.PAYMENT_DETAIL.STATUS_ID > 3) {
      this.lnkrevertcheck = 0;
    }


    this.presentLoadingDefault(true);
    this.authService.postData(Data[0], 'payment/getFinancePaymentComments').then((result) => {
      this.paymentcommentsdetails = result;
      this.Getpaymentattachment();
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });

  }

  checkHardCopyReceived(event) {
    //alert(event.checked);

    if (event.checked) {
      this.showDetailsBox = 1;
      this.isChecked = true;
    } else {
      this.showDetailsBox = 0;
      this.isChecked = false;
    }
  }

  resetForm() {
    this.navCtrl.setRoot(this.navCtrl.getActive().component);
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

  Getpaymentattachment() {

    const Data = this.navParams.get('data');

    this.authService.postData(Data[0], 'payment/getFinancePaymentAttachment').then((result) => {
      this.paymentattachmentlist = result;
      this.presentLoadingDefault(false);
      console.log(this.paymentattachmentlist);
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });
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

  callmobileNumber(mobileno: any) {
    console.log('Call Number', mobileno);
    this.callNumber.callNumber(mobileno, true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.log('Error launching dialer', err));
  }

  rejectpayment(PAYMENT_REQUEST_ID: any) {

    if (this.PAYMENT_COMMENTS != null && this.PAYMENT_COMMENTS != "") {

      const confirm = this.alertCtrl.create({
        title: '',
        message: 'Are you sure, You want to revert the FinancePayReq : ' + PAYMENT_REQUEST_ID,
        buttons: [
          {
            text: 'Cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Yes',
            handler: () => {
              console.log('Agree to reject');
              this.rejectPaymentStatusUpdate();
              console.log('Rejected Successfully...');
            }
          }
        ]
      });
      confirm.present();
    } else {
      this.presentToast('Please enter description');
      return;
    }

  }

  rejectPaymentStatusUpdate() {
    let FilesList = [];
    FilesList = this.paymentattachmentlist.filter(x => x.REF_CODE == 'Booking Sheet');

    if (FilesList.length > 0) {
      this.GetpaymentattachmentDelete(FilesList[0].COMMON_ATTACHMENT_ID);
    }
    this.updatepaymentstatus('Reject');

  }

  ApprovePaymentStatusUpdate() {
    if (this.PAYMENT_COMMENTS != null && this.PAYMENT_COMMENTS != "") {
      this.updatepaymentstatus('Approve');
    } else {
      this.presentToast('Please enter description');
      return;
    }
  }

  ApproveAndForwardPaymentStatusUpdate() {
    if (this.PAYMENT_COMMENTS != null && this.PAYMENT_COMMENTS != "") {
      this.updatepaymentstatus('Approve and Forward');
    } else {
      this.presentToast('Please enter description');
      return;
    }
  }

  GetpaymentattachmentDelete(ATTACHMENT_ID: any) {


    let params = {
      attachment_id: ATTACHMENT_ID,
      modified_by: this.user.UserInfoId
    }

    this.presentLoadingDefault(true);
    this.authService.postData(params, 'payment/getDeleteFinancePaymentAttachment').then((result) => {
      this.paymentattachmentDelete = result;
      this.presentLoadingDefault(false);
      console.log(this.paymentattachmentDelete);

    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });
  }


  updatepaymentstatus(TYPE: any) {

    console.log(this.PAYMENT_DETAIL);
    let msg = '';

    let code = this.encriptrandom(this.PAYMENT_DETAIL.FINANCE_PAY_REQ_ID, 5);
    let mid = Math.trunc(parseInt(this.PAYMENT_DETAIL.FINANCE_PAY_REQ_ID) / 2);
    code = code.substring(0, code.length / 2) + mid + code.substring(code.length / 2);

    console.log('Code -->', code);

    if (TYPE == 'Reject') {

      this.insertPaymentComments('FinancePayReq COMMENT', this.PAYMENT_COMMENTS);
      this.insertPaymentComments('FinancePayReq STATUS', 'FinancePayReq Rejected');
      this.PAYMENT_DETAIL.IS_APPROVED = 0;
      this.PAYMENT_DETAIL.STATUS_ID = 0;
      this.getupdateFinancepaymentstatus();
    }
    else if (TYPE == 'Approve') {
      this.insertPaymentComments('FinancePayReq COMMENT', this.PAYMENT_COMMENTS);

      if (this.PAYMENT_DETAIL.IS_APPROVED == 1) {

        if (this.PAYMENT_DETAIL.IS_CEO_REVERTED == 1 && this.PAYMENT_DETAIL.IS_REVERT_TO_APPROVED == 0) {

          msg = this.PAYMENT_DETAIL.REVERT_TO_NAME + " Approved"
          this.insertPaymentComments('FinancePayReq STATUS', msg);
          this.PAYMENT_DETAIL.STATUS_ID = parseInt(this.PAYMENT_DETAIL.STATUS_ID) - 1;
          this.PAYMENT_DETAIL.IS_REVERT_TO_APPROVED = 1;

        } else if (this.PAYMENT_DETAIL.STATUS_ID == 0) {

          msg = 'FinancePayReq Approved';
          if (this.resourcedetails.TYPE_ID == 8) {
            msg = 'COO/CEO Approved';
          }
          this.insertPaymentComments('FinancePayReq STATUS', msg);

        } else if (this.PAYMENT_DETAIL.STATUS_ID == 1) {

          if (this.resourcedetails.TYPE_ID == 13 || this.resourcedetails.TYPE_ID == 9) {

            if (this.isChecked) {

              if (this.PAYMENT_DETAILS == "" || this.PAYMENT_DETAILS == null) {
                this.presentToast('Enter Hard copy details to proceed..');
              }

              this.PAYMENT_DETAIL.IS_HARD_COPY_RCVD = 1;
              this.PAYMENT_DETAIL.FINANCE_REMARKS = this.PAYMENT_DETAILS;
              this.PAYMENT_DETAIL.HC_RCVD_BY = this.user.UserInfoId;

            }
          }

          this.mlist = this.lpoManagerList.filter(x => x.MASTER_ID == this.PAYMENT_DETAIL.MANAGER_MASTER_ID && x.ORDER_NO == parseInt(this.PAYMENT_DETAIL.NO_MANAGER_APPROVED) + 1);

          if (this.mlist.length > 0) {
            this.mlist = this.mlist[0];
          }
          this.PAYMENT_DETAIL.NO_MANAGER_APPROVED = parseInt(this.PAYMENT_DETAIL.NO_MANAGER_APPROVED) + 1;

          if (this.PAYMENT_DETAIL.NO_MANAGER_APPROVED != this.PAYMENT_DETAIL.NUMBER_OF_APPROVALS) {

            this.PAYMENT_DETAIL.STATUS_ID = parseInt(this.PAYMENT_DETAIL.STATUS_ID) - 1;

          } else {
            this.PAYMENT_DETAIL.STATUS_ID = parseInt(this.PAYMENT_DETAIL.STATUS_ID) + 1;

            if (this.PAYMENT_DETAIL.HR_PR > 0) {
              this.PAYMENT_DETAIL.APPROVAL_1 = 1
            }
          }

          msg = this.mlist.MANAAGER + " Verified";
          if (this.resourcedetails.TYPE_ID == 8) {
            msg = 'CEO Approved';
          }
          this.insertPaymentComments('FinancePayReq STATUS', msg);

        } else if (this.PAYMENT_DETAIL.STATUS_ID == 2) {

          msg = "FINANCE Confirmed";
          this.insertPaymentComments('FinancePayReq STATUS', msg);

        } else if (this.PAYMENT_DETAIL.STATUS_ID == 3) {

          msg = "COO Approved";

          if (this.resourcedetails.TYPE_ID == 8) {
            msg = 'CEO Approved';
          } else {

            let code = this.encriptrandom(this.PAYMENT_DETAIL.FINANCE_PAY_REQ_ID, 5);
            let mid = Math.trunc(parseInt(this.PAYMENT_DETAIL.FINANCE_PAY_REQ_ID) / 2);
            code = code.substring(0, code.length / 2) + mid + code.substring(code.length / 2);
            this.PAYMENT_DETAIL.APPROVAL_CODE = code;
          }
          this.insertPaymentComments('FinancePayReq STATUS', msg);

        } else if (this.PAYMENT_DETAIL.STATUS_ID == 4) {

          msg = "Cheque Prepared";

          if (this.PAYMENT_DETAIL.MODE_OF_PAYMENT == 5) {
            msg = "MOLLAK";
          }
          else if (this.PAYMENT_DETAIL.MODE_OF_PAYMENT == 1) {
            msg = "BANK TRANSFER";
          }
          this.insertPaymentComments('FinancePayReq STATUS', msg);

        } else if (this.PAYMENT_DETAIL.STATUS_ID == 5) {

          msg = "Director signatured";

          if (this.PAYMENT_DETAIL.MODE_OF_PAYMENT == 5) {
            this.PAYMENT_DETAIL.STATUS_ID = 6;
            msg = "TRANSFER APPROVAL & Completed";
          }
          else if (this.PAYMENT_DETAIL.MODE_OF_PAYMENT == 1) {
            this.PAYMENT_DETAIL.STATUS_ID = 6;
            msg = "BANK ADVICE & Completed";
          }
          this.insertPaymentComments('FinancePayReq STATUS', msg);

        } else if (this.PAYMENT_DETAIL.STATUS_ID == 6) {

          msg = "Dispatched & Completed";
          this.insertPaymentComments('FinancePayReq STATUS', msg);

        }

        if (this.resourcedetails.TYPE_ID == 8 && this.PAYMENT_DETAIL.STATUS_ID < 4) {

          this.PAYMENT_DETAIL.STATUS_ID = 4;
          let code = this.encriptrandom(this.PAYMENT_DETAIL.FINANCE_PAY_REQ_ID, 5);
          let mid = Math.trunc(parseInt(this.PAYMENT_DETAIL.FINANCE_PAY_REQ_ID) / 2);
          code = code.substring(0, code.length / 2) + mid + code.substring(code.length / 2);
          this.PAYMENT_DETAIL.APPROVAL_CODE = code;

        } else {
          this.PAYMENT_DETAIL.STATUS_ID = parseInt(this.PAYMENT_DETAIL.STATUS_ID) + 1;
        }


      } else {

        msg = "Finance Payment Request Canceled";
        this.insertPaymentComments('FinancePayReq STATUS', msg);
        this.PAYMENT_DETAIL.STATUS_ID = 0;
      }

      this.getupdateFinancepaymentstatus();

    } else if (TYPE == 'Approve and Forward') {

      this.insertPaymentComments('FinancePayReq COMMENT', this.PAYMENT_COMMENTS);
      this.insertPaymentComments('FinancePayReq STATUS', 'COO Approved');
      this.PAYMENT_DETAIL.CEO_APP_REQ = 1;
      this.getupdateFinancepaymentstatus();

    }

  }

  getLpoManagerList() {
    let params = {
      user_info_id: this.user.UserInfoId
    };

    this.presentLoadingDefault(true);
    this.authService.postData(params, 'payment/getLpoManagerList').then((result) => {
      this.presentLoadingDefault(false);
      this.lpoManagerList = result;
      console.log(this.lpoManagerList);

    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });
  }

  getupdateFinancepaymentstatus() {

    let updatedata = [{
      old_data: JSON.stringify(this.PAYMENT_DETAIL),
      COMMENTS: this.PAYMENT_COMMENTS,
      PAYMENT_DETAILS: this.PAYMENT_DETAILS,
      modified_by: this.user.UserInfoId,
      resourceType: this.resourcedetails.TYPE_USER
    }];

    let COMMENTS = this.PAYMENT_COMMENTS.trim();

    if (COMMENTS != '') {
      console.log(updatedata[0]);
      this.presentLoadingDefault(true);
      this.authService.postData(updatedata[0], 'payment/getUpdateFinancePaymentRequestStatus').then((result) => {
        this.insertedValues = result;
        this.presentLoadingDefault(false);
        this.closeModal();
      }, (err) => {
        this.presentLoadingDefault(false);
        this.presentToast(err);
      });
    } else {
      this.presentToast("Comments cannot be blank...");
    }
  }

  insertPaymentComments(type: any, COMMENTS: any) {

    let paymentcommentsData = [{
      PAYMENT_REQUEST_ID: this.PAYMENT_REQUEST_ID,
      modified_by: this.user.UserInfoId,
      ReferenceType: type,
      COMMENTS: COMMENTS
    }];

    let _valid = true;

    if (_valid) {
      this.authService.postData(paymentcommentsData[0], 'payment/getInsertFinancepaymentcommentsinsert').then((result) => {
        this.insertedValues = result;
      }, (err) => {
        this.presentLoadingDefault(false);
        this.presentToast(err);
      });
    }
  }

  encriptrandom(Value: any, Digits: any) {

    let val = (Value + Digits) * Digits;
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    if (Digits == 0) return "";

    let rno = characters.charAt(Value % (characters.length))
    return this.encriptrandom((Value + characters.length + Digits) / (characters.length), Digits - 1) + (rno);
  }

  uploadAudioForApprove() {

    let PAYMENT_REQUEST_ID = this.PAYMENT_REQUEST_ID;

    let resourseData: any = localStorage.getItem('resourseData');

    let paymentcommentsData = { 
        PAYMENT_REQUEST_ID: PAYMENT_REQUEST_ID,
        modified_by: this.user.UserInfoId,
        ReferenceType: 'FinancePayReq COMMENT',
        ResourseData: resourseData,
        COMMENTS: 'Finance Payment Request Approve Recording'
    }

    console.log(paymentcommentsData);

    this.presentLoadingDefault(true);
    this.authService.postData(paymentcommentsData, 'payment/getInsertFinancePaymentCommentsWhileAudioRecording').then((result) => {      
      this.insertedValues = result;
      console.log(result);
      this.presentLoadingDefault(false);

      const myModalOptions: ModalOptions = {
        enableBackdropDismiss: false
      };
  
      let myModalData = [{
        user_info_id: this.user.UserInfoId,
        comments_id: PAYMENT_REQUEST_ID,
        comments_child_id: result,
        module_type: 'FINANCE PAYMENT',
        comment_created_by: this.user.UserInfoId
      }]
    
      let modelpage = '';
      modelpage = 'AudioCommentsPage';
  
      let myModal: Modal = this.modal.create(modelpage, { data: myModalData }, myModalOptions);
  
      myModal.present();
      myModal.onDidDismiss((data) => {
          this.ionViewWillLoad();
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