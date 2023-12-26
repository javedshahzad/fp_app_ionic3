import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, Modal, ModalController, ModalOptions, ViewController } from 'ionic-angular';
import { DashboardPage } from '../dashboard/dashboard';
import { RestProvider } from '../../providers/rest/rest';
import Swal from 'sweetalert2'

import * as moment from 'moment';


@Component({
  selector: 'page-financepaymentrequestdetails',
  templateUrl: 'financepaymentrequestdetails.html',
})
export class FinancePaymentDetailPage {

  searchpaymentdetails: any;
  searchpaymentdetailsAll: any;
  financepaymentdetails: any;
  financepaymentdetailsAll: any;
  insertedValues: any;
  resourcedetails: any = localStorage.getItem('resourseData');
  old_status: any;
  new_status: any;
  PAYMENT_REQ_ID: any;
  paymentbilldetailsall: any;
  comment_modal = 'none';
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
  fin_payment_type = this.navParams.get('data');

  searchData = { "search_value": "" };
  resourse: any = JSON.parse(localStorage.getItem('resourseData'));
  ResourseList: any;
  lpoManagerList: any;
  mlist: any;
  lebel_type: any;
  ImageList: any;
  itemsToDisplay = [];

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
    let Data = this.navParams.get('data');

    if (Data != undefined) {
      this.lebel_type = Data[0].type;
    } else {
      this.lebel_type = "";
    }

    if (this.searchData.search_value == null || this.searchData.search_value == '' || this.searchData.search_value == undefined) {
      if (Data[0].SearchData != '' && Data[0].SearchData != undefined && Data[0].SearchData != null) {
        this.searchData.search_value = Data[0].SearchData;
      } else {
        this.searchData.search_value = null;
      }
    }

    this.ResourseList = this.resourse;

    let params = {
      user_info_id: this.user.UserInfoId,
      resource_type_id: this.ResourseList.TYPE_ID,
      resource_type_user: this.ResourseList.TYPE_USER,
      isteppan: this.ResourseList.ISTEPPAN,
      isfm: this.ResourseList.ISFM,
      isallPR: this.ResourseList.ISALLFP,
      label_type: this.lebel_type,
      search_value: this.searchData.search_value
    }


