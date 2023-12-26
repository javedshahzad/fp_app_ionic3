import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController, Modal, ModalController, ModalOptions, ViewController } from 'ionic-angular';
import { DashboardPage } from '../dashboard/dashboard';
import { RestProvider } from '../../providers/rest/rest';
/**
 * Generated class for the DashboardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-commentslabels',
  templateUrl: 'commentslabels.html',
})
export class CommentsLabelsPage {
  CmtData = {
    CmtTMS: [] as any,
    CmtCMS: [] as any,
    CmtCS: [] as any,
    CmtCPR: [] as any,
    CmtRCS: [] as any,
    CmtHOTO: [] as any,
    CmtDREC: [] as any,
    CmtCM: [] as any,
    MyDataall: [] as any
  } as any;

  CmtTaskList = {
    GetAllTask: [] as any
  } as any;

  CmtCaseList = {
    GetAllCase: [] as any
  } as any;

  CmtChequeList = {
    GetAllCheque: [] as any
  } as any;

  getpaymentrequestlist = {
    PaymentReqList: [] as any
  } as any;

  CmtPaymentReqList = {
    GetAllPayment: [] as any
  } as any;

  CmtReturnChqList = {
    GetAllReturnChq: [] as any
  } as any;

  CmtHotoList = {
    GetAllHoto: [] as any
  } as any;

  CmtCallMgntList = {
    GetAllCallMgnt: [] as any
  } as any;

  CmtDrecList = {
    GetAllDrec: [] as any
  } as any;

  Taskcommentsdetailsall = {
    MyCommentDataAll: [] as any,
    MyCommentToComments: [] as any,
    MyCommentsList: [] as any
} as any;

Casecommentsdetailsall = {
    MyComments: [] as any,
    MyCommentToComments: [] as any,
    MyCommentsList: [] as any
} as any;

Chqcommentsdetailsall = {
    MyComments: [] as any,
    MyCommentToComments: [] as any,
    MyCommentsList: [] as any
} as any;

PayReqcommentsdetailsall = {
    MyComments: [] as any,
    MyCommentToComments: [] as any,
    MyCommentsList: [] as any
} as any;

Hotocommentsdetailsall = {
    MyComments: [] as any,
    MyCommentToComments: [] as any,
    MyCommentsList: [] as any
} as any;

Dreccommentsdetailsall = {
    MyComments: [] as any,
    MyCommentToComments: [] as any,
    MyCommentsList: [] as any
} as any;

CallMgntcommentsdetailsall = {
    MyComments: [] as any,
    MyCommentToComments: [] as any,
    MyCommentsList: [] as any
} as any;

//getpaymentrequestlist: any;

getpaymentreqCommentslist = {
    MyComments: [] as any,
    MyCommentToComments: [] as any,
    MyCommentsList: [] as any
} as any;

  commentsData = this.navParams.get('data');
  searchData = { "search_value": "" };
  user: any = localStorage.getItem('userData');

  Task_Comments_display = 'none';
  Case_Comments_display = 'none';
  Cheque_Comments_display = 'none';
  PaymentReq_Comments_display = 'none';
  ReturnCheque_Comments_display = 'none';
  Hoto_Comments_display = 'none';
  CallMgnt_Comments_display = 'none';
  Drec_Comments_display = 'none';

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public authService: RestProvider, public toastCtrl: ToastController, private modal: ModalController,
    public loadingCtrl: LoadingController, public view: ViewController) {
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

  returndetails() {
    let myTitle = 'Comments';
    let paramdata = {
      UserInfoId: this.user.UserInfoId,
      type: this.commentsData[0].type
    };
    this.presentLoadingDefault(true);
    this.authService.postData(paramdata, 'comments/CommentsLabelSummary').then((result) => {
      this.CmtData = result;
      this.presentLoadingDefault(false);
      // console.log(this.CmtData);
      // console.log(this.CmtData.MyDataall);
      if (this.CmtData.MyDataall.length > 0) {
       // this.presentLoadingDefault(false);
      } else {
      //  this.presentLoadingDefault(false);
        this.presentToast(`No data found in ${myTitle}`);
      }
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });
  }

  ionViewDidLoad() {
    this.returndetails();
  }

  setDisplaydata(display_type: any) {

    if (display_type == 'My Task Comments') {
      this.GetTaskList(this.commentsData[0].type);
      this.Task_Comments_display = 'block';
      this.Case_Comments_display = 'none';
      this.Cheque_Comments_display = 'none';
      this.PaymentReq_Comments_display = 'none';
      this.ReturnCheque_Comments_display = 'none';
      this.Hoto_Comments_display = 'none';
      this.CallMgnt_Comments_display = 'none';
      this.Drec_Comments_display = 'none';

    } else if (display_type == 'My Case Comments') {
      this.GetCaseList(this.commentsData[0].type);
      this.Task_Comments_display = 'none';
      this.Case_Comments_display = 'block';
      this.Cheque_Comments_display = 'none';
      this.PaymentReq_Comments_display = 'none';
      this.ReturnCheque_Comments_display = 'none';
      this.Hoto_Comments_display = 'none';
      this.CallMgnt_Comments_display = 'none';
      this.Drec_Comments_display = 'none';

    } else if (display_type == 'My Cheque Comments') {
      this.GetChequeList(this.commentsData[0].type);
      this.Task_Comments_display = 'none';
      this.Case_Comments_display = 'none';
      this.Cheque_Comments_display = 'block';
      this.PaymentReq_Comments_display = 'none';
      this.ReturnCheque_Comments_display = 'none';
      this.Hoto_Comments_display = 'none';
      this.CallMgnt_Comments_display = 'none';
      this.Drec_Comments_display = 'none';

    } else if (display_type == 'My PaymentReq Comments') {
      this.GetPaymentReqList(this.commentsData[0].type);
      this.Task_Comments_display = 'none';
      this.Case_Comments_display = 'none';
      this.Cheque_Comments_display = 'none';
      this.PaymentReq_Comments_display = 'block';
      this.ReturnCheque_Comments_display = 'none';
      this.Hoto_Comments_display = 'none';
      this.CallMgnt_Comments_display = 'none';
      this.Drec_Comments_display = 'none';

    } else if (display_type == 'My ReturnCheque Comments') {
      this.GetReturnChqList(this.commentsData[0].type);
      this.Task_Comments_display = 'none';
      this.Case_Comments_display = 'none';
      this.Cheque_Comments_display = 'none';
      this.PaymentReq_Comments_display = 'none';
      this.ReturnCheque_Comments_display = 'block';
      this.Hoto_Comments_display = 'none';
      this.CallMgnt_Comments_display = 'none';
      this.Drec_Comments_display = 'none';

    } else if (display_type == 'My Hoto Comments') {
      this.GetHotoList(this.commentsData[0].type);
      this.Task_Comments_display = 'none';
      this.Case_Comments_display = 'none';
      this.Cheque_Comments_display = 'none';
      this.PaymentReq_Comments_display = 'none';
      this.ReturnCheque_Comments_display = 'none';
      this.Hoto_Comments_display = 'block';
      this.CallMgnt_Comments_display = 'none';
      this.Drec_Comments_display = 'none';

    } else if (display_type == 'My CallMgnt Comments') {
      this.GetCallMgntList(this.commentsData[0].type);
      this.Task_Comments_display = 'none';
      this.Case_Comments_display = 'none';
      this.Cheque_Comments_display = 'none';
      this.PaymentReq_Comments_display = 'none';
      this.ReturnCheque_Comments_display = 'none';
      this.Hoto_Comments_display = 'none';
      this.CallMgnt_Comments_display = 'block';
      this.Drec_Comments_display = 'none';

    } else if (display_type == 'My Drec Comments') {
      this.GetDrecList(this.commentsData[0].type);
      this.Task_Comments_display = 'none';
      this.Case_Comments_display = 'none';
      this.Cheque_Comments_display = 'none';
      this.PaymentReq_Comments_display = 'none';
      this.ReturnCheque_Comments_display = 'none';
      this.Hoto_Comments_display = 'none';
      this.CallMgnt_Comments_display = 'none';
      this.Drec_Comments_display = 'block';

    }


  }

  showPayReqCmtBtn = -1;
  isPayReqCmtOpen = false;
  oldPayReqCmtBtn = -1;
  showPayReqCmtUndoBtn(index, CASE_REQUEST_ID: any) {

    this.GetPaymentRequestList(CASE_REQUEST_ID, this.commentsData[0].type);

    if (this.isPayReqCmtOpen == false) {
      this.isPayReqCmtOpen = true;
      this.oldPayReqCmtBtn = index;
      this.showPayReqCmtBtn = index;
    } else {
      if (this.oldPayReqCmtBtn == index) {
        this.isPayReqCmtOpen = false;
        this.showPayReqCmtBtn = -1;
        this.oldPayReqCmtBtn = -1;
      } else {
        this.showPayReqCmtBtn = index;
        this.oldPayReqCmtBtn = index;
      }
    }
  }


  GetPaymentRequestList(CASE_REQUEST_ID: any, LABEL_TYPE: any) {

    this.presentLoadingDefault(true);

    let userdata = {
      UserInfoId: this.user.UserInfoId,
      UserEmployeeId: this.user.UserEmployeeId,
      case_request_id: CASE_REQUEST_ID,
      label_type: LABEL_TYPE
    }
    this.authService.postData(userdata, 'comments/PaymentList').then((result) => {
      this.getpaymentrequestlist = result;
      this.presentLoadingDefault(false);
      console.log('PaymentReq', this.getpaymentrequestlist);     

    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });
  }


  GetTaskList(LABEL_TYPE: any) {
    this.presentLoadingDefault(true);
    let userdata = {
      UserInfoId: this.user.UserInfoId,
      UserEmployeeId: this.user.UserEmployeeId,
      label_type: LABEL_TYPE
    }
    this.authService.postData(userdata, 'comments/CommentsTaskList').then((result) => {
      this.CmtTaskList = result;
      this.presentLoadingDefault(false);
      console.log('ChqComment', this.CmtTaskList);
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });
  }

  GetCaseList(LABEL_TYPE: any) {
    this.presentLoadingDefault(true);
    let userdata = {
      UserInfoId: this.user.UserInfoId,
      UserEmployeeId: this.user.UserEmployeeId,
      label_type: LABEL_TYPE
    }
    this.authService.postData(userdata, 'comments/CommentsCaseList').then((result) => {
      this.CmtCaseList = result;
      this.presentLoadingDefault(false);
      console.log('ChqComment', this.CmtCaseList);
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });
  }

  GetChequeList(LABEL_TYPE: any) {
    this.presentLoadingDefault(true);
    let userdata = {
      UserInfoId: this.user.UserInfoId,
      UserEmployeeId: this.user.UserEmployeeId,
      label_type: LABEL_TYPE
    }
    this.authService.postData(userdata, 'comments/CommentsChequeList').then((result) => {
      this.CmtChequeList = result;
      this.presentLoadingDefault(false);
      console.log('ChqComment', this.CmtChequeList);
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });
  }

  GetPaymentReqList(LABEL_TYPE: any) {
    this.presentLoadingDefault(true);
    let userdata = {
      UserInfoId: this.user.UserInfoId,
      UserEmployeeId: this.user.UserEmployeeId,
      label_type: LABEL_TYPE
    }
    this.authService.postData(userdata, 'comments/CommentsPaymentRequestList').then((result) => {
      this.CmtPaymentReqList = result;
      this.presentLoadingDefault(false);
      console.log('ChqComment', this.CmtPaymentReqList);
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });
  }

  GetReturnChqList(LABEL_TYPE: any) {
    this.presentLoadingDefault(true);
    let userdata = {
      UserInfoId: this.user.UserInfoId,
      UserEmployeeId: this.user.UserEmployeeId,
      label_type: LABEL_TYPE
    }
    this.authService.postData(userdata, 'comments/CommentsReturnChqList').then((result) => {
      this.CmtReturnChqList = result;
      this.presentLoadingDefault(false);
      console.log('ChqComment', this.CmtReturnChqList);
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });
  }

  GetHotoList(LABEL_TYPE: any) {
    this.presentLoadingDefault(true);
    let userdata = {
      UserInfoId: this.user.UserInfoId,
      UserEmployeeId: this.user.UserEmployeeId,
      label_type: LABEL_TYPE
    }
    this.authService.postData(userdata, 'comments/CommentsHotoList').then((result) => {
      this.CmtHotoList = result;
      this.presentLoadingDefault(false);
      console.log('ChqComment', this.CmtHotoList);
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });

  }

  GetCallMgntList(LABEL_TYPE: any) {
    this.presentLoadingDefault(true);
    let userdata = {
      UserInfoId: this.user.UserInfoId,
      UserEmployeeId: this.user.UserEmployeeId,
      label_type: LABEL_TYPE
    }
    this.authService.postData(userdata, 'comments/CommentsCallMgntList').then((result) => {
      this.CmtCallMgntList = result;
      this.presentLoadingDefault(false);
      console.log('ChqComment', this.CmtCallMgntList);
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });

  }


  GetDrecList(LABEL_TYPE: any) {
    this.presentLoadingDefault(true);
    let userdata = {
      UserInfoId: this.user.UserInfoId,
      UserEmployeeId: this.user.UserEmployeeId,
      label_type: LABEL_TYPE
    }
    this.authService.postData(userdata, 'comments/CommentsDrecList').then((result) => {
      this.CmtDrecList = result;
      this.presentLoadingDefault(false);
      console.log('ChqComment', this.CmtDrecList);
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });

  }



  openTaskCommentModal(TASK_ID: any) {
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let myModalData = [{
      TASK_ID: TASK_ID,
      task_data_val: this.CmtTaskList.GetAllTask.filter(item => item.TASK_ID === TASK_ID)
    }];

    let myModal: Modal = this.modal.create('TaskCommentPage', { data: myModalData }, myModalOptions);

    myModal.present();

    myModal.onDidDismiss((data) => {
      // console.log("I have dismissed.");
      // console.log(data);
    });

    myModal.onWillDismiss((data) => {
      // console.log("I'm about to dismiss");
      // console.log(data);
    });
  }


  openCaseCommentModal(CASE_REQUEST_ID: any, CASE_ID) {

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let myModalData = [{
      CASE_REQ_ID: CASE_REQUEST_ID,
      CASE_ID: CASE_ID
    }];

    let myModal: Modal = this.modal.create('CaseModalPage', { data: myModalData }, myModalOptions);

    myModal.present();

    myModal.onDidDismiss((data) => {
      // console.log("I have dismissed.");
      // console.log(data);
    });

    myModal.onWillDismiss((data) => {
      // console.log("I'm about to dismiss");
      // console.log(data);
    });

  }

  openChequeListCommentModal(ID: any) {

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let myModalData = [{
      ID: ID
    }];

    let myModal: Modal = this.modal.create('ChequeCommentPage', { data: myModalData }, myModalOptions);


    myModal.onWillDismiss(() => {
      //   this.chequelistdetails();
    });
    myModal.present();

  }


  openPaymentRequestCommentModal(PAYMENT_REQUEST_ID: any, type: any, PAYMENT_REQ_BILL_ID: any) {

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let myModalData = [{
      PAYMENT_REQUEST_ID: PAYMENT_REQUEST_ID,
      type: type,
      PAYMENT_REQ_BILL_ID: PAYMENT_REQ_BILL_ID
    }];

    let myModal: Modal = this.modal.create('PaymentModalPage', { data: myModalData }, myModalOptions);

    myModal.present();


    myModal.onWillDismiss(() => {
      this.ionViewDidLoad();
      // console.log("I'm about to dismiss");
      // console.log(data);
    });

  }

  openReturnChequeCommentModal(CASH_RECEIPT_ID: any, ESCLATED_COUNT: any) {

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let myModalData = [{
      CASH_RECEIPT_ID: CASH_RECEIPT_ID,
      ESCLATED_COUNT: ESCLATED_COUNT
    }];

    let myModal: Modal = this.modal.create('ReturnCommentPage', { data: myModalData }, myModalOptions);

    myModal.present();

    myModal.onDidDismiss((data) => {
      // console.log("I have dismissed.");
      // console.log(data);
    });

    myModal.onWillDismiss((data) => {
      // console.log("I'm about to dismiss");
      // console.log(data);
    });

  }

  openHotoCommentModal(LEASE_NUM: any, HANDOVER_ID: any) {

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let myModalData = [{
      LEASE_NUM: LEASE_NUM,
      HOTO_ID: HANDOVER_ID
    }];

    let myModal: Modal = this.modal.create('HotoCommentPage', { data: myModalData }, myModalOptions);

    myModal.present();

    myModal.onDidDismiss((data) => {
      // console.log("I have dismissed.");
      // console.log(data);
    });

    myModal.onWillDismiss((data) => {
      // console.log("I'm about to dismiss");
      // console.log(data);
    });

  }


  openCallManagementModal(CALL_LOG_ID: any, STATUS_NAME: any) {
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let myModalData = [{
      CALL_LOG_ID: CALL_LOG_ID,
      STATUS_NAME: STATUS_NAME
    }];

    let myModal: Modal = this.modal.create('CallManagementCommentPage', { data: myModalData }, myModalOptions);

    myModal.present();

    myModal.onDidDismiss((data) => {
      // console.log("I have dismissed.");
      // console.log(data);
    });

    myModal.onWillDismiss((data) => {
      // console.log("I'm about to dismiss");
      // console.log(data);
    });
  }


  openDrecCommentModal(LEASE_NUM: any) {
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let myModalData = [{
      LEASE_NUM: LEASE_NUM
    }];

    let myModal: Modal = this.modal.create('DrecCommentsPage', { data: myModalData }, myModalOptions);

    myModal.present();

    myModal.onDidDismiss((data) => {
      // console.log("I have dismissed.");
      // console.log(data);
    });

    myModal.onWillDismiss((data) => {
      // console.log("I'm about to dismiss");
      // console.log(data);
    });
  }


  showTaskCmtBtn = -1;
  isTaskCmtOpen = false;
  oldTaskCmtBtn = -1;
  showTaskCommentUndoBtn(index, TASK_ID: any) {

    this.GetTaskComment(TASK_ID, this.commentsData[0].type);

    if (this.isTaskCmtOpen == false) {
      this.isTaskCmtOpen = true;
      this.oldTaskCmtBtn = index;
      this.showTaskCmtBtn = index;
    } else {
      if (this.oldTaskCmtBtn == index) {
        this.isTaskCmtOpen = false;
        this.showTaskCmtBtn = -1;
        this.oldTaskCmtBtn = -1;
      } else {
        this.showTaskCmtBtn = index;
        this.oldTaskCmtBtn = index;
      }
    }
  }

  
  showCaseCmtBtn = -1;
  isCaseCmtOpen = false;
  oldCaseCmtBtn = -1;
  showCaseCommentUndoBtn(index, CASE_ID: any) {

      this.GetCaseComment(CASE_ID, this.commentsData[0].type);

      if (this.isCaseCmtOpen == false) {
          this.isCaseCmtOpen = true;
          this.oldCaseCmtBtn = index;
          this.showCaseCmtBtn = index;
      } else {
          if (this.oldCaseCmtBtn == index) {
              this.isCaseCmtOpen = false;
              this.showCaseCmtBtn = -1;
              this.oldCaseCmtBtn = -1;
          } else {
              this.showCaseCmtBtn = index;
              this.oldCaseCmtBtn = index;
          }
      }
  }

  // Cheque List Comment data extend//

  showChqCmtBtn = -1;
  isChqCmtOpen = false;
  oldChqCmtBtn = -1;
  showChqCommentUndoBtn(index, CHQ_ID: any) {

      this.GetChequeListComment(CHQ_ID, this.commentsData[0].type);

      if (this.isChqCmtOpen == false) {
          this.isChqCmtOpen = true;
          this.oldChqCmtBtn = index;
          this.showChqCmtBtn = index;
      } else {
          if (this.oldChqCmtBtn == index) {
              this.isChqCmtOpen = false;
              this.showChqCmtBtn = -1;
              this.oldChqCmtBtn = -1;
          } else {
              this.showChqCmtBtn = index;
              this.oldChqCmtBtn = index;
          }
      }
  }

  // Payment Request List data extend//

  showPayReqlistBtn = -1;
  isPayReqlistOpen = false;
  oldPayReqlistBtn = -1;
  showPayReqlistUndoBtn(index, PAYMENT_REQUEST_ID: any) {

      this.GetPaymentRequestListComment(PAYMENT_REQUEST_ID, this.commentsData[0].type);

      if (this.isPayReqlistOpen == false) {
          this.isPayReqlistOpen = true;
          this.oldPayReqlistBtn = index;
          this.showPayReqlistBtn = index;
      } else {
          if (this.oldPayReqlistBtn == index) {
              this.isPayReqlistOpen = false;
              this.showPayReqlistBtn = -1;
              this.oldPayReqlistBtn = -1;
          } else {
              this.showPayReqlistBtn = index;
              this.oldPayReqlistBtn = index;
          }
      }
  }


  // Payment Request List data extend//

  showPayReqlistcmttocmtBtn = -1;
  isPayReqlistcmttocmtOpen = false;
  oldPayReqlistcmttocmtBtn = -1;
  showPayReqlistcmttocmtUndoBtn(index, PAYMENT_REQUEST_ID: any) {

      this.GetPaymentRequestListComment(PAYMENT_REQUEST_ID, this.commentsData[0].type);

      if (this.isPayReqlistcmttocmtOpen == false) {
          this.isPayReqlistcmttocmtOpen = true;
          this.oldPayReqlistcmttocmtBtn = index;
          this.showPayReqlistcmttocmtBtn = index;
      } else {
          if (this.oldPayReqlistcmttocmtBtn == index) {
              this.isPayReqlistcmttocmtOpen = false;
              this.showPayReqlistcmttocmtBtn = -1;
              this.oldPayReqlistcmttocmtBtn = -1;
          } else {
              this.showPayReqlistcmttocmtBtn = index;
              this.oldPayReqlistcmttocmtBtn = index;
          }
      }
  }

  
  // Payment Request Comment data extend//

  showPayReqCmttoCmtBtn = -1;
  isPayReqCmttoCmtOpen = false;
  oldPayReqCmttoCmtBtn = -1;
  showPayReqCmttoCmtUndoBtn(index, CASE_REQUEST_ID: any) {

      this.GetPaymentRequestList(CASE_REQUEST_ID, this.commentsData[0].type);

      if (this.isPayReqCmttoCmtOpen == false) {
          this.isPayReqCmttoCmtOpen = true;
          this.oldPayReqCmttoCmtBtn = index;
          this.showPayReqCmttoCmtBtn = index;
      } else {
          if (this.oldPayReqCmttoCmtBtn == index) {
              this.isPayReqCmttoCmtOpen = false;
              this.showPayReqCmttoCmtBtn = -1;
              this.oldPayReqCmttoCmtBtn = -1;
          } else {
              this.showPayReqCmttoCmtBtn = index;
              this.oldPayReqCmttoCmtBtn = index;
          }
      }
  }


  // RtnCheque List Comment data extend//
  showRtnChqCmtBtn = -1;
  isRtnChqCmtOpen = false;
  oldRtnChqCmtBtn = -1;
  showRtnChqCommentUndoBtn(index, CHQ_ID: any) {

      this.GetChequeListComment(CHQ_ID, this.commentsData[0].type);

      if (this.isRtnChqCmtOpen == false) {
          this.isRtnChqCmtOpen = true;
          this.oldRtnChqCmtBtn = index;
          this.showRtnChqCmtBtn = index;
      } else {
          if (this.oldRtnChqCmtBtn == index) {
              this.isRtnChqCmtOpen = false;
              this.showRtnChqCmtBtn = -1;
              this.oldRtnChqCmtBtn = -1;
          } else {
              this.showRtnChqCmtBtn = index;
              this.oldRtnChqCmtBtn = index;
          }
      }
  }

  // Cheque List Comment data extend//

  showHotoCmtBtn = -1;
  isHotoCmtOpen = false;
  oldHotoCmtBtn = -1;
  showhotoCommentUndoBtn(index, Lease_number: any, Hoto_id: any) {

      this.GetHotoComment(Lease_number, Hoto_id, this.commentsData[0].type);

      if (this.isHotoCmtOpen == false) {
          this.isHotoCmtOpen = true;
          this.oldHotoCmtBtn = index;
          this.showHotoCmtBtn = index;
      } else {
          if (this.oldHotoCmtBtn == index) {
              this.isHotoCmtOpen = false;
              this.showHotoCmtBtn = -1;
              this.oldHotoCmtBtn = -1;
          } else {
              this.showHotoCmtBtn = index;
              this.oldHotoCmtBtn = index;
          }
      }
  }


  // Cheque List Comment data extend//

  showHotoCmttoCmtBtn = -1;
  isHotoCmttoCmtOpen = false;
  oldHotoCmttoCmtBtn = -1;
  showhotoCmttoCmtUndoBtn(index, Lease_number: any, Hoto_id: any) {

      this.GetHotoComment(Lease_number, Hoto_id, this.commentsData[0].type);

      if (this.isHotoCmttoCmtOpen == false) {
          this.isHotoCmttoCmtOpen = true;
          this.oldHotoCmttoCmtBtn = index;
          this.showHotoCmttoCmtBtn = index;
      } else {
          if (this.oldHotoCmttoCmtBtn == index) {
              this.isHotoCmttoCmtOpen = false;
              this.showHotoCmttoCmtBtn = -1;
              this.oldHotoCmttoCmtBtn = -1;
          } else {
              this.showHotoCmttoCmtBtn = index;
              this.oldHotoCmttoCmtBtn = index;
          }
      }
  }

  showDrecCmtBtn = -1;
  isDrecCmtOpen = false;
  oldDrecCmtBtn = -1;
  showdrecCommentUndoBtn(index, LEASE_NUM: any) {

      this.GetDrecComment(LEASE_NUM, this.commentsData[0].type);

      if (this.isDrecCmtOpen == false) {
          this.isDrecCmtOpen = true;
          this.oldDrecCmtBtn = index;
          this.showDrecCmtBtn = index;
      } else {
          if (this.oldDrecCmtBtn == index) {
              this.isDrecCmtOpen = false;
              this.showDrecCmtBtn = -1;
              this.oldDrecCmtBtn = -1;
          } else {
              this.showDrecCmtBtn = index;
              this.oldDrecCmtBtn = index;
          }
      }
  }


  // Call Management Comment data extend//
  showCallMgntCmtBtn = -1;
  isCallMgntCmtOpen = false;
  oldCallMgntCmtBtn = -1;
  showcallCommentUndoBtn(index, CALL_LOG_ID: any) {

      this.GetCallManagementComment(CALL_LOG_ID, this.commentsData[0].type);

      if (this.isCallMgntCmtOpen == false) {
          this.isCallMgntCmtOpen = true;
          this.oldCallMgntCmtBtn = index;
          this.showCallMgntCmtBtn = index;
      } else {
          if (this.oldCallMgntCmtBtn == index) {
              this.isCallMgntCmtOpen = false;
              this.showCallMgntCmtBtn = -1;
              this.oldCallMgntCmtBtn = -1;
          } else {
              this.showCallMgntCmtBtn = index;
              this.oldCallMgntCmtBtn = index;
          }
      }
  }
  
  GetTaskComment(TASK_ID: any, LABEL_TYPE: any) {

    this.presentLoadingDefault(true);

    let userdata = {
      UserInfoId: this.user.UserInfoId,
      UserEmployeeId: this.user.UserEmployeeId,
      task_id: TASK_ID,
      label_type: LABEL_TYPE
    }
    this.authService.postData(userdata, 'comments/TaskCommentsListByID').then((result) => {
      this.Taskcommentsdetailsall = result;
      this.presentLoadingDefault(false);
      console.log('TaskComment', this.Taskcommentsdetailsall);

      if (this.Taskcommentsdetailsall.MyCommentDataAll.length > 0) {
        if (LABEL_TYPE != 'CMT') {
          this.presentLoadingDefault(true);
          this.authService.postData(userdata, 'comments/UpdateTaskComments').then((result) => {
            this.presentLoadingDefault(false);
          }, (err) => {
            this.presentLoadingDefault(false);
            this.presentToast(err);
          });
        }
      } else {
        this.presentToast(`No data found`);
      }

    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });
  }

  
  GetCaseComment(CASE_ID: any, LABEL_TYPE: any) {

    this.presentLoadingDefault(true);

    let userdata = {
        UserInfoId: this.user.UserInfoId,
        UserEmployeeId: this.user.UserEmployeeId,
        case_id: CASE_ID,
        label_type: LABEL_TYPE
    }
    this.authService.postData(userdata, 'comments/CaseCommentsListByID').then((result) => {
        this.Casecommentsdetailsall = result;
        this.presentLoadingDefault(false);
        console.log('CaseComment', this.Casecommentsdetailsall);

        if (this.Casecommentsdetailsall.MyCommentsList.length > 0) {
            if (LABEL_TYPE != 'CMT') {
              this.presentLoadingDefault(true);
                this.authService.postData(userdata, 'comments/UpdateCaseComments').then((result) => {
                    this.presentLoadingDefault(false);
                }, (err) => {
                    this.presentLoadingDefault(false);
                    this.presentToast(err);
                });
            }
        } else {
            this.presentLoadingDefault(false);
            this.presentToast(`No data found`);
        }

    }, (err) => {
        this.presentLoadingDefault(false);
        this.presentToast(err);
    });
}

GetChequeListComment(CHQ_ID: any, LABEL_TYPE: any) {

    this.presentLoadingDefault(true);

    let userdata = {
        UserInfoId: this.user.UserInfoId,
        UserEmployeeId: this.user.UserEmployeeId,
        cash_receipt_id: CHQ_ID,
        label_type: LABEL_TYPE
    }
    this.authService.postData(userdata, 'comments/ChqListCommentsListByID').then((result) => {
        this.Chqcommentsdetailsall = result;
        this.presentLoadingDefault(false);
        console.log('ChqComment', this.Chqcommentsdetailsall);

        if (this.Chqcommentsdetailsall.MyCommentsList.length > 0) {
            if (LABEL_TYPE != 'CMT') {
              this.presentLoadingDefault(true);
                this.authService.postData(userdata, 'comments/UpdateChqListComments').then((result) => {
                    this.presentLoadingDefault(false);
                }, (err) => {
                    this.presentLoadingDefault(false);
                    this.presentToast(err);
                });
            }
        } else {
            this.presentLoadingDefault(false);
            this.presentToast(`No data found`);
        }

    }, (err) => {
        this.presentLoadingDefault(false);
        this.presentToast(err);
    });
}


GetPaymentRequestListComment(PAYMENT_REQUEST_ID: any, LABEL_TYPE: any) {

    this.presentLoadingDefault(true);

    let userdata = {
        UserInfoId: this.user.UserInfoId,
        UserEmployeeId: this.user.UserEmployeeId,
        payment_request_id: PAYMENT_REQUEST_ID,
        label_type: LABEL_TYPE
    }
    this.authService.postData(userdata, 'comments/PaymentReqCmtsListByID').then((result) => {
        this.PayReqcommentsdetailsall = result;
        this.presentLoadingDefault(false);
        console.log('PayReqComment', this.PayReqcommentsdetailsall);

        if (this.PayReqcommentsdetailsall.MyCommentsList.length > 0) {
            if (LABEL_TYPE != 'CMT') {
              this.presentLoadingDefault(true);
                this.authService.postData(userdata, 'comments/UpdatePayReqListComments').then((result) => {
                    this.presentLoadingDefault(false);
                }, (err) => {
                    this.presentLoadingDefault(false);
                    this.presentToast(err);
                });
            }
        } else {
            this.presentLoadingDefault(false);
            this.presentToast(`No data found`);
        }

    }, (err) => {
        this.presentLoadingDefault(false);
        this.presentToast(err);
    });
}


//// Hoto Comment List ////
GetHotoComment(Lease_number: any, Hoto_id: any, LABEL_TYPE: any) {

    this.presentLoadingDefault(true);

    let userdata = {
        UserInfoId: this.user.UserInfoId,
        UserEmployeeId: this.user.UserEmployeeId,
        lease_number: Lease_number,
        hoto_id: Hoto_id,
        label_type: LABEL_TYPE
    }
    this.authService.postData(userdata, 'comments/HotoCommentsListByID').then((result) => {
        this.Hotocommentsdetailsall = result;
        this.presentLoadingDefault(false);
        console.log('Hoto', this.Hotocommentsdetailsall);
        if (this.Hotocommentsdetailsall.MyCommentsList.length > 0) {
            if (LABEL_TYPE != 'CMT') {
              this.presentLoadingDefault(true);
                this.authService.postData(userdata, 'comments/UpdateHotoListComments').then((result) => {
                    this.presentLoadingDefault(false);
                }, (err) => {
                    this.presentLoadingDefault(false);
                    this.presentToast(err);
                });
            }
        } else {
            this.presentLoadingDefault(false);
            this.presentToast(`No data found`);
        }
    }, (err) => {
        this.presentLoadingDefault(false);
        this.presentToast(err);
    });
}

//// Hoto Comment List ////
GetDrecComment(LEASE_NUM: any, LABEL_TYPE: any) {

    this.presentLoadingDefault(true);

    let userdata = {
        UserInfoId: this.user.UserInfoId,
        UserEmployeeId: this.user.UserEmployeeId,
        lease_number: LEASE_NUM,
        label_type: LABEL_TYPE
    }

    this.authService.postData(userdata, 'comments/DrecCommentsListByID').then((result) => {
        this.Dreccommentsdetailsall = result;
        this.presentLoadingDefault(false);
        console.log('Hoto', this.Dreccommentsdetailsall);
        if (this.Dreccommentsdetailsall.MyCommentsList.length > 0) {
            if (LABEL_TYPE != 'CMT') {
              this.presentLoadingDefault(true);
                this.authService.postData(userdata, 'comments/UpdateDrecListComments').then((result) => {
                    this.presentLoadingDefault(false);
                }, (err) => {
                    this.presentLoadingDefault(false);
                    this.presentToast(err);
                });
            }
        } else {
            this.presentLoadingDefault(false);
            this.presentToast(`No data found`);
        }
    }, (err) => {
        this.presentLoadingDefault(false);
        this.presentToast(err);
    });
}

//// CAll Management Comment List ////

GetCallManagementComment(CALL_LOG_ID: any, LABEL_TYPE: any) {

    this.presentLoadingDefault(true);

    let userdata = {
        UserInfoId: this.user.UserInfoId,
        UserEmployeeId: this.user.UserEmployeeId,
        call_log_id: CALL_LOG_ID,
        label_type: LABEL_TYPE
    }

    this.authService.postData(userdata, 'comments/CallMgntCommentsListByID').then((result) => {
        this.CallMgntcommentsdetailsall = result;
        this.presentLoadingDefault(false);
        console.log('CallMgnt', this.CallMgntcommentsdetailsall);
        if (this.CallMgntcommentsdetailsall.MyCommentsList.length > 0) {
            if (LABEL_TYPE != 'CMT') {
              this.presentLoadingDefault(true);
                this.authService.postData(userdata, 'comments/UpdateCallMgntListComments').then((result) => {
                    this.presentLoadingDefault(false);
                }, (err) => {
                    this.presentLoadingDefault(false);
                    this.presentToast(err);
                });
            }
        } else {
            this.presentLoadingDefault(false);
            this.presentToast(`No data found`);
        }
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
