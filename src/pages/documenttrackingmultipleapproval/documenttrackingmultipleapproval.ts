import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, Modal, ModalController, ModalOptions, ViewController } from 'ionic-angular';
import { DashboardPage } from '../dashboard/dashboard';
import { RestProvider } from '../../providers/rest/rest';
import * as moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-documenttrackingmultipleapproval',
  templateUrl: 'documenttrackingmultipleapproval.html',
})

export class DocumentTrackingMultipleApprovalPage {
  
  searchdocumenttrackingdetails: any;
  documenttrackingdetails: any;

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
  Data = this.navParams.get('data');

  searchData = { "search_value": "" };

  lpoManagerList: any;
  mlist: any;  
  payment_request_id_arr = [];
  multiple_approval_comment_modal = 'none';

  commonmasterlist: any;
  commonmasterlist1: any;

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

  documentTrackingdetails() {
    let Data = this.navParams.get('data');
    let params = {
      user_info_id: this.user.UserInfoId,
      resource_type_id: this.resourcedetails.TYPE_ID,
      resource_type_user: this.resourcedetails.TYPE_USER,
      resource_id: this.resourcedetails.RESOURCE_ID,
      type: Data[0].type
    };

    this.presentLoadingDefault(true);
    this.authService.postData(params, 'documenttracking/getDocumentTrackingListByLabel').then((result) => {

      this.documenttrackingdetails = result;

      if (this.documenttrackingdetails.length > 0) {

        let length = 1;

        for (let i = 0; i < this.documenttrackingdetails.length; i++) {

          this.documenttrackingdetails[i].ENABLE_STATUS_VISIBLE = 0;
          this.documenttrackingdetails[i].ENABLE_STATUS = 1;
          this.documenttrackingdetails[i].STATUS_NAME = '';
          this.documenttrackingdetails[i].TOOL_TIP = '';

          this.documenttrackingdetails[i].ENABLE_STATUS_1_VISIBLE = 0;
          this.documenttrackingdetails[i].ENABLE_STATUS_1 = 1;
          this.documenttrackingdetails[i].STATUS_NAME_1 = '';
          this.documenttrackingdetails[i].TOOL_TIP_1 = '';

          this.documenttrackingdetails[i].ENABLE_STATUS_2_VISIBLE = 0;
          this.documenttrackingdetails[i].ENABLE_STATUS_2 = 1;
          this.documenttrackingdetails[i].STATUS_NAME_2 = '';
          this.documenttrackingdetails[i].TOOL_TIP_2 = '';

          this.documenttrackingdetails[i].ENABLE_STATUS_3_VISIBLE = 0;
          this.documenttrackingdetails[i].ENABLE_STATUS_3 = 1;
          this.documenttrackingdetails[i].STATUS_NAME_3 = '';
          this.documenttrackingdetails[i].TOOL_TIP_3 = '';

          this.documenttrackingdetails[i].ENABLE_STATUS_HOLD_VISIBLE = 0;
          this.documenttrackingdetails[i].ENABLE_STATUS_HOLD = 1;
          this.documenttrackingdetails[i].STATUS_NAME_HOLD = '';
          this.documenttrackingdetails[i].TOOL_TIP_HOLD = '';

          if (this.documenttrackingdetails[i].STATUS == 0) {

            this.documenttrackingdetails[i].ENABLE_STATUS = 1;
            this.documenttrackingdetails[i].STATUS_NAME = "Pending for sent to client sign";

            if (this.resourcedetails.TYPE_ID == 10 || this.resourcedetails.TYPE_ID == 14 || this.user.UserInfoId == 2) {
              this.documenttrackingdetails[i].ENABLE_STATUS = 1;
            } else {
              this.documenttrackingdetails[i].ENABLE_STATUS = 0;
              this.documenttrackingdetails[i].TOOL_TIP = "Only Leasing user can update";
            }

          } else if (this.documenttrackingdetails[i].STATUS == 1) {

            this.documenttrackingdetails[i].ENABLE_STATUS = 1;
            this.documenttrackingdetails[i].STATUS_NAME = "Pending to Receive from client";

            if (this.resourcedetails.TYPE_ID == 10 || this.resourcedetails.TYPE_ID == 14 || this.user.UserInfoId == 2) {
              this.documenttrackingdetails[i].ENABLE_STATUS = 1;
            } else {
              this.documenttrackingdetails[i].ENABLE_STATUS = 0;
              this.documenttrackingdetails[i].TOOL_TIP = "Only Leasing user can update";
            }

          } else if (this.documenttrackingdetails[i].STATUS == 2) {

            this.documenttrackingdetails[i].ENABLE_STATUS = 1;
            this.documenttrackingdetails[i].STATUS_NAME = "Pending to sent for Mgmt Sign";

            if (this.resourcedetails.TYPE_ID == 10 || this.resourcedetails.TYPE_ID == 14 || this.user.UserInfoId == 2) {
              this.documenttrackingdetails[i].ENABLE_STATUS = 1;
            } else {
              this.documenttrackingdetails[i].ENABLE_STATUS = 0;
              this.documenttrackingdetails[i].TOOL_TIP = "Only Leasing user can update";
            }

          } else if (this.documenttrackingdetails[i].STATUS == 3) {

            if (this.documenttrackingdetails[i].LEASE_TYPE_CODE != 'GRS' && this.documenttrackingdetails[i].ATTRIBUTE2 == 0) {

              this.documenttrackingdetails[i].STATUS_NAME = "Pending to Receive From Landlord Sign";

              if (this.resourcedetails.TYPE_ID == 8 || this.resourcedetails.TYPE_ID == 22 || this.resourcedetails.TYPE_ID == 43 || this.resourcedetails.TYPE_ID == 44 || this.resourcedetails.TYPE_ID == 14 || this.user.UserInfoId == 2) {
                this.documenttrackingdetails[i].ENABLE_STATUS = 1;
              } else {
                this.documenttrackingdetails[i].ENABLE_STATUS = 0;
                this.documenttrackingdetails[i].TOOL_TIP = "Only CEO/COO or CEO-Office or Leasing Mgr user can update";
              }

              if (this.documenttrackingdetails[i].PROPERTY_NAME != "AJMAN" && this.documenttrackingdetails[i].PROPERTY_NAME != "Ajman" && this.documenttrackingdetails[i].ATTRIBUTE1 != 'Parking') {

                if (this.documenttrackingdetails[i].EJARI == 0) {

                  this.documenttrackingdetails[i].ENABLE_STATUS_2_VISIBLE = 1;
                  this.documenttrackingdetails[i].STATUS_NAME_2 = " /Request for Ejari";

                  if (this.resourcedetails.TYPE_ID == 10 || this.resourcedetails.TYPE_ID == 14 || this.user.UserInfoId == 2) {
                    this.documenttrackingdetails[i].ENABLE_STATUS_2 = 1;
                  } else {
                    this.documenttrackingdetails[i].ENABLE_STATUS_2 = 0;
                    this.documenttrackingdetails[i].TOOL_TIP_2 = "Only Leasing type user can request";
                  }

                } else if (this.documenttrackingdetails[i].EJARI == 1) {

                  this.documenttrackingdetails[i].ENABLE_STATUS_2_VISIBLE = 1;
                  this.documenttrackingdetails[i].STATUS_NAME_2 = " /Check the contract";

                  if (!(this.resourcedetails.TYPE_ID == 43 || this.resourcedetails.TYPE_ID == 44 || this.user.UserInfoId == 2)) {
                    this.documenttrackingdetails[i].ENABLE_STATUS_2 = 0;
                    this.documenttrackingdetails[i].TOOL_TIP_2 = "Only CEO-office user can update";
                  }

                } else if (this.documenttrackingdetails[i].EJARI == 2) {

                  this.documenttrackingdetails[i].ENABLE_STATUS_2_VISIBLE = 1;
                  this.documenttrackingdetails[i].STATUS_NAME_2 = " /Pending for COO/CEO Approval";

                  if (!(this.resourcedetails.TYPE_ID == 8 || this.resourcedetails.TYPE_ID == 22 || this.user.UserInfoId == 2)) {
                    this.documenttrackingdetails[i].ENABLE_STATUS_2 = 0;
                    this.documenttrackingdetails[i].TOOL_TIP_2 = "Only CEO/COO type user can update";
                  }

                } else if (this.documenttrackingdetails[i].EJARI == 3) {

                  if (this.documenttrackingdetails[i].EJARI_COUNT == 0) {

                    this.documenttrackingdetails[i].ENABLE_STATUS_3_VISIBLE = 1;
                    this.documenttrackingdetails[i].STATUS_NAME_3 = " /Upload Ejari";

                    if (!(this.resourcedetails.TYPE_ID == 10 || this.resourcedetails.TYPE_ID == 14 || this.user.UserInfoId == 2)) {
                      this.documenttrackingdetails[i].ENABLE_STATUS_3 = 0;
                      this.documenttrackingdetails[i].TOOL_TIP_3 = "Only Leasing team can upload";
                    }
                  } else {
                    this.documenttrackingdetails[i].ENABLE_STATUS_3_VISIBLE = 1;
                    this.documenttrackingdetails[i].STATUS_NAME_3 = " /Ejari Completed";
                  }
                }
              }
            } else {
              this.documenttrackingdetails[i].ENABLE_STATUS = 1;
              this.documenttrackingdetails[i].STATUS_NAME = "Sent for Mgmt Sign, To be Received";

              if (this.resourcedetails.TYPE_ID == 8 || this.resourcedetails.TYPE_ID == 22 || this.resourcedetails.TYPE_ID == 43 || this.resourcedetails.TYPE_ID == 44 || this.user.UserInfoId == 2) {
                this.documenttrackingdetails[i].ENABLE_STATUS = 1;
              } else {
                this.documenttrackingdetails[i].ENABLE_STATUS = 0;
                this.documenttrackingdetails[i].TOOL_TIP = "Only CEO/COO or CEO-Office user can update";
              }

              if (this.documenttrackingdetails[i].PROPERTY_NAME != "AJMAN" && this.documenttrackingdetails[i].PROPERTY_NAME != "Ajman" && this.documenttrackingdetails[i].ATTRIBUTE1 != 'Parking') {

                if (this.documenttrackingdetails[i].EJARI == 0) {

                  this.documenttrackingdetails[i].ENABLE_STATUS_2_VISIBLE = 1;
                  this.documenttrackingdetails[i].STATUS_NAME_2 = " /Request for Ejari";

                  if (this.resourcedetails.TYPE_ID == 10 || this.resourcedetails.TYPE_ID == 14 || this.user.UserInfoId == 2) {
                    this.documenttrackingdetails[i].ENABLE_STATUS_2 = 1;
                  } else {
                    this.documenttrackingdetails[i].ENABLE_STATUS_2 = 0;
                    this.documenttrackingdetails[i].TOOL_TIP_2 = "Only Leasing type user can request";
                  }

                } else if (this.documenttrackingdetails[i].EJARI == 1) {

                  this.documenttrackingdetails[i].ENABLE_STATUS_2_VISIBLE = 1;
                  this.documenttrackingdetails[i].STATUS_NAME_2 = " /Check the contract";

                  if (!(this.resourcedetails.TYPE_ID == 43 || this.resourcedetails.TYPE_ID == 44 || this.user.UserInfoId == 2)) {
                    this.documenttrackingdetails[i].ENABLE_STATUS_2 = 0;
                    this.documenttrackingdetails[i].TOOL_TIP_2 = "Only CEO-office user can update";
                  }

                } else if (this.documenttrackingdetails[i].EJARI == 2) {

                  this.documenttrackingdetails[i].ENABLE_STATUS_2_VISIBLE = 1;
                  this.documenttrackingdetails[i].STATUS_NAME_2 = "Pending for COO/CEO Approval";

                  if (!(this.resourcedetails.TYPE_ID == 8 || this.resourcedetails.TYPE_ID == 22 || this.user.UserInfoId == 2)) {
                    this.documenttrackingdetails[i].ENABLE_STATUS_2 = 0;
                    this.documenttrackingdetails[i].TOOL_TIP_2 = "Only CEO/COO type user can update";
                  }

                } else if (this.documenttrackingdetails[i].EJARI == 3) {

                  if (this.documenttrackingdetails[i].EJARI_COUNT == 0) {

                    this.documenttrackingdetails[i].ENABLE_STATUS_3_VISIBLE = 1;
                    this.documenttrackingdetails[i].STATUS_NAME_3 = " /Upload Ejari";

                    if (!(this.resourcedetails.TYPE_ID == 10 || this.resourcedetails.TYPE_ID == 14 || this.user.UserInfoId == 2)) {
                      this.documenttrackingdetails[i].ENABLE_STATUS_3 = 0;
                      this.documenttrackingdetails[i].TOOL_TIP_3 = "Only Leasing team can upload";
                    }

                  } else if (this.documenttrackingdetails[i].EJARI_COUNT == 1) {
                    this.documenttrackingdetails[i].ENABLE_STATUS_3_VISIBLE = 1;
                    this.documenttrackingdetails[i].STATUS_NAME_3 = " /Ejari Completed";
                  }
                }
              }
            }

          } else if(this.documenttrackingdetails[i].STATUS == 13){

            this.documenttrackingdetails[i].ENABLE_STATUS = 1;
            this.documenttrackingdetails[i].STATUS_NAME = "Pending for CEO/COO Approval";

            if(this.resourcedetails.TYPE_ID == 14 || this.user.UserInfoId == 2){
              this.documenttrackingdetails[i].ENABLE_STATUS_HOLD_VISIBLE = 1;
              this.documenttrackingdetails[i].STATUS_NAME_HOLD = "/Hold";
            }

            if (this.resourcedetails.TYPE_ID == 8 || this.resourcedetails.TYPE_ID == 22 || this.user.UserInfoId == 2) {
              this.documenttrackingdetails[i].ENABLE_STATUS = 1;
            } else {
              this.documenttrackingdetails[i].ENABLE_STATUS = 0;
              this.documenttrackingdetails[i].TOOL_TIP = "Only CEO/COO can update";
            }
            
          }else if (this.documenttrackingdetails[i].STATUS == 4) {

            this.documenttrackingdetails[i].ENABLE_STATUS = 1;
            this.documenttrackingdetails[i].STATUS_NAME = "Received from mgmt sign";

            if (this.resourcedetails.TYPE_ID == 8 || this.resourcedetails.TYPE_ID == 8 || this.resourcedetails.TYPE_ID == 43 || this.resourcedetails.TYPE_ID == 44 || this.user.UserInfoId == 2) {
              this.documenttrackingdetails[i].ENABLE_STATUS = 1;
            } else {
              this.documenttrackingdetails[i].ENABLE_STATUS = 0;
            }

            if (this.documenttrackingdetails[i].PROPERTY_NAME != "AJMAN") {

              if (this.documenttrackingdetails[i].EJARI == 1) {

                this.documenttrackingdetails[i].ENABLE_STATUS_2_VISIBLE = 1;
                this.documenttrackingdetails[i].STATUS_NAME_2 = "Check the contract";

                if (!(this.resourcedetails.TYPE_ID == 43 || this.resourcedetails.TYPE_ID == 44 || this.user.UserInfoId == 2)) {
                  this.documenttrackingdetails[i].ENABLE_STATUS_2 = 0;
                  this.documenttrackingdetails[i].TOOL_TIP_2 = "Only CEO-office user can update";
                }

              } else if (this.documenttrackingdetails[i].EJARI == 2) {

                this.documenttrackingdetails[i].ENABLE_STATUS_2_VISIBLE = 1;
                this.documenttrackingdetails[i].STATUS_NAME_2 = "Pending for COO/CEO Approval";

                if (!(this.resourcedetails.TYPE_ID == 8 || this.resourcedetails.TYPE_ID == 22 || this.user.UserInfoId == 2)) {
                  this.documenttrackingdetails[i].ENABLE_STATUS_2 = 0;
                  this.documenttrackingdetails[i].TOOL_TIP_2 = "Only CEO/COO type user can update";
                }
              } else if (this.documenttrackingdetails[i].EJARI == 3) {

                if (this.documenttrackingdetails[i].EJARI_COUNT == 0) {

                  this.documenttrackingdetails[i].ENABLE_STATUS_3_VISIBLE = 1;
                  this.documenttrackingdetails[i].STATUS_NAME_3 = " /Upload Ejari";

                  if (!(this.resourcedetails.TYPE_ID == 10 || this.resourcedetails.TYPE_ID == 14 || this.user.UserInfoId == 2)) {
                    this.documenttrackingdetails[i].ENABLE_STATUS_3 = 0;
                    this.documenttrackingdetails[i].TOOL_TIP_3 = "Only Leasing team can upload";

                  } else if (this.documenttrackingdetails[i].EJARI_COUNT == 1) {
                    this.documenttrackingdetails[i].ENABLE_STATUS_3_VISIBLE = 1;
                    this.documenttrackingdetails[i].STATUS_NAME_3 = " /Ejari Completed";
                  }
                }
              }
            }

          } else if (this.documenttrackingdetails[i].STATUS == 5) {

            if (this.documenttrackingdetails[i].FILED == 0) {

              this.documenttrackingdetails[i].ENABLE_STATUS_1_VISIBLE = 1;
              this.documenttrackingdetails[i].STATUS_NAME_1 = "/Pending for signed and filed";

              if (this.resourcedetails.TYPE_ID == 8 || this.resourcedetails.TYPE_ID == 22 || this.resourcedetails.TYPE_ID == 43 || this.resourcedetails.TYPE_ID == 44 || this.user.UserInfoId == 2) {
                this.documenttrackingdetails[i].ENABLE_STATUS_1 = 1;
              }
              else {
                if (this.documenttrackingdetails[i].PROPERTY_NAME != "AJMAN" && this.documenttrackingdetails[i].PROPERTY_NAME != "Ajman") {

                  if (this.resourcedetails.TYPE_ID == 14) {
                    this.documenttrackingdetails[i].ENABLE_STATUS_1 = 1;
                  } else {
                    this.documenttrackingdetails[i].ENABLE_STATUS_1 = 0;
                    this.documenttrackingdetails[i].TOOL_TIP_1 = "Only CEO/COO or CEO-Office or Leasing MGR user can update";
                  }
                } else {
                  this.documenttrackingdetails[i].ENABLE_STATUS_1 = 0;
                  this.documenttrackingdetails[i].TOOL_TIP_1 = "Only CEO/COO or CEO-Office user can update";
                }
              }
            } else {
              this.documenttrackingdetails[i].ENABLE_STATUS_1_VISIBLE = 0;
            }

            if (this.documenttrackingdetails[i].CUST_DISP == 1) {

              this.documenttrackingdetails[i].ENABLE_STATUS = 1;
              this.documenttrackingdetails[i].STATUS_NAME = "Pending for client dispatch";

              if (this.resourcedetails.TYPE_ID == 10 || this.resourcedetails.TYPE_ID == 14 || this.user.UserInfoId == 2) {
                this.documenttrackingdetails[i].ENABLE_STATUS = 1;
              } else {
                this.documenttrackingdetails[i].ENABLE_STATUS = 0;
              }

            } else if (this.documenttrackingdetails[i].CUST_DISP == 0) {

              this.documenttrackingdetails[i].ENABLE_STATUS = 1;
              this.documenttrackingdetails[i].STATUS_NAME = "Handover to Leasing For Client Copy Dispatch";

              if (this.resourcedetails.TYPE_ID == 8 || this.resourcedetails.TYPE_ID == 22 || this.resourcedetails.TYPE_ID == 43 || this.resourcedetails.TYPE_ID == 44 || this.user.UserInfoId == 2) {
                this.documenttrackingdetails[i].ENABLE_STATUS = 1;
              } else {
                this.documenttrackingdetails[i].ENABLE_STATUS = 0;
                this.documenttrackingdetails[i].TOOL_TIP = "Only CEO/COO or CEO-Office user can update";
              }

            } else {
              this.documenttrackingdetails[i].ENABLE_STATUS_VISIBLE = 0;
            }

            if (this.documenttrackingdetails[i].FILED == 1 && this.documenttrackingdetails[i].CUST_DISP == 2) {

              this.documenttrackingdetails[i].ENABLE_STATUS_1_VISIBLE = 0;
              this.documenttrackingdetails[i].ENABLE_STATUS_VISIBLE = 1;
              this.documenttrackingdetails[i].ENABLE_STATUS = 0;
              this.documenttrackingdetails[i].STATUS_NAME = 'Completed';

            }

            if (this.documenttrackingdetails[i].PROPERTY_NAME != "AJMAN" && this.documenttrackingdetails[i].PROPERTY_NAME != "Ajman" && this.documenttrackingdetails[i].ATTRIBUTE1 != "Parking") {
              if (this.documenttrackingdetails[i].EJARI_COUNT == 0) {

                this.documenttrackingdetails[i].ENABLE_STATUS_3_VISIBLE = 1;
                this.documenttrackingdetails[i].STATUS_NAME_3 = " /Upload Ejari";

                if (!(this.resourcedetails.TYPE_ID == 10 || this.resourcedetails.TYPE_ID == 14 || this.user.UserInfoId == 2)) {
                  this.documenttrackingdetails[i].ENABLE_STATUS_3 = 0;
                  this.documenttrackingdetails[i].TOOL_TIP_3 = "Only Leasing team can upload";
                }
              } else {
                this.documenttrackingdetails[i].ENABLE_STATUS_3_VISIBLE = 1;
                this.documenttrackingdetails[i].STATUS_NAME_3 = " /Ejari Completed";
              }
            }

          } else if (this.documenttrackingdetails[i].STATUS == 6) {

            this.documenttrackingdetails[i].ENABLE_STATUS = 0;
            this.documenttrackingdetails[i].STATUS_NAME = "Completed";

            if (this.documenttrackingdetails[i].PROPERTY_NAME != "AJMAN" && this.documenttrackingdetails[i].PROPERTY_NAME != "Ajman" && this.documenttrackingdetails[i].ATTRIBUTE1 != "Parking") {
              if (this.documenttrackingdetails[i].EJARI_COUNT == 0) {

                this.documenttrackingdetails[i].ENABLE_STATUS_3_VISIBLE = 1;
                this.documenttrackingdetails[i].STATUS_NAME_3 = " /Upload Ejari";

                if (!(this.resourcedetails.TYPE_ID == 10 || this.resourcedetails.TYPE_ID == 14 || this.user.UserInfoId == 2)) {
                  this.documenttrackingdetails[i].ENABLE_STATUS_3 = 0;
                  this.documenttrackingdetails[i].TOOL_TIP_3 = "Only Leasing team can upload";

                } else if (this.documenttrackingdetails[i].EJARI_COUNT == 1) {
                  this.documenttrackingdetails[i].ENABLE_STATUS_3_VISIBLE = 1;
                  this.documenttrackingdetails[i].STATUS_NAME_3 = " /Ejari Completed";
                }
              }
            }
          }

          if (length == this.documenttrackingdetails.length) {
            this.searchdocumenttrackingdetails = this.documenttrackingdetails;
            console.log(this.searchdocumenttrackingdetails);
            this.presentLoadingDefault(false);
          }

          length++;

        }
        this.presentLoadingDefault(false);
        
      } else {
        this.presentLoadingDefault(false);
        this.presentToast('No Records to show');
      }

    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });
  }


