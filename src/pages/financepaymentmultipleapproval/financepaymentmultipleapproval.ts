import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, Modal, ModalController, ModalOptions, ViewController } from 'ionic-angular';
import { DashboardPage } from '../dashboard/dashboard';
import { RestProvider } from '../../providers/rest/rest';
import * as moment from 'moment';

@Component({
  selector: 'page-financepaymentmultipleapproval',
  templateUrl: 'financepaymentmultipleapproval.html',
})

export class FinancePaymentMultipleApprovalPage {
  
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
  searchData = { "search_value": "" };

  payment_request_id_arr = [];

  PAYMENT_DETAIL: any;

  lpoManagerList: any;

  mlist: any;
  lebel_type:any;
  
  pet: string = "fp";
  tab_name: any;
  searchpaymentdetails_ug:any;
  searchpaymentdetails_uk:any;
  searchpaymentdetails_fp:any;
  searchpaymentdetails_treppan:any;
  searchpaymentdetailsAll:any;
  fp_length:any;
  uk_length:any;
  ug_length:any;
  treppan_length:any;
  paymentBudgetHistory:any;

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


  segmentChanged(event) {
    console.log(event.value);
    let tabValue = event.value;
    this.tab_name = event.value;
    if (tabValue == 'fp') {
      this.multipleapprovalpaymentdetails();
    } else if (tabValue == 'uganda') {
      this.multipleapprovalpaymentdetails();
    } else if (tabValue == 'uk') {
      this.multipleapprovalpaymentdetails();
    }else if (tabValue == 'treppan') {
      this.multipleapprovalpaymentdetails();
    }
  }

