import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController, Modal, ModalController, ModalOptions, ViewController } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';

@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html'
})
export class NotificationPage {

  notificationall = {
    MynotificationList: [] as any,
    TodayNotification: [] as any,
    YesterdayNotification: [] as any,
    LastWeekNotification: [] as any,
    taskListAll: [] as any
  } as any;

  Searchnotificationall = {} as any;

  modaltype = this.navParams.get('data');
  user: any = localStorage.getItem('userData');
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public authService: RestProvider, public toastCtrl: ToastController, private modal: ModalController,
    public loadingCtrl: LoadingController, public view: ViewController) {
    this.user = this.user ? JSON.parse(this.user) : {};
  }

  ionViewDidLoad() {
    console.log('1.Loading Notification...');
    this.getNotificationList();
  }

  getNotificationList(){
    let myTitle = 'Notification';
    this.presentLoadingDefault(true);
    let userdata = {
      UserInfoId: this.user.UserInfoId,
      UserEmployeeId: this.user.UserEmployeeId
    }

    this.authService.postData(userdata, 'notification/NotificationList').then((result) => {
      this.notificationall = result;
      this.presentLoadingDefault(false);
      console.log('Notification Listing', this.notificationall);
      if(this.notificationall.MynotificationList.length > 0) {        
        this.getNotificationListUpdate();
      }else{
        this.presentLoadingDefault(false);
        this.presentToast(`No data found in ${myTitle}`);
      }
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });
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

  openModel(ID: any,LABEL_ID: any, LABEL_TYPE: any, CASE_REQUEST_ID: any, STATUS_NAME: any, LEASE_NO: any) {
    let PAYMENT_TYPE = 'Payment Request';

    if (LABEL_TYPE == 'TMS') {
      this.openTaskCommentModal(LABEL_ID);
      //this.getNotificationListUpdate(LABEL_TYPE, ID);
    } else if (LABEL_TYPE == 'CMS') {
      this.openCaseCommentModal(CASE_REQUEST_ID, LABEL_ID);
      //this.getNotificationListUpdate(LABEL_TYPE, ID);
    } else if (LABEL_TYPE == 'CS') {
      this.openChqListModal(LABEL_ID);
      //this.getNotificationListUpdate(LABEL_TYPE, ID);
    } else if (LABEL_TYPE == 'CPR') {
      this.openPaymentReqModal(LABEL_ID, PAYMENT_TYPE);
      ///this.getNotificationListUpdate(LABEL_TYPE, ID);
    } else if (LABEL_TYPE == 'RCS') {
      this.openReturnChqListModal(LABEL_ID);
      //this.getNotificationListUpdate(LABEL_TYPE, ID);
    } else if (LABEL_TYPE == 'HOTO') {
      this.openHotoModal(LEASE_NO, LABEL_ID);
      //this.getNotificationListUpdate(LABEL_TYPE, ID);
    } else if (LABEL_TYPE == 'DREC') {
      this.openDrecModal(LABEL_ID);
      //this.getNotificationListUpdate(LABEL_TYPE, ID);
    } else if (LABEL_TYPE == 'CM') {
      this.openCallManagementModal(LABEL_ID, STATUS_NAME);
      //this.getNotificationListUpdate(LABEL_TYPE, ID);
    }

  }

  closeModal() {
    this.view.dismiss();
  }
 
  getNotificationListUpdate() {
    let userdata = {
      UserInfoId: this.user.UserInfoId,
      UserEmployeeId: this.user.UserEmployeeId
    }

    this.authService.postData(userdata, 'notification/notificationListUpdate').then((result) => {      
      this.presentLoadingDefault(false);      
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
      task_data_val: this.notificationall.taskListAll.filter(item => item.TASK_ID === TASK_ID)
    }];

    let myModal: Modal = this.modal.create('TaskCommentPage', { data: myModalData }, myModalOptions);

    myModal.onWillDismiss(() => {
      console.log('2.Loading Notification...');
      this.getNotificationList();
    });

    myModal.present();
  }

  openCaseCommentModal(CASE_REQUEST_ID: any, CASE_ID: any) {

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let myModalData = [{
      CASE_REQ_ID: CASE_REQUEST_ID,
      CASE_ID: CASE_ID
    }];

    let myModal: Modal = this.modal.create('CaseModalPage', { data: myModalData }, myModalOptions);

    myModal.onWillDismiss(() => {
      console.log('2.Loading Notification...');
      this.getNotificationList();
    });

    myModal.present();
  }

  openChqListModal(ID: any) {

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let myModalData = [{
      ID: ID
    }];

    let myModal: Modal = this.modal.create('ChequeCommentPage', { data: myModalData }, myModalOptions);

    myModal.onWillDismiss(() => {
      console.log('2.Loading Notification...');
      this.getNotificationList();
    });

    myModal.present();
  }


  openPaymentReqModal(PAYMENT_REQUEST_ID: any, type: any) {

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let myModalData = [{
      PAYMENT_REQUEST_ID: PAYMENT_REQUEST_ID,
      type: type,
      PAYMENT_REQ_BILL_ID: null
    }];

    let myModal: Modal = this.modal.create('PaymentModalPage', { data: myModalData }, myModalOptions);

    myModal.onWillDismiss(() => {
      console.log('2.Loading Notification...');
      this.getNotificationList();
    });

    myModal.present();

  }

  openReturnChqListModal(CASH_RECEIPT_ID: any) {

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let myModalData = [{
      CASH_RECEIPT_ID: CASH_RECEIPT_ID,
      ESCLATED_COUNT: 0
    }];

    let myModal: Modal = this.modal.create('ReturnCommentPage', { data: myModalData }, myModalOptions);

    myModal.onWillDismiss(() => {
      console.log('2.Loading Notification...');
      this.getNotificationList();
    });

    myModal.present();

  }

  openHotoModal(LEASE_NUM: any, HANDOVER_ID: any) {

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let myModalData = [{
      LEASE_NUM: LEASE_NUM,
      HOTO_ID: HANDOVER_ID
    }];

    let myModal: Modal = this.modal.create('HotoCommentPage', { data: myModalData }, myModalOptions);

    myModal.onWillDismiss(() => {
      console.log('2.Loading Notification...');
      this.getNotificationList();
    });

    myModal.present();
  }

  openDrecModal(LEASE_NUM: any) {
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let myModalData = [{
      LEASE_NUM: LEASE_NUM
    }];

    let myModal: Modal = this.modal.create('DrecCommentsPage', { data: myModalData }, myModalOptions);

    myModal.onWillDismiss(() => {
      console.log('2.Loading Notification...');
      this.getNotificationList();
    });

    myModal.present();
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

    myModal.onWillDismiss(() => {
      console.log('2.Loading Notification...');
      this.getNotificationList();
    });

    myModal.present();
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