  getLpoManagerList() {
    let params = {
      user_info_id: this.user.UserInfoId
    };

    this.authService.postData(params, 'payment/getLpoManagerList').then((result) => {
      this.lpoManagerList = result;
      console.log(this.lpoManagerList);

    }, (err) => {
      this.presentToast(err);
    });
  }

  ionViewDidLoad() {
    this.documentTrackingdetails();
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


  onCloseBill_comment_modal() {
    this.Bill_comment_modal = 'none';
  }


  SearchrtcaseDetail() {
    let case_val = this.searchData.search_value;
    if (case_val != '') {
      let filterData = this.documenttrackingdetails.filter(item => this.filter(item));
      this.searchdocumenttrackingdetails = filterData;
    } else {
      this.searchdocumenttrackingdetails = this.documenttrackingdetails
    }
    console.log(this.documenttrackingdetails);
  }

  filter(item) {
    let _val = this.searchData.search_value;
    let _case_val = item['BUILD_CODE'] ? item['BUILD_CODE'].toString().toUpperCase() : '';
    let _lease_val = item['PROPERTY_NAME'] ? item['PROPERTY_NAME'].toString().toUpperCase() : '';
    let _cno_val = item['LEASE_ID'] ? item['LEASE_ID'].toString().toUpperCase() : '';
    return (_case_val.includes(_val.toUpperCase()) || _lease_val.includes(_val.toUpperCase()) || _cno_val.includes(_val.toUpperCase()));
  }



  updatefinancepaymentstatus(LEASE_ID: any, DOCUMENT_DETAIL: any) {

    console.log(DOCUMENT_DETAIL);

    // if(ENABLE_STATUS == 0) {
    //     this.presentToast(TOOL_TIP);
    //     return;

    // } else {

    //     const myModalOptions: ModalOptions = {
    //         enableBackdropDismiss: false
    //     };

    //     let myModalData = [{
    //         PAYMENT_REQUEST_ID: PAYMENT_REQUEST_ID,
    //         PAYMENT_DETAIL: PAYMENT_DETAIL
    //     }];

    //     let myModal: Modal = this.modal.create('DocumentTrackingStatusUpdatePage', { data: myModalData }, myModalOptions);

    //     myModal.present();

    //     myModal.onWillDismiss(() => {
    //         this.ionViewDidLoad();
    //     });
    // }

  }

  lnkstatus_click(LEASE_ID: any, DOCUMENT_DETAIL: any) {
    console.log('lnkstatus');

    if (DOCUMENT_DETAIL.ENABLE_STATUS == 0) {
      this.presentToast(DOCUMENT_DETAIL.TOOL_TIP);
      return;

    } else {

      const myModalOptions: ModalOptions = {
        enableBackdropDismiss: false
      };

      let myModalData = [{
        LEASE_ID: LEASE_ID,
        DOCUMENT_DETAIL: DOCUMENT_DETAIL,
        STATUS_TYPE: 'lnkstatus'
      }];

      let myModal: Modal = this.modal.create('DocumentTrackingStatusUpdatePage', { data: myModalData }, myModalOptions);

      myModal.present();

      myModal.onWillDismiss(() => {
        this.ionViewDidLoad();
      });
    }

  }

  lnkstatus1_click(LEASE_ID: any, DOCUMENT_DETAIL: any) {
    console.log('lnkstatus1_click');

    if (DOCUMENT_DETAIL.ENABLE_STATUS_1 == 0) {
      this.presentToast(DOCUMENT_DETAIL.TOOL_TIP_1);
      return;

    } else {

      const myModalOptions: ModalOptions = {
        enableBackdropDismiss: false
      };

      let myModalData = [{
        LEASE_ID: LEASE_ID,
        DOCUMENT_DETAIL: DOCUMENT_DETAIL,
        STATUS_TYPE: 'lnkstatus1'
      }];

      let myModal: Modal = this.modal.create('DocumentTrackingStatusUpdatePage', { data: myModalData }, myModalOptions);

      myModal.present();

      myModal.onWillDismiss(() => {
        this.ionViewDidLoad();
      });
    }

  }

  lnkstatus2_click(LEASE_ID: any, DOCUMENT_DETAIL: any) {
    console.log('lnkstatus2_click');

    if (DOCUMENT_DETAIL.ENABLE_STATUS_2 == 0) {
      this.presentToast(DOCUMENT_DETAIL.TOOL_TIP_2);
      return;

    } else {

      const myModalOptions: ModalOptions = {
        enableBackdropDismiss: false
      };

      let myModalData = [{
        LEASE_ID: LEASE_ID,
        DOCUMENT_DETAIL: DOCUMENT_DETAIL,
        STATUS_TYPE: 'lnkstatus2'
      }];

      let myModal: Modal = this.modal.create('DocumentTrackingStatusUpdatePage', { data: myModalData }, myModalOptions);

      myModal.present();

      myModal.onWillDismiss(() => {
        this.ionViewDidLoad();
      });
    }
  }

  lnkstatus3_click(LEASE_ID: any, DOCUMENT_DETAIL: any) {
    console.log('lnkstatus3_click');

    if (DOCUMENT_DETAIL.ENABLE_STATUS_3 == 0) {
      this.presentToast(DOCUMENT_DETAIL.TOOL_TIP_3);
      return;

    } else {

      const myModalOptions: ModalOptions = {
        enableBackdropDismiss: false
      };

      let myModalData = [{
        LEASE_ID: LEASE_ID,
        DOCUMENT_DETAIL: DOCUMENT_DETAIL,
        STATUS_TYPE: 'lnkstatus3'
      }];

      let myModal: Modal = this.modal.create('DocumentTrackingStatusUpdatePage', { data: myModalData }, myModalOptions);

      myModal.present();

      myModal.onWillDismiss(() => {
        this.ionViewDidLoad();
      });
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

  onClosecomment_modal() {
    this.comment_modal = 'none';
    this.multiple_approval_comment_modal = 'none';
  }

  updatepaymentstatus(TYPE: any) {

      console.log(TYPE);

      if (this.payment_request_id_arr.length > 0) {
         
          let length = 1;
          this.btnTxtApprove = "In Progress...";
          this.btnTxtReject = "In Progress...";
          this.presentLoadingDefault(true);

          for (let i = 0; i < this.payment_request_id_arr.length; i++) {
              console.log(this.payment_request_id_arr[i]);

              let params = {
                link_type: 'Document Tracking',
                text_field_3: null,
                link_id: this.payment_request_id_arr[i],
                Common_master_Id: null
              }

              this.authService.postData(params, 'documenttracking/getCommonMasterList').then((result) => {
                this.commonmasterlist1 = result;
                console.log('Common Master', this.commonmasterlist1);
                let msg = '';   
          
                if (this.commonmasterlist1.length > 0) {
          
                  if (this.commonmasterlist1[0].NUMBER_FIELD_1 == 13) {
                                                  
                    msg = "Pending to CEO/COO Approval";
                    this.insertPaymentComments('DocumentTracking STATUS', msg,this.payment_request_id_arr[i]);
                    this.commonmasterlist1[0].DATE_FIELD_2 = moment().format('DD-MMM-YYYY hh:mm:ss.SSSSSSSSS A');
          
                  }
          
                  this.commonmasterlist1[0].NUMBER_FIELD_1 = 5;
                  msg = this.COMMENTS;

                  this.insertPaymentComments('DocumentTracking COMMENT', msg,this.payment_request_id_arr[i]);
                  this.commonmasterlist1[0].MODIFIED_BY = this.user.UserInfoId;
          
                  let updatedata = [{
                    old_data: JSON.stringify(this.commonmasterlist1[0]),
                    modified_by: this.user.UserInfoId,
                    record_type: 'Edit'
                  }];
          
                  console.log('Update Data', updatedata[0]);
                  this.authService.postData(updatedata[0], 'documenttracking/getUpdateInsertCommonMaster').then((result) => {
                    this.insertedValues = result;
                    if (this.payment_request_id_arr.length == length) {
                      this.presentLoadingDefault(false);
                      this.btnTxtApprove = "Approve";
                      this.btnTxtReject = "Reject";
                      this.presentToast("Document Taracking updated successfully");
                      this.onClosecomment_modal();
                    }
                    length++;
                  }, (err) => {
                    this.presentLoadingDefault(false);
                    this.presentToast(err);
                  });
          
                } 
          
              }, (err) => {
                this.presentLoadingDefault(false);
                this.presentToast(err);
              });
          }

      }

  }


  insertPaymentComments(type: any, COMMENTS: any,LEASE_ID:any) {

    let paymentcommentsData = [{
      PAYMENT_REQUEST_ID: LEASE_ID,
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
    } else {
      console.log('Comment not inserted.');
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