  multipleapprovalpaymentdetails() {
  
    let Data = this.navParams.get('data');
    this.payment_request_id_arr = [];

    if(Data != undefined) {
        this.lebel_type = Data[0].type;
    } else {
        this.lebel_type = "";
    }
    let params = {
      user_info_id: this.user.UserInfoId,
      resource_type_id: this.resourcedetails.TYPE_ID,
      resource_type_user: this.resourcedetails.TYPE_USER
    };

    this.presentLoadingDefault(true);
    this.authService.postData(params, 'payment/getFinancePaymentRequestMultipleApproval').then((result) => {
      this.presentLoadingDefault(false);
      //this.searchpaymentdetails = result;
      this.searchpaymentdetailsAll = result;

      if(this.tab_name == 'uganda'){
        this.searchpaymentdetails = this.searchpaymentdetailsAll.filter(x=> x.OPERATIONAL_UNIT_NAME == 'UG');
      }else if(this.tab_name == 'uk'){
        this.searchpaymentdetails = this.searchpaymentdetailsAll.filter(x=> x.OPERATIONAL_UNIT_NAME == 'HMAF-UK Operating Unit' || x.OPERATIONAL_UNIT_NAME == 'FP-UK Operating Unit' || x.OPERATIONAL_UNIT_NAME == 'UKBRCNL Operating Unit'|| x.OPERATIONAL_UNIT_NAME == 'HINDHEAD Operating Unit' || x.OPERATIONAL_UNIT_NAME == 'LEO Operating Unit'|| x.OPERATIONAL_UNIT_NAME == 'DUNSTY Operating Unit' );
      }else if(this.tab_name == 'treppan'){
        this.searchpaymentdetails = this.searchpaymentdetailsAll.filter(x=> x.OPERATIONAL_UNIT_NAME == 'TREPPAN');
      }else{
        this.searchpaymentdetails = this.searchpaymentdetailsAll.filter(x=> x.OPERATIONAL_UNIT_NAME != 'HMAF-UK Operating Unit' && x.OPERATIONAL_UNIT_NAME != 'FP-UK Operating Unit' && x.OPERATIONAL_UNIT_NAME != 'UKBRCNL Operating Unit' && x.OPERATIONAL_UNIT_NAME != 'HINDHEAD Operating Unit' && x.OPERATIONAL_UNIT_NAME != 'LEO Operating Unit' && x.OPERATIONAL_UNIT_NAME != 'DUNSTY Operating Unit' &&  x.OPERATIONAL_UNIT_NAME != 'UG' && x.OPERATIONAL_UNIT_NAME != 'TREPPAN');
      }

      if (this.searchpaymentdetails.length > 0) {

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
            // this.financepaymentdetails = this.searchpaymentdetails;
            // this.financepaymentdetailsAll = this.searchpaymentdetails;
            console.log(this.searchpaymentdetails);

            if(this.tab_name == 'uganda'){
              this.searchpaymentdetails_ug = this.searchpaymentdetails;
              this.ug_length = this.searchpaymentdetails_ug.length;
            }else if(this.tab_name == 'uk'){
              this.searchpaymentdetails_uk = this.searchpaymentdetails;
              this.uk_length = this.searchpaymentdetails_uk.length;
            }else if(this.tab_name == 'treppan'){
              this.searchpaymentdetails_treppan = this.searchpaymentdetails;
              this.treppan_length = this.searchpaymentdetails_treppan.length;
            }else{
              this.searchpaymentdetails_fp = this.searchpaymentdetails;
              this.fp_length = this.searchpaymentdetails_fp.length;
            }

            this.presentLoadingDefault(false);
          }

          length++;
        }

        if (Data[0].SearchData != '' && Data[0].SearchData != undefined) {
          this.searchData.search_value = Data[0].SearchData;
          this.SearchrtcaseDetail();
        }

        if(this.searchData.search_value != ''){
          this.SearchrtcaseDetail();
        }

      } else {
        this.searchpaymentdetails = [];
        this.presentLoadingDefault(false);
      }

      if (this.searchpaymentdetails.length > 0) {
        this.searchpaymentdetails = this.searchpaymentdetails.filter(item => item.CREATEDBY != 2)
        if(this.tab_name == 'uganda'){
          this.searchpaymentdetails_ug = this.searchpaymentdetails;
        }else if(this.tab_name == 'uk'){
          this.searchpaymentdetails_uk = this.searchpaymentdetails;
        }else if(this.tab_name == 'treppan'){
          this.searchpaymentdetails_treppan = this.searchpaymentdetails;
        }else{
          this.searchpaymentdetails_fp = this.searchpaymentdetails;
        }
      }

      console.log(this.searchpaymentdetails);

    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });
  }

  ionViewDidLoad() {
    this.getLpoManagerList();
    
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

  showBtnbill = -1;
  isOpenbill = false;
  oldBtnbill = -1;
  showUndoBtnbill(index,FINANCE_PAY_REQ_ID:any,LINK_ID:any) {
    this.getQuickView(FINANCE_PAY_REQ_ID,LINK_ID);
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


  multiplePaymentApprovebtn(status: any) {
    if (this.payment_request_id_arr.length > 0) {
      this.multiple_approval_comment_modal = 'block';
    } else {
      this.presentToast('Please select Payment Request.');
      return;
    }
  }




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

        COMMENTS = COMMENTS.trim();

        if (COMMENTS != '') {
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
        } else {
          this.presentToast("Comments cannot be blank...");
          return;
        }

      }

    } else {
      this.presentToast("Please select payment request.");
      return;
    }

  }


  encriptrandom(Value: any, Digits: any) {

    let val = (Value + Digits) * Digits;
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    if (Digits == 0) return "";

    let rno = characters.charAt(Value % (characters.length))
    return this.encriptrandom((Value + characters.length + Digits) / (characters.length), Digits - 1) + (rno);
  }


  insertPaymentComments(type: any, COMMENTS: any, PAYMENT_REQUEST_ID: any) {

    let paymentcommentsData = [{
      PAYMENT_REQUEST_ID: PAYMENT_REQUEST_ID,
      modified_by: this.user.UserInfoId,
      ReferenceType: type,
      COMMENTS: COMMENTS
    }];

    let _valid = true;
    
    if (_valid) {
      this.authService.postData(paymentcommentsData[0], 'payment/getInsertFinancepaymentcommentsinsert').then((result) => {
        this.insertedValues = result;
        console.log('123--> Comments inserted', PAYMENT_REQUEST_ID, COMMENTS);
      }, (err) => {
        this.presentLoadingDefault(false);
        this.presentToast(err);
      });
    }
  }

  updatepaymentstatus(TYPE: any) {

    if (this.payment_request_id_arr.length > 0) {

      let msg = '';
      let length = 1;
      this.btnTxtApprove = "In Progress...";
      this.btnTxtReject = "In Progress...";
      this.presentLoadingDefault(true);

      for (let i = 0; i < this.payment_request_id_arr.length; i++) {

        this.PAYMENT_DETAIL = this.searchpaymentdetails.filter(item => item.FINANCE_PAY_REQ_ID == this.payment_request_id_arr[i]);

        let code = this.encriptrandom(this.PAYMENT_DETAIL[0].FINANCE_PAY_REQ_ID, 5);
        let mid = Math.trunc(parseInt(this.PAYMENT_DETAIL[0].FINANCE_PAY_REQ_ID) / 2);
        code = code.substring(0, code.length / 2) + mid + code.substring(code.length / 2);

        console.log('Code -->', code);

        if (TYPE == 'Reject') {

          this.insertPaymentComments('FinancePayReq COMMENT', this.COMMENTS, this.payment_request_id_arr[i]);
          this.insertPaymentComments('FinancePayReq STATUS', 'FinancePayReq Rejected', this.payment_request_id_arr[i]);
          this.PAYMENT_DETAIL[0].IS_APPROVED = 0;
          this.PAYMENT_DETAIL[0].STATUS_ID = 0;

          let updatedata = [{
            old_data: JSON.stringify(this.PAYMENT_DETAIL[0]),
            COMMENTS: this.COMMENTS,
            PAYMENT_DETAILS: '',
            modified_by: this.user.UserInfoId,
            resourceType: this.resourcedetails.TYPE_USER
          }];
          console.log("updatedataaaaaaaaa", updatedata);
          let COMMENTS = this.COMMENTS.trim();

          if (COMMENTS != '') {
            console.log(updatedata[0]);
            this.authService.postData(updatedata[0], 'payment/getUpdateFinancePaymentRequestStatus').then((result) => {
              this.insertedValues = result;
              if (this.payment_request_id_arr.length == length) {
                this.presentLoadingDefault(false);
                this.btnTxtApprove = "Approve";
                this.btnTxtReject = "Reject";
                this.payment_request_id_arr = [];
                this.multipleapprovalpaymentdetails();
                this.presentToast("Payment Request status updated successfully");
                this.onClosecomment_modal();
              }
              length++;
            }, (err) => {
              this.presentLoadingDefault(false);
              this.presentToast(err);
            });
          } else {
            this.presentToast("Comments cannot be blank...");
          }

        } else if (TYPE == 'Approve') {

          this.insertPaymentComments('FinancePayReq COMMENT', this.COMMENTS, this.payment_request_id_arr[i]);
          debugger;
          if (this.PAYMENT_DETAIL[0].IS_APPROVED == 1) {
            debugger;
            if (this.PAYMENT_DETAIL[0].IS_CEO_REVERTED == 1 && this.PAYMENT_DETAIL[0].IS_REVERT_TO_APPROVED == 0) {
              debugger;
              msg = this.PAYMENT_DETAIL[0].REVERT_TO_NAME + " Approved"
              this.insertPaymentComments('FinancePayReq STATUS', msg, this.payment_request_id_arr[i]);
              this.PAYMENT_DETAIL[0].STATUS_ID = parseInt(this.PAYMENT_DETAIL[0].STATUS_ID) - 1;
              this.PAYMENT_DETAIL[0].IS_REVERT_TO_APPROVED = 1;

            } else if (this.PAYMENT_DETAIL[0].STATUS_ID == 0) {
              debugger;
              msg = 'FinancePayReq Approved';
              if (this.resourcedetails.TYPE_ID == 8) {
                msg = 'COO/CEO Approved';
              }
              this.insertPaymentComments('FinancePayReq STATUS', msg, this.payment_request_id_arr[i]);

            } else if (this.PAYMENT_DETAIL[0].STATUS_ID == 1) {
              debugger;
              // if (this.resourcedetails.TYPE_ID == 13 || this.resourcedetails.TYPE_ID == 9) {

              //   if (this.isChecked) {

              //     if (this.PAYMENT_DETAILS == "" || this.PAYMENT_DETAILS == null) {
              //       this.presentToast('Enter Hard copy details to proceed..');
              //     }

              //     this.PAYMENT_DETAIL[0].IS_HARD_COPY_RCVD = 1;
              //     this.PAYMENT_DETAIL[0].FINANCE_REMARKS = this.PAYMENT_DETAILS;
              //     this.PAYMENT_DETAIL[0].HC_RCVD_BY = this.user.UserInfoId;

              //   }
              // }

              this.mlist = this.lpoManagerList.filter(x => x.MASTER_ID == this.PAYMENT_DETAIL[0].MANAGER_MASTER_ID && x.ORDER_NO == parseInt(this.PAYMENT_DETAIL[0].NO_MANAGER_APPROVED) + 1);

              if (this.mlist.length > 0) {
                this.mlist = this.mlist[0];
              }
              this.PAYMENT_DETAIL[0].NO_MANAGER_APPROVED = parseInt(this.PAYMENT_DETAIL[0].NO_MANAGER_APPROVED) + 1;

              if (this.PAYMENT_DETAIL[0].NO_MANAGER_APPROVED != this.PAYMENT_DETAIL[0].NUMBER_OF_APPROVALS) {

                this.PAYMENT_DETAIL[0].STATUS_ID = parseInt(this.PAYMENT_DETAIL[0].STATUS_ID) - 1;

              } else {
                this.PAYMENT_DETAIL[0].STATUS_ID = parseInt(this.PAYMENT_DETAIL[0].STATUS_ID) + 1;

                if (this.PAYMENT_DETAIL[0].HR_PR > 0) {
                  this.PAYMENT_DETAIL[0].APPROVAL_1 = 1
                }
              }

              msg = this.mlist.MANAAGER + " Verified";
              if (this.resourcedetails.TYPE_ID == 8) {
                msg = 'CEO Approved';
              }
              this.insertPaymentComments('FinancePayReq STATUS', msg, this.payment_request_id_arr[i]);

            } else if (this.PAYMENT_DETAIL[0].STATUS_ID == 2) {
              debugger;
              msg = "FINANCE Confirmed";
              this.insertPaymentComments('FinancePayReq STATUS', msg, this.payment_request_id_arr[i]);

            } else if (this.PAYMENT_DETAIL[0].STATUS_ID == 3) {
              debugger;
              msg = "COO Approved";

              if (this.resourcedetails.TYPE_ID == 8) {
                msg = 'CEO Approved';
              } else {

                let code = this.encriptrandom(this.PAYMENT_DETAIL[0].FINANCE_PAY_REQ_ID, 5);
                let mid = Math.trunc(parseInt(this.PAYMENT_DETAIL[0].FINANCE_PAY_REQ_ID) / 2);
                code = code.substring(0, code.length / 2) + mid + code.substring(code.length / 2);
                this.PAYMENT_DETAIL[0].APPROVAL_CODE = code;
              }
              this.insertPaymentComments('FinancePayReq STATUS', msg, this.payment_request_id_arr[i]);

            } else if (this.PAYMENT_DETAIL[0].STATUS_ID == 4) {
              debugger;
              msg = "Cheque Prepared";

              if (this.PAYMENT_DETAIL[0].MODE_OF_PAYMENT == 5) {
                msg = "MOLLAK";
              }
              else if (this.PAYMENT_DETAIL[0].MODE_OF_PAYMENT == 1) {
                msg = "BANK TRANSFER";
              }
              this.insertPaymentComments('FinancePayReq STATUS', msg, this.payment_request_id_arr[i]);

            } else if (this.PAYMENT_DETAIL[0].STATUS_ID == 5) {
              debugger;
              msg = "Director signatured";

              if (this.PAYMENT_DETAIL[0].MODE_OF_PAYMENT == 5) {
                this.PAYMENT_DETAIL[0].STATUS_ID = 6;
                msg = "TRANSFER APPROVAL & Completed";
              }
              else if (this.PAYMENT_DETAIL[0].MODE_OF_PAYMENT == 1) {
                this.PAYMENT_DETAIL[0].STATUS_ID = 6;
                msg = "BANK ADVICE & Completed";
              }
              this.insertPaymentComments('FinancePayReq STATUS', msg, this.payment_request_id_arr[i]);

            } else if (this.PAYMENT_DETAIL[0].STATUS_ID == 6) {
              debugger;
              msg = "Dispatched & Completed";
              this.insertPaymentComments('FinancePayReq STATUS', msg, this.payment_request_id_arr[i]);

            }

            if (this.resourcedetails.TYPE_ID == 8 && this.PAYMENT_DETAIL[0].STATUS_ID < 4) {

              this.PAYMENT_DETAIL[0].STATUS_ID = 4;
              let code = this.encriptrandom(this.PAYMENT_DETAIL[0].FINANCE_PAY_REQ_ID, 5);
              let mid = Math.trunc(parseInt(this.PAYMENT_DETAIL[0].FINANCE_PAY_REQ_ID) / 2);
              code = code.substring(0, code.length / 2) + mid + code.substring(code.length / 2);
              this.PAYMENT_DETAIL[0].APPROVAL_CODE = code;

            } else {
              this.PAYMENT_DETAIL[0].STATUS_ID = parseInt(this.PAYMENT_DETAIL[0].STATUS_ID) + 1;
            }


            let updatedata = [{
              old_data: JSON.stringify(this.PAYMENT_DETAIL[0]),
              COMMENTS: this.COMMENTS,
              PAYMENT_DETAILS: '',
              modified_by: this.user.UserInfoId,
              resourceType: this.resourcedetails.TYPE_USER
            }];

            let COMMENTS = this.COMMENTS.trim();

            if (COMMENTS != '') {
              console.log(updatedata[0]);
              this.authService.postData(updatedata[0], 'payment/getUpdateFinancePaymentRequestStatus').then((result) => {
                this.insertedValues = result;
                if (this.payment_request_id_arr.length == length) {
                  this.presentLoadingDefault(false);
                  this.btnTxtApprove = "Approve";
                  this.btnTxtReject = "Reject";                  
                  this.payment_request_id_arr = [];
                  this.multipleapprovalpaymentdetails();
                  this.presentToast("Payment Request status updated successfully");
                  this.onClosecomment_modal();
                }
                length++;

              }, (err) => {
                this.presentLoadingDefault(false);
                this.presentToast(err);
              });
            } else {
              this.presentToast("Comments cannot be blank...");
            }


          } else {

            msg = "Finance Payment Request Canceled";
            this.insertPaymentComments('FinancePayReq STATUS', msg, this.payment_request_id_arr[i]);
            this.PAYMENT_DETAIL[0].STATUS_ID = 0;


            let updatedata = [{
              old_data: JSON.stringify(this.PAYMENT_DETAIL[0]),
              COMMENTS: this.COMMENTS,
              PAYMENT_DETAILS: '',
              modified_by: this.user.UserInfoId,
              resourceType: this.resourcedetails.TYPE_USER
            }];

            let COMMENTS = this.COMMENTS.trim();

            if (COMMENTS != '') {
              console.log(updatedata[0]);
              this.authService.postData(updatedata[0], 'payment/getUpdateFinancePaymentRequestStatus').then((result) => {
                this.insertedValues = result;
                if (this.payment_request_id_arr.length == length) {
                  this.presentLoadingDefault(false);
                  this.btnTxtApprove = "Approve";
                  this.btnTxtReject = "Reject";
                  this.payment_request_id_arr = [];
                  this.multipleapprovalpaymentdetails();
                  this.presentToast("Payment Request status updated successfully");
                  this.onClosecomment_modal();
                }
                length++;

              }, (err) => {
                this.presentLoadingDefault(false);
                this.presentToast(err);
              });
            } else {
              this.presentToast("Comments cannot be blank...");
            }

          }


        }// approve if end

      }

    }

  }




  getLpoManagerList() {
    let params = {
      user_info_id: this.user.UserInfoId
    };

    //this.presentLoadingDefault(true);
    this.authService.postData(params, 'payment/getLpoManagerList').then((result) => {
      //this.presentLoadingDefault(false);
      this.multipleapprovalpaymentdetails();
      this.lpoManagerList = result;
      console.log(this.lpoManagerList);

    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });
  }

  SearchrtcaseDetail() {
    let case_val = this.searchData.search_value;
    if (case_val != '') {
      let filterData = this.searchpaymentdetails.filter(item => this.filter(item));
      //this.financepaymentdetails = filterData;
      if(this.tab_name == 'uganda'){
        this.searchpaymentdetails_ug = filterData;
      }else if(this.tab_name == 'uk'){
        this.searchpaymentdetails_uk = filterData;
      }else if(this.tab_name == 'treppan'){
        this.searchpaymentdetails_treppan = filterData;
      }else{
        this.searchpaymentdetails_fp = filterData;
      }

    } else {
      //this.financepaymentdetails = this.searchpaymentdetails

      if(this.tab_name == 'uganda'){
        this.searchpaymentdetails_ug = this.searchpaymentdetails;
      }else if(this.tab_name == 'uk'){
        this.searchpaymentdetails_uk = this.searchpaymentdetails;
      }else if(this.tab_name == 'treppan'){
        this.searchpaymentdetails_treppan = this.searchpaymentdetails;
      }else{
        this.searchpaymentdetails_fp = this.searchpaymentdetails;
      }

    }

  }

  filter(item) {
    let _val = this.searchData.search_value;
    let _case_val = item['FINANCE_PAY_REQ_ID'] ? item['FINANCE_PAY_REQ_ID'].toString().toUpperCase() : '';
    let _lease_val = item['SUPPLIER_NAME'] ? item['SUPPLIER_NAME'].toString().toUpperCase() : '';
    let _cno_val = item['CREATEDBYNAME'] ? item['CREATEDBYNAME'].toString().toUpperCase() : '';
    return (_case_val.includes(_val.toUpperCase()) || _lease_val.includes(_val.toUpperCase()) || _cno_val.includes(_val.toUpperCase()));
  }


  getbill(FinancePayReq_Id:any) {  
    let params = {
      FinancePayReq_Id: FinancePayReq_Id
    }
    this.presentLoadingDefault(true);
    this.authService.postData(params, 'payment/getFinancePaymentLinkListAll/').then((result) => {
      this.paymentbilldetailsall = result;
      console.log(this.paymentbilldetailsall);

      this.presentLoadingDefault(false);
      
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });
  }
  
  showAddSourceBtn = -1;
  isAddSourceOpen = false;
  oldAddSourceBtn = -1;

  showAddSourceUndoBtn(index, ID:any) {
    this.getbill(ID);
    if (this.isAddSourceOpen == false) {
      this.isAddSourceOpen = true;
      this.oldAddSourceBtn = index;
      this.showAddSourceBtn = index;
    } else {
      if (this.oldAddSourceBtn == index) {
        this.isAddSourceOpen = false;
        this.showAddSourceBtn = -1;
        this.oldAddSourceBtn = -1;
      } else {
        this.showAddSourceBtn = index;
        this.oldAddSourceBtn = index;
      }
    }
  }


  getQuickView(FinancePayReq_Id:any,link:any) {  
    let params = {
      FinancePayReq_Id: FinancePayReq_Id,
      link_id: link
    }
    this.presentLoadingDefault(true);
    this.authService.postData(params, 'payment/getFinancePaymentBudgetHistory').then((result) => {
      this.paymentBudgetHistory = result;
      console.log(this.paymentBudgetHistory);

      this.presentLoadingDefault(false);
      
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });
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