    console.log('1-->', moment().format('DD-MMM-YYYY hh:mm:ss.SSSSSSSSS A'));
    let time_bf = new Date();
    this.authService.postData(params, 'payment/getNewFinancePaymentRequestByLaelWise1').then((result) => {
      this.searchpaymentdetailsAll = result;
      console.log('2-->', moment().format('DD-MMM-YYYY hh:mm:ss.SSSSSSSSS A'));
      if (this.lebel_type == 'CEOCOO_APPROVAL' && this.resourcedetails.TYPE_USER == 'COO') {
        this.searchpaymentdetails = this.searchpaymentdetailsAll.filter(x => x.STATUS_ID == 3 && x.APPROVAL_1 == 1 && x.CEO_APP_REQ == 0 && x.O_UNIT_ID != 23 && x.O_UNIT_ID != 26 && x.O_UNIT_ID != 28 && x.O_UNIT_ID != 29);
      } else if (this.lebel_type == 'CEOCOO_APPROVAL' && this.resourcedetails.TYPE_USER == 'CEO') {
        this.searchpaymentdetails = this.searchpaymentdetailsAll.filter(x => x.STATUS_ID == 3 && x.APPROVAL_1 == 1 && (x.CEO_APP_REQ == 1 || x.O_UNIT_ID == 23 || x.O_UNIT_ID == 26 || x.O_UNIT_ID == 28 || x.O_UNIT_ID == 29));
      } else if (this.lebel_type == 'CEO_ESCALATION') {
        this.searchpaymentdetails = this.searchpaymentdetailsAll.filter(x => x.IS_APPROVED == 1 && x.STATUS_ID != 7 && x.STATUS_ID != 10 && x.ESCALATION_DATE_VAL == 1);

      } else {
        this.searchpaymentdetails = this.searchpaymentdetailsAll;
      }

      if (this.searchpaymentdetails.length > 0) {
        console.log('3-->', moment().format('DD-MMM-YYYY hh:mm:ss.SSSSSSSSS A'));

        let length = 1;

        for (let i = 0; i < this.searchpaymentdetails.length; i++) {

          this.searchpaymentdetails[i].ENABLE_STATUS = 1;
          this.searchpaymentdetails[i].ENABLE_CANCEL = 0;

          if (this.searchpaymentdetails[i].IS_CEO_REVERTED == 1 && this.searchpaymentdetails[i].IS_REVERT_TO_APPROVED == 0) {
            if (this.searchpaymentdetails[i].CEO_REVERT_TO == this.user.UserInfoId) {
              this.searchpaymentdetails[i].STATUS_NAME = "CEO Reverted, Click to Approve/Reject";
            } else {
              this.searchpaymentdetails[i].ENABLE_STATUS = 0;
              this.searchpaymentdetails[i].STATUS_NAME = "CEO Reverted, " + this.searchpaymentdetails[i].REVERT_TO_NAME + " Only Approve/Reject";
              this.searchpaymentdetails[i].TOOL_TIP = "CEO Reverted, " + this.searchpaymentdetails[i].REVERT_TO_NAME + " Only Approve/Reject";
            }

          } else if (this.searchpaymentdetails[i].STATUS_ID == 0) {


            this.searchpaymentdetails[i].ENABLE_STATUS = 0;
            this.searchpaymentdetails[i].TOOL_TIP = "Approve FinancePayReq";

            if (this.searchpaymentdetails[i].IS_REJECTED == 1) {

              if (this.searchpaymentdetails[i].REJECTED_COMMENT_BY != null && this.searchpaymentdetails[i].REJECTED_COMMENT_BY != "") {
                this.searchpaymentdetails[i].STATUS_NAME = "FinancePayReq Rejected By " + this.searchpaymentdetails[i].REJECTED_COMMENT_BY + ", On " + moment(this.searchpaymentdetails[i].REJECTED_COMMENT_ON).format('DD-MMM-YYYY hh:mm a');
              } else {
                this.searchpaymentdetails[i].STATUS_NAME = "FinancePayReq Rejected";
              }
            } else {
              this.searchpaymentdetails[i].STATUS_NAME = "FinancePayReq Not Approved";
            }

          } else if (this.searchpaymentdetails[i].STATUS_ID == 1) {

            this.mlist = this.lpoManagerList.filter(x => x.MASTER_ID == this.searchpaymentdetails[i].MANAGER_MASTER_ID && x.ORDER_NO == parseInt(this.searchpaymentdetails[i].NO_MANAGER_APPROVED) + 1);

            if (this.mlist.length > 0) {

              this.mlist = this.mlist[0];

              if (this.mlist.ORDER_NO == 1) {
                this.searchpaymentdetails[i].STATUS_NAME = "Initiator sent (" + moment(this.searchpaymentdetails[i].LAST_STATUS_UPDATED).format('DD-MMM-YYYY hh:mm a') + ") / Waiting For " + this.mlist.MANAAGER + " Verification";
              } else {
                this.searchpaymentdetails[i].STATUS_NAME = this.searchpaymentdetails[i].NO_MANAGER_APPROVED + "Manager's Verified(" + moment(this.searchpaymentdetails[i].LAST_STATUS_UPDATED).format('DD-MMM-YYYY hh:mm a') + ") Waiting For " + this.mlist.MANAAGER + " Verification";
              }

              if (this.user.UserInfoId == this.mlist.MANAGER_USER_ID || this.resourcedetails.TYPE_ID == 8) {
                this.searchpaymentdetails[i].TOOL_TIP = "Click to Verify/Reject";
              } else {
                this.searchpaymentdetails[i].ENABLE_STATUS = 0;
                this.searchpaymentdetails[i].TOOL_TIP = this.mlist.MANAAGER + " Only Verify/Reject";
              }

              if (this.searchpaymentdetails[i].NEXT_APPROVAL_TYPE == 9 || this.searchpaymentdetails[i].NEXT_APPROVAL_TYPE == 13) {

                if (this.searchpaymentdetails[i].BOOKING_SHEET == 0) {
                  this.searchpaymentdetails[i].ENABLE_STATUS = 0;
                  this.searchpaymentdetails[i].STATUS_NAME = this.searchpaymentdetails[i].NO_MANAGER_APPROVED + "Manager's Verified(" + moment(this.searchpaymentdetails[i].LAST_STATUS_UPDATED).format('DD-MMM-YYYY hh:mm a') + ") Booking Sheet is not updated";
                  this.searchpaymentdetails[i].TOOL_TIP = "Booking Sheet is not updated";
                }
              }
            }

          } else if (this.searchpaymentdetails[i].STATUS_ID == 2) {

            this.searchpaymentdetails[i].STATUS_NAME = "Manager Verified(" + moment(this.searchpaymentdetails[i].LAST_STATUS_UPDATED).format('DD-MMM-YYYY hh:mm a') + ") / Waiting For Finance Confirmation";

          } else if (this.searchpaymentdetails[i].STATUS_ID == 3) {

            if (this.searchpaymentdetails[i].APPROVAL_1 == 0) {

              this.searchpaymentdetails[i].STATUS_NAME = this.searchpaymentdetails[i].REJECTED_COMMENT_BY + " Confirmed(" + moment(this.searchpaymentdetails[i].LAST_STATUS_UPDATED).format('DD-MMM-YYYY hh:mm a') + ") / Pending for Management Secretary Review";

              if (this.searchpaymentdetails[i].O_UNIT_ID == 1 || this.searchpaymentdetails[i].O_UNIT_ID == 19 || this.searchpaymentdetails[i].O_UNIT_ID == 17 || this.searchpaymentdetails[i].O_UNIT_ID == 22) {

                if (this.user.UserInfoId == 7 || this.user.UserInfoId == 821) {
                  this.searchpaymentdetails[i].ENABLE_STATUS = 1;
                  this.searchpaymentdetails[i].TOOL_TIP = "Click to Approve/Reject";
                }
                else {
                  this.searchpaymentdetails[i].ENABLE_STATUS = 0;
                  this.searchpaymentdetails[i].TOOL_TIP = "Only Sreevalsan or Sunita Lala can approve";
                }

              } else {
                if (this.user.UserInfoId == 821) {
                  this.searchpaymentdetails[i].ENABLE_STATUS = 1;
                  this.searchpaymentdetails[i].TOOL_TIP = "Click to Approve/Reject";
                }
                else {
                  this.searchpaymentdetails[i].ENABLE_STATUS = 0;
                  this.searchpaymentdetails[i].TOOL_TIP = "Only Sreevalsan can approve";
                }
              }

            } else {

              if (this.searchpaymentdetails[i].CEO_APP_REQ == 1) {
                this.searchpaymentdetails[i].STATUS_NAME = this.searchpaymentdetails[i].REJECTED_COMMENT_BY + " Confirmed(" + moment(this.searchpaymentdetails[i].LAST_STATUS_UPDATED).format('DD-MMM-YYYY hh:mm a') + ") / Waiting For CEO Approvl";
              } else {
                this.searchpaymentdetails[i].STATUS_NAME = this.searchpaymentdetails[i].REJECTED_COMMENT_BY + " Confirmed(" + moment(this.searchpaymentdetails[i].LAST_STATUS_UPDATED).format('DD-MMM-YYYY hh:mm a') + ") / Waiting For COO/CEO Approvl";
              }

              if (this.resourcedetails.TYPE_ID == 22 || this.resourcedetails.TYPE_ID == 8) {

                if (this.searchpaymentdetails[i].CEO_APP_REQ == 1) {

                  if (this.resourcedetails.TYPE_ID == 8) {
                    this.searchpaymentdetails[i].TOOL_TIP = "Click to Approve/Reject";
                  } else {
                    this.searchpaymentdetails[i].ENABLE_STATUS = 0;
                    this.searchpaymentdetails[i].TOOL_TIP = "CEO Only Approve/Reject";
                  }
                } else {
                  this.searchpaymentdetails[i].TOOL_TIP = "Click to Approve/Reject";
                }

              } else {
                this.searchpaymentdetails[i].ENABLE_STATUS = 0;
                this.searchpaymentdetails[i].TOOL_TIP = "COO/CEO Only Approve/Reject";
              }
            }


          } else if (this.searchpaymentdetails[i].STATUS_ID == 4) {

            if (this.searchpaymentdetails[i].MODE_OF_PAYMENT_NAME == 'Bank transfer' || this.searchpaymentdetails[i].MODE_OF_PAYMENT_NAME == 'Mollak') {

              if (this.searchpaymentdetails[i].CEO_APP_BY == 6) {
                this.searchpaymentdetails[i].STATUS_NAME = "CEO Approved (" + moment(this.searchpaymentdetails[i].LAST_STATUS_UPDATED).format('DD-MMM-YYYY hh:mm a') + ") / Initate Payment";
              } else {
                this.searchpaymentdetails[i].STATUS_NAME = "COO Approved (" + moment(this.searchpaymentdetails[i].LAST_STATUS_UPDATED).format('DD-MMM-YYYY hh:mm a') + ") / Initate Payment";
              }

            } else {

              if (this.searchpaymentdetails[i].CEO_APP_BY == 6) {
                this.searchpaymentdetails[i].STATUS_NAME = "CEO Approved(" + moment(this.searchpaymentdetails[i].LAST_STATUS_UPDATED).format('DD-MMM-YYYY hh:mm a') + ") / Under Cheque Preparation";
              } else {
                this.searchpaymentdetails[i].STATUS_NAME = "COO Approved(" + moment(this.searchpaymentdetails[i].LAST_STATUS_UPDATED).format('DD-MMM-YYYY hh:mm a') + ") / Under Cheque Preparation";
              }

            }

            if (this.searchpaymentdetails[i].IS_CANCEL_REQUESTED == 1) {

              this.searchpaymentdetails[i].STATUS_NAME = "Payment Requested for Cancel";
              this.searchpaymentdetails[i].TOOL_TIP = "Payment Requested for Cancel";
              this.searchpaymentdetails[i].ENABLE_STATUS = 0;

              if (this.resourcedetails.TYPE_ID == 22 || this.resourcedetails.TYPE_ID == 8) {
                this.searchpaymentdetails[i].ENABLE_CANCEL = 1;
              }
            } else if (this.resourcedetails.TYPE_ID == 9 || this.resourcedetails.TYPE_ID == 13) {

              if (this.user.UserInfoId == this.searchpaymentdetails[i].CREATED_BY) {
                this.searchpaymentdetails[i].ENABLE_CANCEL = 1;
              }
              this.searchpaymentdetails[i].TOOL_TIP = "Click to Approve/Reject";

            } else {

              if (this.user.UserInfoId == this.searchpaymentdetails[i].CREATED_BY) {
                this.searchpaymentdetails[i].ENABLE_CANCEL = 1;
              }
              this.searchpaymentdetails[i].ENABLE_STATUS = 0;
              this.searchpaymentdetails[i].TOOL_TIP = "Finance User Only Approve/Reject";

            }



          } else if (this.searchpaymentdetails[i].STATUS_ID == 5) {

            if (this.searchpaymentdetails[i].MODE_OF_PAYMENT_NAME == 'Bank transfer' || this.searchpaymentdetails[i].MODE_OF_PAYMENT_NAME == 'Mollak') {
              this.searchpaymentdetails[i].STATUS_NAME = "Payment initiated  (" + moment(this.searchpaymentdetails[i].LAST_STATUS_UPDATED).format('DD-MMM-YYYY hh:mm a') + ") / waiting for transfer confirmation";
            } else {
              this.searchpaymentdetails[i].STATUS_NAME = "Cheque Prepared (" + moment(this.searchpaymentdetails[i].LAST_STATUS_UPDATED).format('DD-MMM-YYYY hh:mm a') + ") / Sent for director signature";
            }

            if (this.searchpaymentdetails[i].IS_CANCEL_REQUESTED == 1) {

              this.searchpaymentdetails[i].STATUS_NAME = "Payment Requested for Cancel";
              this.searchpaymentdetails[i].TOOL_TIP = "Payment Requested for Cancel";
              this.searchpaymentdetails[i].ENABLE_STATUS = 0;

            } else if (this.resourcedetails.TYPE_ID == 9 || this.resourcedetails.TYPE_ID == 13) {
              this.searchpaymentdetails[i].TOOL_TIP = "Click to Approve/Reject";
            } else {
              this.searchpaymentdetails[i].ENABLE_STATUS = 0;
              this.searchpaymentdetails[i].TOOL_TIP = "Finance User Only Approve/Reject";
            }


          } else if (this.searchpaymentdetails[i].STATUS_ID == 6) {

            this.searchpaymentdetails[i].STATUS_NAME = "Director signatured (" + moment(this.searchpaymentdetails[i].LAST_STATUS_UPDATED).format('DD-MMM-YYYY hh:mm a') + ") / Ready for Dispatch";

            if (this.searchpaymentdetails[i].IS_CANCEL_REQUESTED == 1) {

              this.searchpaymentdetails[i].STATUS_NAME = "Payment Requested for Cancel";
              this.searchpaymentdetails[i].TOOL_TIP = "Payment Requested for Cancel";
              this.searchpaymentdetails[i].ENABLE_STATUS = 0;

            } else if (this.resourcedetails.TYPE_ID == 9 || this.resourcedetails.TYPE_ID == 13) {
              this.searchpaymentdetails[i].TOOL_TIP = "Click to Approve/Reject";
            } else {
              this.searchpaymentdetails[i].ENABLE_STATUS = 0;
              this.searchpaymentdetails[i].TOOL_TIP = "Finance User Only Approve/Reject";
            }

          } else if (this.searchpaymentdetails[i].STATUS_ID == 7) {

            this.searchpaymentdetails[i].STATUS_NAME = "Completed(" + moment(this.searchpaymentdetails[i].LAST_STATUS_UPDATED).format('DD-MMM-YYYY hh:mm a') + ")";
            this.searchpaymentdetails[i].ENABLE_STATUS = 0;

          } else if (this.searchpaymentdetails[i].STATUS_ID == 10) {

            this.searchpaymentdetails[i].ENABLE_STATUS = 0;
            this.searchpaymentdetails[i].STATUS_NAME = "Finance Payment Request Canceled(" + moment(this.searchpaymentdetails[i].LAST_STATUS_UPDATED).format('DD-MMM-YYYY hh:mm a') + ")";
            this.searchpaymentdetails[i].TOOL_TIP = "Finance Payment Request Canceled";
          }
          else {
            this.searchpaymentdetails[i].STATUS_NAME = '';
          }

          if (length == this.searchpaymentdetails.length) {
            this.financepaymentdetails = this.searchpaymentdetails;
            this.financepaymentdetailsAll = this.searchpaymentdetails;
            console.log(this.searchpaymentdetails);
            console.log('4-->', moment().format('DD-MMM-YYYY hh:mm:ss.SSSSSSSSS A'));
            this.presentLoadingDefault(false);

            this.itemsToDisplay = [];
            let total_count = 10;
            let array_len = 0;
            if(total_count < this.financepaymentdetails.length){
                array_len = total_count;
            }else{
                array_len = this.financepaymentdetails.length;
            }

            for (let i = 0; i < array_len; i++) {
              this.itemsToDisplay.push(this.financepaymentdetails[i]);
            }

            let time_af = new Date();
            let seconds = Math.round((time_af.getTime() - time_bf.getTime()) / 1000);
            let x = this.secondsToDhms(seconds);
            console.log('Seconds:', seconds);
            console.log(x);


            if (this.searchData.search_value != '' && this.searchData.search_value != undefined && this.searchData.search_value != null) {
              this.SearchrtcaseDetail();
            }


          }

          length++;
        }


      } else {
        this.presentLoadingDefault(false);
      }
      console.log('5-->', moment().format('DD-MMM-YYYY hh:mm:ss.SSSSSSSSS A'));

    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });
  }


  getLpoManagerList() {

    this.presentLoadingDefault(true);
    let params = {
      user_info_id: this.user.UserInfoId
    };

    this.authService.postData(params, 'payment/getLpoManagerList').then((result) => {
      this.lpoManagerList = result;
      console.log(this.lpoManagerList);
      this.paymentdetails();

    }, (err) => {
      this.presentToast(err);
    });
  }

  ionViewDidLoad() {
    this.getLpoManagerList();
  }

  openModal(PAYMENT_REQUEST_ID: any, PAYMENT_DETAIL: any) {
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };
    let myModalData = [{
      PAYMENT_REQUEST_ID: PAYMENT_REQUEST_ID,
      PAYMENT_DETAIL: PAYMENT_DETAIL
    }];

    let myModal: Modal = this.modal.create('FinancePaymentCommentPage', { data: myModalData }, myModalOptions);

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

    const Data = this.navParams.get('data');

    let Type_List = ['CEO', 'COO', 'Legal-MGR', 'Leasing-MGR'];

    if (PaymentStatus == 'Reject' && (Type_List.indexOf(this.resourcedetails.TYPE_USER) > -1)) {
      this.new_status = 1;
    }

    if (Data[0].CASE_REQUEST_ID == 0) {
      this.CASE_REQUEST_Item = this.CASE_REQUEST.filter(x => x.PAYMENT_REQUEST_ID == this.PAYMENT_REQ_ID);
      this.CASE_REQUEST_Item = this.CASE_REQUEST_Item[0];
    }
    console.log(this.CASE_REQUEST_Item);
    console.log(this.CASE_REQUEST_Item.COURT_ID);

    let updatedata = [{
      old_data: this.searchpaymentdetails.filter(item => item.PAYMENT_REQUEST_ID === this.PAYMENT_REQ_ID),
      COMMENTS: COMMENTS,
      COURT_ID: this.CASE_REQUEST_Item.COURT_ID,
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
        this.paymentdetails();
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

  openAttachment(PAYMENT_REQUEST_ID: any) {

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let myModalData = [{
      PAYMENT_REQUEST_ID: PAYMENT_REQUEST_ID
    }];

    let myModal: Modal = this.modal.create('FinancePaymentAttachmentPage', { data: myModalData }, myModalOptions);

    myModal.present();


    myModal.onWillDismiss(() => {
      this.ionViewDidLoad();
    });

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

  updatefinancepaymentstatus(PAYMENT_REQUEST_ID: any, ENABLE_STATUS: any, TOOL_TIP: any, PAYMENT_DETAIL: any) {

    let user_role = this.resourcedetails.TYPE_USER;

    //user_role = 'CEO';

    if (ENABLE_STATUS == 0 && user_role != 'CEO') {
      this.presentToast(TOOL_TIP);
      return;
    } else {

      const myModalOptions: ModalOptions = {
        enableBackdropDismiss: false
      };

      let myModalData = [{
        PAYMENT_REQUEST_ID: PAYMENT_REQUEST_ID,
        PAYMENT_DETAIL: PAYMENT_DETAIL
      }];

      let myModal: Modal = this.modal.create('FinancePaymentStatusUpdatePage', { data: myModalData }, myModalOptions);

      myModal.present();

      myModal.onWillDismiss(() => {
        this.ionViewDidLoad();
      });
    }

  }


  SearchrtcaseDetail() {
    let case_val = this.searchData.search_value;
    if (case_val != '') {
      let filterData = this.financepaymentdetailsAll.filter(item => this.filter(item));
      this.financepaymentdetails = filterData;
      this.itemsToDisplay = [];
      for (let i = 0; i < this.financepaymentdetails.length; i++) {
        this.itemsToDisplay.push(this.financepaymentdetails[i]);
      }

    } else {
      this.financepaymentdetails = this.financepaymentdetailsAll;
      this.itemsToDisplay = [];
      for (let i = 0; i < 10; i++) {
        this.itemsToDisplay.push(this.financepaymentdetails[i]);
      }
    }

    console.log(this.financepaymentdetails);

  }

  filter(item) {
    let _val = this.searchData.search_value;
    let _case_val = item['FINANCE_PAY_REQ_ID'] ? item['FINANCE_PAY_REQ_ID'].toString().toUpperCase() : '';
    let _lease_val = item['SUPPLIER_NAME'] ? item['SUPPLIER_NAME'].toString().toUpperCase() : '';
    let _cno_val = item['CREATEDBYNAME'] ? item['CREATEDBYNAME'].toString().toUpperCase() : '';
    return (_case_val.includes(_val.toUpperCase()) || _lease_val.includes(_val.toUpperCase()) || _cno_val.includes(_val.toUpperCase()));
  }

  Getallimagelist(FINANCE_PAY_REQ_ID: any, count: any) {
    if (count > 0) {
      this.presentLoadingDefault(true);
      const Data = {
        PAYMENT_REQUEST_ID: FINANCE_PAY_REQ_ID,
        ref_code: 'GENERAL'
      };

      this.authService.postData(Data, 'payment/getFinancePaymentAttachment').then((result) => {
        this.presentLoadingDefault(false);
        this.ImageList = result;
        const myModalOptions: ModalOptions = {
          enableBackdropDismiss: false
        };
        const myModalData = [{
          ImageList: this.ImageList,
          page_name: 'Payment Request'
        }];

        const myModal: Modal = this.modal.create('lpoimagelist', { data: myModalData }, myModalOptions);
        myModal.present();
        myModal.onDidDismiss((data) => {
        });
        myModal.onWillDismiss((data) => {
        });

      }, (err) => {
        this.presentLoadingDefault(false);
        this.presentToast(err);
      });
    } else {
      this.presentToast('No Image Found');
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
    } else {
      loading.dismissAll();
      loading = null
    }
  }

  secondsToDhms(seconds) {
    seconds = Number(seconds);
    var d = Math.floor(seconds / (3600 * 24));
    var h = Math.floor(seconds % (3600 * 24) / 3600);
    var m = Math.floor(seconds % 3600 / 60);
    var s = Math.floor(seconds % 60);

    var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " Days, ") : "";
    var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " Hours, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " Mins, ") : "";
    return dDisplay + hDisplay + mDisplay;
  }

  doInfinite(infiniteScroll) {
    console.log('Begin async operation');
    let len = this.itemsToDisplay.length;

    setTimeout(() => {

      let total_count = len + 10;
      let array_len = 0;
      if(total_count < this.financepaymentdetails.length){
        array_len = total_count;
      }else{
        array_len = this.financepaymentdetails.length;
      }

      for (let i = len; i < array_len; i++) {
        this.itemsToDisplay.push(this.financepaymentdetails[i]);
      }
      console.log(this.itemsToDisplay);
      console.log('Async operation has ended');
      infiniteScroll.complete();
    }, 500);
  }

}
