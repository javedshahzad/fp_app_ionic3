import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events, ToastController, AlertController, LoadingController, Modal, ModalController, ModalOptions } from 'ionic-angular';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { CasemanagementlablePage } from '../pages/casemanagementlable/casemanagementlable';
import { PaymentRequestListPage } from '../pages/paymentrequestlist/paymentrequestlist';
import { DrecPage } from '../pages/drec/drec';
import { ReturnChequeListPage } from '../pages/returnchequelist/returnchequelist';
import { ChequeListLabelPage } from '../pages/chequelistlabel/chequelistlabel';
import { RentPage } from '../pages/rentrefund/rent';
import { HotoPage } from '../pages/hoto/hoto';
import { PropertyManagementPage } from '../pages/propertymanagement/propertymanagement';
import { CustomerServicePage } from '../pages/customerserviceproperty/customerservice';
import { TaskManagementPage } from '../pages/taskmanagement/taskmanagement';
import { SecurityDepositListPage } from '../pages/securitydepositlist/securitydepositlist';
import { EsculationLabelPage } from '../pages/esculationlabel/esculationlabel';
import { CommentsToCommentsPage } from '../pages/commentstocomments/commentstocomments';
import { NotificationPage } from '../pages/notification/notification';
import { FCM } from '@ionic-native/fcm';
import { MyprofilePage } from '../pages/myprofile/myprofile';
import { lpoPageModule } from '../pages/lpo/lpo';
import { CallmanagementPage } from '../pages/callmanagement/callmanagement';
import { RestProvider } from '../providers/rest/rest';
import { CreateTaskPage } from '../pages/createtask/createtask';
import { ThreeDeeTouch, ThreeDeeTouchQuickAction, ThreeDeeTouchForceTouch } from '@ionic-native/three-dee-touch';
import * as firebase from 'firebase';
import { ChatPage } from '../pages/chat/chat';
import { Badge } from '@ionic-native/badge';
import { DailytaskcommentPage } from '../pages/dailytaskcomment/dailytaskcomment';
import { AngularFireDatabase } from 'angularfire2/database';
import { NotesPage } from '../pages/notes/notes';
import { MyMeetingsPage } from '../pages/mymeetings/mymeetings';

import { FinancePaymentRequestLabelPage } from '../pages/financepaymentrequestlabel/financepaymentrequestlabel';
import { DocumentTrackingLabelsPage } from '../pages/documenttrackinglabels/documenttrackinglabels';
import { InventoryPage } from '../pages/inventory/inventory';
import { App } from 'ionic-angular/components/app/app';
import { Constant } from '../providers/constant/constant';
import { AttendancePage } from '../pages/attendance/attendance';
import { DrecLabelPage } from '../pages/dreclabel/dreclabel';
import { ParkingPage } from '../pages/parking/parking';
// import { BackgroundMode } from '@ionic-native/background-mode';


@Component({
  templateUrl: 'app.html'
})

export class ceoportal {

  @ViewChild(Nav) nav: Nav;
  rootPage: any;
  clickSub: any;
  pages: Array<{ title: string, component: any, icon: any, page_access: any }>;
  isAndroid = true;
  tasksearchlist: any;
  myModalData: any;
  public user = {} as any;
  public RememberMe = {} as any;
  public fcmdata = {} as any;
  TYPE: any;
  type_string: any;
  useraccessdata: any;
  userSurname = '';

  config = {
    apiKey: "AIzaSyDvV9BU6trshxtKLNn3Tehfm9D0HrEwn0U",
    authDomain: "fp-app-8afb9.firebaseapp.com",
    databaseURL: "https://fp-app-8afb9.firebaseio.com",
    projectId: "fp-app-8afb9",
    storageBucket: "fp-app-8afb9.appspot.com",
    messagingSenderId: "349794714049",
    appId: "1:349794714049:web:e41aefa76bf21ca3e9af40",
    measurementId: "G-N20CPMR2ZS"
  } as any;
  branchListdetails: any;

  constructor(public platform: Platform, public statusBar: StatusBar, public events: Events,
    public alertCtrl: AlertController, public splashScreen: SplashScreen,
    private modal: ModalController, public loadingCtrl: LoadingController,
    public toastCtrl: ToastController, private fcm: FCM, public authService: RestProvider,
    public localNotifications: LocalNotifications, public badge: Badge,
    private threeDeeTouch: ThreeDeeTouch, private db: AngularFireDatabase,
    public app: App, public constant: Constant
  ) {
    this.initializeApp();
    if (firebase.apps.length === 0) {
      firebase.initializeApp(this.config);
    }

    this.events.subscribe('userloggedin', (() => {
      this.user = localStorage.getItem('userData');
      this.user = JSON.parse(this.user);
      this.userSurname = this.user.Surname;
    }));

    this.events.subscribe('useraccess', (() => {
      this.useraccessdata = localStorage.getItem('useraccessdata');
      this.useraccessdata = JSON.parse(this.useraccessdata);
      console.log('App-->', this.useraccessdata);

      this.pages = [];

      this.pages = [{ title: 'Dashboard ', component: DashboardPage, icon: 'fa  fa-tachometer fa-lg', page_access: 1 }];

      if (this.useraccessdata.ATTENDANCE_ACCESS == 1) {
        this.pages.push({ title: 'Attendance', component: AttendancePage, icon: 'fa fa-list-alt', page_access: 1 });
      }

      if (this.useraccessdata.CALL_MANAGEMENT_ACCESS == 1) {
        this.pages.push({ title: 'Call Management', component: CallmanagementPage, icon: 'fa fa-phone fa-lg', page_access: 1 });
      }

      if (this.useraccessdata.CASE_ACCESS == 1) {
        this.pages.push({ title: 'Case Management', component: CasemanagementlablePage, icon: 'fa fa-newspaper-o', page_access: 1 });
      }

      if (this.useraccessdata.CHAT_ACCESS == 1) {
        this.pages.push({ title: 'Chat', component: ChatPage, icon: 'fa fa-comments-o', page_access: 1 });
      }

      if (this.useraccessdata.CHEQUE_LIST_ACCESS == 1) {
        this.pages.push({ title: 'Cheque List', component: ChequeListLabelPage, icon: 'fa fa-list-alt', page_access: 1 });
      }

      if (this.useraccessdata.COMMENTS_ACCESS == 1) {
        this.pages.push({ title: 'Comments', component: CommentsToCommentsPage, icon: 'fa fa-comment', page_access: 1 });
      }

      if (this.useraccessdata.CUSTOMER_SERVICE_ACCESS == 1) {
        this.pages.push({ title: 'Customer Service', component: CustomerServicePage, icon: 'fa fa-user', page_access: 1 });
      }

      if (this.useraccessdata.DOC_TRACKING_ACCESS == 1) {
        this.pages.push({ title: 'Document Tracking', component: DocumentTrackingLabelsPage, icon: 'fa fa-clipboard', page_access: 1 });
      }

      if (this.useraccessdata.DREC_ACCESS == 1) {
        this.pages.push({ title: 'Drec', component: DrecLabelPage, icon: 'fa fa-building', page_access: 1 });
      }

      if (this.useraccessdata.ESCALATION_ACCESS == 1) {
        this.pages.push({ title: 'Escalation', component: EsculationLabelPage, icon: 'fa fa-envelope', page_access: 1 });
      }

      if (this.useraccessdata.HOTO_ACCESS == 1) {
        this.pages.push({ title: 'HOTO', component: HotoPage, icon: 'fa fa-key', page_access: 1 });
      }

      if (this.useraccessdata.INVENTORY_ACCESS == 1) {
        this.pages.push({ title: 'Inventory', component: InventoryPage, icon: 'fa fa-clipboard', page_access: 1 });
      }

      if (this.useraccessdata.PAYMENT_REQUEST_ACCESS == 1) {
        this.pages.push({ title: 'Legal Payment Request', component: PaymentRequestListPage, icon: 'fa fa-money', page_access: 1 });
      }

      if (this.useraccessdata.LPO_ACCESS == 1) {
        this.pages.push({ title: 'LPO', component: lpoPageModule, icon: 'fa fa-shopping-cart', page_access: 1 });
      }

      if (this.useraccessdata.MOM_ACCESS == 1) {
        this.pages.push({ title: 'Minutes Of Meeting', component: MyMeetingsPage, icon: 'fa fa-clipboard', page_access: 1 });
      }

      if (this.useraccessdata.MYPROFILE_ACCESS == 1) {
        this.pages.push({ title: 'My Profile', component: MyprofilePage, icon: 'fa fa-user', page_access: 1 });
      }

      if (this.useraccessdata.NOTIFICATION_ACCESS == 1) {
        this.pages.push({ title: 'Notification', component: NotificationPage, icon: 'fa fa-bell', page_access: 1 });
      }

      if (this.useraccessdata.PARKING_ACCESS == 1) {
        this.pages.push({ title: 'Parking', component: ParkingPage, icon: 'fa fa-car', page_access: 1 });
      }

      if (this.useraccessdata.FIN_PAY_REQ_ACCESS == 1) {
        this.pages.push({ title: 'Payment Request', component: FinancePaymentRequestLabelPage, icon: 'fa fa-money', page_access: 1 });
      }

      if (this.useraccessdata.PROPERTY_LIST_ACCESS == 1) {
        this.pages.push({ title: 'Property Management', component: PropertyManagementPage, icon: 'fa fa-university', page_access: 1 });
      }

      if (this.useraccessdata.RENT_REFUND_ACCESS == 1) {
        this.pages.push({ title: 'Rent Refund', component: RentPage, icon: 'fa fa-file-text', page_access: 1 });
      }

      if (this.useraccessdata.RETURN_CHQ_ACCESS == 1) {
        this.pages.push({ title: 'Return Cheque ', component: ReturnChequeListPage, icon: 'fa fa-share-square-o', page_access: 1 });
      }

      if (this.useraccessdata.SECURITY_DEPOSIT_ACCESS == 1) {
        this.pages.push({ title: 'Security Deposit ', component: SecurityDepositListPage, icon: 'fa fa-shield', page_access: 1 });
      }

      if (this.useraccessdata.TASK_ACCESS == 1) {
        this.pages.push({ title: 'Task Management ', component: TaskManagementPage, icon: 'fa fa-tasks', page_access: 1 });
      }

      this.pages.push({ title: 'Logout', component: null, icon: 'fa fa-sign-out fa-lg', page_access: 1 });


    }));

  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.platform.registerBackButtonAction(() => {
        this.app.navPop();
      })
      this.statusBar.styleDefault();
      this.splashScreen.hide();

        this.rootPage = this.initPage();
        
        
  //       this.backgroundMode.on('activate').subscribe(s => {
  //         console.log('backgroundMode activate');
  //         this.badge.set(10);
  // });
  // this.backgroundMode.enable();
      if (this.platform.is('ios')) {
        this.isAndroid = false;
        this.TokenSetup();

        this.threeDeeTouch.isAvailable().then(isAvailable => console.log('3D Touch available? ' + isAvailable));

        this.threeDeeTouch.watchForceTouches()
          .subscribe(
            (data: ThreeDeeTouchForceTouch) => {
              console.log('Force touch %' + data.force);
              console.log('Force touch timestamp: ' + data.timestamp);
              console.log('Force touch x: ' + data.x);
              console.log('Force touch y: ' + data.y);
            }
          );

        let actions: Array<ThreeDeeTouchQuickAction> = [
          {
            type: 'checkin', // optional, but can be used in the onHomeIconPressed callback
            title: 'Create Task', // mandatory
            subtitle: 'Quickly Create Task', // optional
            iconType: 'Compose' // optional
          },
          {
            type: 'currentROI', // optional, but can be used in the onHomeIconPressed callback
            title: 'Current Week ROI', // mandatory
            subtitle: 'Current Week ROI', // optional
            iconType: 'Compose' // optional
          },
          {
            type: 'Notes', // optional, but can be used in the onHomeIconPressed callback
            title: 'Notes', // mandatory
            subtitle: 'Notes', // optional
            iconType: 'Compose' // optional
          },
          {
            type: 'Mom', // optional, but can be used in the onHomeIconPressed callback
            title: 'Mom', // mandatory
            subtitle: 'Mom', // optional
            iconType: 'Compose' // optional
          },
          {
            type: 'Chat', // optional, but can be used in the onHomeIconPressed callback
            title: 'Chat', // mandatory
            subtitle: 'Chat', // optional
            iconType: 'Compose' // optional
          }
        ];

        this.threeDeeTouch.configureQuickActions(actions);

        this.threeDeeTouch.onHomeIconPressed().subscribe(
          (payload) => {
            //this.getBadgeCount();
            if (payload.type == 'checkin') {

              let user = localStorage.getItem('userData');
              this.user = JSON.parse(user || null);

              if (this.user.UserInfoId > 0) {
                this.nav.push(CreateTaskPage, {}, { animate: false });
                return;
              }

            } else if (payload.type == 'currentROI') {

              let user = localStorage.getItem('userData');
              this.user = JSON.parse(user || null);
              this.myModalData = [
                this.TYPE = 'Current'
              ]

              if (this.user.UserInfoId > 0) {
                this.nav.push(DailytaskcommentPage, { data: this.myModalData }, { animate: false });
                return;
              }

            } else if (payload.type == 'Notes') {
              let user = localStorage.getItem('userData');
              this.user = JSON.parse(user || null);
              this.myModalData = [
                this.TYPE = 'Notes'
              ]

              if (this.user.UserInfoId > 0) {
                this.nav.push(NotesPage, { data: this.myModalData }, { animate: false });
                return;
              }

            } else if (payload.type == 'Mom') {

              let user = localStorage.getItem('userData');
              this.user = JSON.parse(user || null);
              this.myModalData = [
                this.TYPE = 'Mom'
              ]

              if (this.user.UserInfoId > 0) {
                this.nav.push(MyMeetingsPage, { data: this.myModalData }, { animate: false });
                return;
              }

            } else if (payload.type == 'Chat') {

              let user = localStorage.getItem('userData');
              this.user = JSON.parse(user || null);
              this.myModalData = [
                this.TYPE = 'Mom'
              ]

              if (this.user.UserInfoId > 0) {
                this.nav.push(ChatPage, { data: this.myModalData }, { animate: false });
                return;
              }

            }
          }
        );
      }

      if (this.platform.is('android')) {
        this.TokenSetup();


      }
    });

  }

  TokenSetup() {

    this.fcm.getToken().then((token) => {
      localStorage.setItem('token', token);
    }, (err) => {
    });

    this.fcm.onNotification().subscribe((data) => {
      console.log('Notification received app.js ....');
      debugger;
     
      // "data": {
      //   "my_key": 'AIzaSyDvV9BU6trshxtKLNn3Tehfm9D0HrEwn0U',
      //   "my_another_key": "AIzaSyDvV9BU6trshxtKLNn3Tehfm9D0HrEwn0U",
      //   "body": "body",
      //   "message": "message",
      //   "badge": 10,// Here you can set badge count
      //   }
      if (data.wasTapped) {
        if (data.trans_type == "TMS") {
          let user = localStorage.getItem('userData');
          this.user = JSON.parse(user || null);
          if (this.user.UserInfoId > 0) {
            this.SearchTaskDetail(data.seq_text);
          }
        } else if (data.trans_type == "CHAT" || data.trans_type == "GROUP_CHAT" || data.trans_type == "ROI_GROUP_CHAT") {
          if (this.user.UserInfoId > 0) {
            this.openUserChat(data.chat_user_id, data.trans_type, data.group_name, data.roi_comments_id);
          }
        } else if (data.trans_type == "Current" || data.trans_type == "Next") {
          if (this.user.UserInfoId > 0) {
            this.openRoiPage(data.trans_type);
          }
        } else if (data.trans_type == "LPO AUDIO") {
          if (this.user.UserInfoId > 0) {
            this.openLPOModal(data.roi_comments_id);
          }
        } else if (data.trans_type == "PR AUDIO") {
          if (this.user.UserInfoId > 0) {
            this.openFinancePaymentCommentModal(data.roi_comments_id);
          }
        } else if (data.trans_type == "CALL AUDIO") {
          if (this.user.UserInfoId > 0) {
            this.openCallCommentsModal(data.roi_comments_id, data.requster_name);
          }
        } else if (data.trans_type == "LPR AUDIO") {
          if (this.user.UserInfoId > 0) {
            this.openLegalPaymentRequestCommentModal(data.roi_comments_id, data.payment_details);
          }
        } else if (data.trans_type == "CHEQUE AUDIO") {
          if (this.user.UserInfoId > 0) {
            this.openChequeListCommentModal(data.roi_comments_id, data.payment_details);
          }
        } else if (data.trans_type == "RETURN CHEQUE AUDIO") {
          if (this.user.UserInfoId > 0) {
            this.openReturnChequeListCommentModal(data.roi_comments_id, data.payment_details);
          }
        } else if (data.trans_type == "CASE AUDIO") {
          if (this.user.UserInfoId > 0) {
            this.openCaseCommentModal(data.roi_comments_id, data.payment_details);
          }
        } else if (data.trans_type == 'SECURITY DEPOSIT AUDIO') {
          if (this.user.UserInfoId > 0) {
            this.openSecurityDepositCommentModal(data.roi_comments_id);
          }
        } else if (data.trans_type == 'DREC AUDIO') {
          if (this.user.UserInfoId > 0) {
            this.openDrecCommentModal(data.roi_comments_id, data.payment_details);
          }
        } else if (data.trans_type == 'TASK AUDIO') {
          if (this.user.UserInfoId > 0) {
            this.openTaskCommentModal(data.roi_comments_id, data.payment_details);
          }
        } else if (data.trans_type == 'MOM AUDIO') {
          if (this.user.UserInfoId > 0) {
            this.uploadMomAudio(data.mom_id, data.roi_comments_id, data.payment_details);
          }
        } else if (data.trans_type == 'ROI AUDIO') {
          if (this.user.UserInfoId > 0) {
            this.uploadRoiAudio(data.roi_comments_id, data.roi_comments_child_id);
          }
        }

      } else {
        if (data.trans_type == "CHAT" || data.trans_type == "GROUP_CHAT" || data.trans_type == "ROI_GROUP_CHAT") {
          let chat = localStorage.getItem('Chat');
          if (chat == null && chat == undefined) {
            this.presentToastForChat(data.body, data);
          }
        } else if (data.trans_type == "Current" || data.trans_type == "Next") {
          this.presentToastForRoi(data.body, data);
        } else if (data.trans_type == "LPO AUDIO") {
          this.presentToastForAudioComment(data.body, data);
        } else if (data.trans_type == "PR AUDIO") {
          this.presentToastForFinancePaymentComment(data.body, data);
        } else if (data.trans_type == "CALL AUDIO") {
          this.presentToastForCallComment(data.body, data);
        } else if (data.trans_type == "LPR AUDIO") {
          this.presentToastForLegalPaymentReqComment(data.body, data);
        } else if (data.trans_type == "CHEQUE AUDIO") {
          this.presentToastForChequeListComment(data.body, data);
        } else if (data.trans_type == "RETURN CHEQUE AUDIO") {
          this.presentToastForReturnChequeListComment(data.body, data);
        } else if (data.trans_type == "SECURITY DEPOSIT AUDIO") {
          this.presentToastForSecurityDepositComment(data.body, data);
        } else if (data.trans_type == "DREC AUDIO") {
          this.presentToastForDrecComment(data.body, data);
        } else if (data.trans_type == "TASK AUDIO") {
          this.presentToastForTaskComment(data.body, data);
        } else if (data.trans_type == "MOM AUDIO") {
          this.presentToastForMomAudio(data.body, data);
        } else if (data.trans_type == "ROI AUDIO") {
          this.presentToastForRoiAudio(data.body, data);
        } else {
          this.presentToastWithEvent(data.body, data);
        }
      }
    }
    );

    this.fcm.onTokenRefresh().subscribe((token) => {
      localStorage.setItem('token', token);
    });

  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 5000,
      position: 'top',
      cssClass: 'normalToast'
    });

    toast.present();
  }

  presentToastWithEvent(msg, data) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 10000,
      position: 'top',
      // cssClass: 'normalToast',
      showCloseButton: true,
      closeButtonText: "Open"

    });


    toast.onDidDismiss((_null, role) => {
      if (role == 'close' || role == 'Open') {
        if (data.trans_type == "TMS") {
          this.SearchTaskDetail(data.seq_text);
        }
      }
    });

    toast.present();

  }

  presentToastForChequeListComment(msg: any, data: any) {
    let message = data.title + '- ' + msg;

    console.log(message);
    let toast = this.toastCtrl.create({
      message: message,
      duration: 10000,
      position: 'top',
      showCloseButton: true,
      closeButtonText: "Open"
    });

    toast.onDidDismiss((_null, role) => {
      if (role == 'close' || role == 'Open') {
        if (data.trans_type == "CHEQUE AUDIO") {
          if (this.user.UserInfoId > 0) {
            this.openChequeListCommentModal(data.roi_comments_id, data.payment_details);
          }
        }
      }
    });
    toast.present();
  }

  openChequeListCommentModal(ID: any, CHEQUE_DETAILS: any) {

    let CHEQUE_DETAIL = CHEQUE_DETAILS ? JSON.parse(CHEQUE_DETAILS) : null;

    debugger;
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };
    let myModalData = [{
      ID: ID,
      CHEQUE: CHEQUE_DETAIL
    }];

    let myModal: Modal = this.modal.create('ChequeCommentPage', { data: myModalData }, myModalOptions);

    myModal.present();
    myModal.onWillDismiss(() => {
    });

  }

  openReturnChequeListCommentModal(ID: any, CHEQUE_DETAILS: any) {

    let CHEQUE_DETAIL = CHEQUE_DETAILS ? JSON.parse(CHEQUE_DETAILS) : null;

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let myModalData = [{
      CASH_RECEIPT_ID: ID,
      ESCLATED_COUNT: 0,
      RETURN_CHQ: CHEQUE_DETAIL
    }];

    let myModal: Modal = this.modal.create('ReturnCommentPage', { data: myModalData }, myModalOptions);

    myModal.present();
    myModal.onWillDismiss(() => {
    });

  }

  presentToastForReturnChequeListComment(msg: any, data: any) {
    let message = data.title + '- ' + msg;

    console.log(message);
    let toast = this.toastCtrl.create({
      message: message,
      duration: 10000,
      position: 'top',
      showCloseButton: true,
      closeButtonText: "Open"
    });

    toast.onDidDismiss((_null, role) => {
      if (role == 'close' || role == 'Open') {
        if (data.trans_type == "RETURN CHEQUE AUDIO") {
          if (this.user.UserInfoId > 0) {
            this.openReturnChequeListCommentModal(data.roi_comments_id, data.payment_details);
          }
        }
      }
    });
    toast.present();
  }

  openCaseCommentModal(ID: any, CASE_DETAILS: any) {

    let CASE_DETAIL = CASE_DETAILS ? JSON.parse(CASE_DETAILS) : null;

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let myModalData = [{
      CASE_REQ_ID: CASE_DETAIL.CASE_REQUEST_ID,
      CASE_ID: CASE_DETAIL.CASE_ID,
      CASE: CASE_DETAIL
    }];

    let myModal: Modal = this.modal.create('CaseModalPage', { data: myModalData }, myModalOptions);

    myModal.present();
    myModal.onWillDismiss(() => {
    });

  }

  presentToastForCaseComment(msg: any, data: any) {
    let message = data.title + '- ' + msg;

    console.log(message);
    let toast = this.toastCtrl.create({
      message: message,
      duration: 10000,
      position: 'top',
      showCloseButton: true,
      closeButtonText: "Open"
    });

    toast.onDidDismiss((_null, role) => {
      if (role == 'close' || role == 'Open') {
        if (data.trans_type == "CASE AUDIO") {
          if (this.user.UserInfoId > 0) {
            this.openCaseCommentModal(data.roi_comments_id, data.payment_details);
          }
        }
      }
    });
    toast.present();
  }

  openSecurityDepositCommentModal(LEASE_NUMBER: any) {

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let myModalData = [{
      LEASE_NUMBER: LEASE_NUMBER
    }];

    let myModal: Modal = this.modal.create('SecurityDepositCommentPage', { data: myModalData }, myModalOptions);

    myModal.present();
    myModal.onWillDismiss(() => {
    });

  }

  openTaskCommentModal(ID: any, TASK_DETAILS: any) {

    let TASK_DETAIL = TASK_DETAILS ? JSON.parse(TASK_DETAILS) : null;

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let myModalData = [{
      TASK_ID: ID,
      task_data_val: TASK_DETAIL
    }];

    let myModal: Modal = this.modal.create('TaskCommentPage', { data: myModalData }, myModalOptions);

    myModal.present();
    myModal.onWillDismiss(() => {
    });

  }

  uploadMomAudio(mom_id: any, mom_action_point_id: any, action_by_id: any) {

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let myModalData = [{
      mom_id: mom_id,
      mom_action_point_id: mom_action_point_id,
      action_by_id: action_by_id
    }]

    let modelpage = '';
    modelpage = 'AudioPage';

    let myModal: Modal = this.modal.create(modelpage, { data: myModalData }, myModalOptions);

    myModal.present();
    myModal.onDidDismiss((data) => {
    });
    myModal.onWillDismiss((data) => {
    });


  }

  uploadRoiAudio(comments_id: any, comments_child_id: any) {

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let myModalData = [{
      comments_id: comments_id,
      comments_child_id: comments_child_id
    }]


    let modelpage = '';
    modelpage = 'AudioRoiPage';

    let myModal: Modal = this.modal.create(modelpage, { data: myModalData }, myModalOptions);

    myModal.present();
    myModal.onDidDismiss((data) => {
    });
    myModal.onWillDismiss((data) => {
    });

  }



  presentToastForSecurityDepositComment(msg: any, data: any) {
    let message = data.title + '- ' + msg;

    console.log(message);
    let toast = this.toastCtrl.create({
      message: message,
      duration: 10000,
      position: 'top',
      showCloseButton: true,
      closeButtonText: "Open"
    });

    toast.onDidDismiss((_null, role) => {
      if (role == 'close' || role == 'Open') {
        if (data.trans_type == "SECURITY DEPOSIT AUDIO") {
          if (this.user.UserInfoId > 0) {
            this.openSecurityDepositCommentModal(data.roi_comments_id);
          }
        }
      }
    });
    toast.present();
  }

  openDrecCommentModal(ID: any, DREC_DETAILS: any) {

    let DREC_DETAIL = DREC_DETAILS ? JSON.parse(DREC_DETAILS) : null;

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };


    let myModalData = [{
      LEASE_NUM: ID,
      DREC: DREC_DETAIL
    }];

    let myModal: Modal = this.modal.create('DrecCommentsPage', { data: myModalData }, myModalOptions);

    myModal.present();
    myModal.onWillDismiss(() => {
    });

  }

  presentToastForDrecComment(msg: any, data: any) {
    let message = data.title + '- ' + msg;

    console.log(message);
    let toast = this.toastCtrl.create({
      message: message,
      duration: 10000,
      position: 'top',
      showCloseButton: true,
      closeButtonText: "Open"
    });

    toast.onDidDismiss((_null, role) => {
      if (role == 'close' || role == 'Open') {
        if (data.trans_type == "DREC AUDIO") {
          if (this.user.UserInfoId > 0) {
            this.openDrecCommentModal(data.roi_comments_id, data.payment_details);
          }
        }
      }
    });
    toast.present();
  }

  presentToastForTaskComment(msg: any, data: any) {
    let message = data.title + '- ' + msg;

    console.log(message);
    let toast = this.toastCtrl.create({
      message: message,
      duration: 10000,
      position: 'top',
      showCloseButton: true,
      closeButtonText: "Open"
    });

    toast.onDidDismiss((_null, role) => {
      if (role == 'close' || role == 'Open') {
        if (data.trans_type == "TASK AUDIO") {
          if (this.user.UserInfoId > 0) {
            this.openTaskCommentModal(data.roi_comments_id, data.payment_details);
          }
        }
      }
    });
    toast.present();
  }


  presentToastForMomAudio(msg: any, data: any) {
    let message = data.title + '- ' + msg;

    console.log(message);
    let toast = this.toastCtrl.create({
      message: message,
      duration: 10000,
      position: 'top',
      showCloseButton: true,
      closeButtonText: "Open"
    });

    toast.onDidDismiss((_null, role) => {
      if (role == 'close' || role == 'Open') {
        if (data.trans_type == "MOM AUDIO") {
          if (this.user.UserInfoId > 0) {
            this.uploadMomAudio(data.mom_id, data.roi_comments_id, data.payment_details);
          }
        }
      }
    });
    toast.present();
  }

  presentToastForRoiAudio(msg: any, data: any) {
    let message = data.title + '- ' + msg;

    console.log(message);
    let toast = this.toastCtrl.create({
      message: message,
      duration: 10000,
      position: 'top',
      showCloseButton: true,
      closeButtonText: "Open"
    });

    toast.onDidDismiss((_null, role) => {
      if (role == 'close' || role == 'Open') {
        if (data.trans_type == "ROI AUDIO") {
          if (this.user.UserInfoId > 0) {
            this.uploadRoiAudio(data.roi_comments_id, data.roi_comments_child_id);
          }
        }
      }
    });
    toast.present();
  }

  presentToastForLegalPaymentReqComment(msg: any, data: any) {
    let message = data.title + '- ' + msg;

    console.log(message);
    let toast = this.toastCtrl.create({
      message: message,
      duration: 10000,
      position: 'top',
      showCloseButton: true,
      closeButtonText: "Open"
    });

    toast.onDidDismiss((_null, role) => {
      if (role == 'close' || role == 'Open') {
        if (data.trans_type == "LPR AUDIO") {
          if (this.user.UserInfoId > 0) {
            this.openLegalPaymentRequestCommentModal(data.roi_comments_id, data.payment_details);
          }
        }
      }
    });
    toast.present();
  }


  presentToastForChat(msg: any, data: any) {
    let message = data.title + '- ' + msg;
    let toast = this.toastCtrl.create({
      message: message,
      duration: 10000,
      position: 'top',
      showCloseButton: true,
      closeButtonText: "Open"
    });

    toast.onDidDismiss((_null, role) => {
      if (role == 'close' || role == 'Open') {
        if (data.trans_type != "TMS") {
          if (this.user.UserInfoId > 0) {
            this.openUserChat(data.chat_user_id, data.trans_type, data.group_name, data.roi_comments_id);
          }
        }
      }
    });

    toast.present();

  }

  presentToastForRoi(msg: any, data: any) {
    let message = data.title + '- ' + msg;
    console.log(message);
    let toast = this.toastCtrl.create({
      message: message,
      duration: 10000,
      position: 'top',
      showCloseButton: true,
      closeButtonText: "Open"
    });

    toast.onDidDismiss((_null, role) => {
      if (role == 'close' || role == 'Open') {
        if (data.trans_type == "Current" || data.trans_type == "Next") {
          if (this.user.UserInfoId > 0) {
            this.openRoiPage(data.trans_type);
          }
        }
      }
    });

    toast.present();

  }


  presentToastForAudioComment(msg: any, data: any) {
    let message = data.title + '- ' + msg;

    console.log(message);
    let toast = this.toastCtrl.create({
      message: message,
      duration: 10000,
      position: 'top',
      showCloseButton: true,
      closeButtonText: "Open"
    });

    toast.onDidDismiss((_null, role) => {
      if (role == 'close' || role == 'Open') {
        if (data.trans_type == "LPO AUDIO") {
          if (this.user.UserInfoId > 0) {
            this.openLPOModal(data.roi_comments_id);
          }
        }
      }
    });
    toast.present();
  }

  presentToastForFinancePaymentComment(msg: any, data: any) {
    let message = data.title + '- ' + msg;

    console.log(message);
    let toast = this.toastCtrl.create({
      message: message,
      duration: 10000,
      position: 'top',
      showCloseButton: true,
      closeButtonText: "Open"
    });

    toast.onDidDismiss((_null, role) => {
      if (role == 'close' || role == 'Open') {
        if (data.trans_type == "PR AUDIO") {
          if (this.user.UserInfoId > 0) {
            this.openFinancePaymentCommentModal(data.roi_comments_id);
          }
        }
      }
    });
    toast.present();
  }

  presentToastForCallComment(msg: any, data: any) {
    let message = data.title + '- ' + msg;

    console.log(message);
    let toast = this.toastCtrl.create({
      message: message,
      duration: 10000,
      position: 'top',
      showCloseButton: true,
      closeButtonText: "Open"
    });

    toast.onDidDismiss((_null, role) => {
      if (role == 'close' || role == 'Open') {
        if (data.trans_type == "CALL AUDIO") {
          if (this.user.UserInfoId > 0) {
            this.openCallCommentsModal(data.roi_comments_id, data.requster_name);
          }
        }
      }
    });
    toast.present();
  }

  openRoiPage(TRANS_TYPE: any) {

    console.log(TRANS_TYPE);
    this.myModalData = [
      this.TYPE = 'ROI NOTIFICATION'
    ]

    this.nav.push(DailytaskcommentPage, { data: this.myModalData }, { animate: false });

  };

  openLPOModal(LPO_ID: any) {

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    const myModalData = [{
      LPO_ID: LPO_ID
    }];

    //this.nav.push(Lpomodelcomments, { data: this.myModalData }, { animate: false });

    const myModal: Modal = this.modal.create('Lpomodelcomments', { data: myModalData }, myModalOptions);

    myModal.present();

    myModal.onDidDismiss((data) => {
      console.log("I have dismissed.");
      console.log(data);
    });

    myModal.onWillDismiss((data) => {
      console.log("I'm about to dismiss");
      console.log(data);
    });
  }


  openLegalPaymentRequestCommentModal(PAYMENT_REQUEST_ID: any, PAYMENT_DETAILS: any) {

    let PAYMENT_DETAIL = PAYMENT_DETAILS ? JSON.parse(PAYMENT_DETAILS) : null;

    debugger;
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };
    let myModalData = [{
      PAYMENT_REQUEST_ID: PAYMENT_REQUEST_ID,
      type: 'Payment Request',
      PAYMENT_REQ_BILL_ID: 0,
      PAYMENT_DETAIL: PAYMENT_DETAIL
    }];
    let myModal: Modal = this.modal.create('PaymentModalPage', { data: myModalData }, myModalOptions);

    myModal.present();
    myModal.onWillDismiss(() => {
    });

  }

  openCallCommentsModal(CALL_LOG_ID: any, REQUESTOR_NAME: any) {

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    const myModalData = [{
      CALL_LOG_ID: CALL_LOG_ID,
      REQUESTOR_NAME: REQUESTOR_NAME
    }];

    const myModal: Modal = this.modal.create('callcomments', { data: myModalData }, myModalOptions);

    myModal.present();

    myModal.onDidDismiss((data) => {
    });

  }

  openFinancePaymentCommentModal(PAYMENT_REQUEST_ID: any) {
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };
    let myModalData = [{
      PAYMENT_REQUEST_ID: PAYMENT_REQUEST_ID
    }];

    let myModal: Modal = this.modal.create('FinancePaymentCommentPage', { data: myModalData }, myModalOptions);

    myModal.present();
    myModal.onWillDismiss(() => {
    });
  }


  SearchTaskDetail(SEQ_TEXT: any) {
    let task_val = SEQ_TEXT;
    if (task_val != '') {
      let data = {
        SearchData: SEQ_TEXT,
        UserInfoId: this.user.UserInfoId
      }
      this.presentLoadingDefault(true);
      this.authService.postData(data, 'task/TaskManagementSearch').then((result) => {
        this.tasksearchlist = result;
        this.presentLoadingDefault(false);
        const myModalOptions: ModalOptions = {
          enableBackdropDismiss: false
        };

        this.myModalData = [
          this.tasksearchlist,
          'Search',
          task_val
        ];

        let myModal: Modal = this.modal.create('TaskManagementDetailPage', { data: this.myModalData }, myModalOptions);
        myModal.present();
        myModal.onDidDismiss((data) => {

        });
        myModal.onWillDismiss((data) => {
        });
      }, (err) => {
        this.presentLoadingDefault(false);
        this.presentToast(err);
      });
    }

  }

  openUserChat(ASSIGNED_USER_INFO_ID: any, TRANS_TYPE: any, GROUP_NAME: any, ROI_COMMENTS_ID: any) {
    let myModalData = [{
      USER_INFO_ID: ASSIGNED_USER_INFO_ID,
      TRANS_TYPE: TRANS_TYPE,
      GROUP_NAME: GROUP_NAME,
      ROI_COMMENTS_ID: ROI_COMMENTS_ID
    }];

    this.nav.push(ChatPage, { data: myModalData }, { animate: false });
  };

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

  open_Modal(TASK_ID: any) {
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let myModalData = [{
      TASK_ID: TASK_ID
    }];

    let myModal: Modal = this.modal.create('TaskCommentPage', { data: myModalData }, myModalOptions);

    myModal.present();
    myModal.onDidDismiss((data) => {
    });
    myModal.onWillDismiss((data) => {
    });
  }

  openPage(page) {
    if (page.component) {
      // if(page.page_access == 1){
      //   this.nav.setRoot(page.component);
      // }

      this.nav.setRoot(page.component);

    } else {
      let fcm = localStorage.getItem('fcmtoken');
      this.fcmdata = JSON.parse(fcm || null);
      console.log('Logout', this.fcmdata);

      if (this.fcmdata != null && this.fcmdata != undefined) {

        let fcmdata = {} as any;
        fcmdata.UserInfoId = this.user.UserInfoId;
        fcmdata.fcm_token = this.fcmdata.fcmtoken;

        this.authService.postData(fcmdata, 'account/updateuseractivestatus').then((result) => {
          //  console.log(result);
        }, (err) => {
          this.presentToast(err);
        });
      }

      localStorage.clear();
      this.nav.setRoot(LoginPage);
    }
  }

  initPage() {
    let user = localStorage.getItem('userData');
    let storedvalue = localStorage.getItem('RememberMe');
    this.user = JSON.parse(JSON.stringify(user || null));
    this.RememberMe = JSON.parse(JSON.stringify(storedvalue || null));
    if (this.RememberMe) {
      localStorage.setItem("isLogin", "true");
      console.log("userrrrrrrrrrr", this.user);
      // this.getPendingApproval(this.user.UserInfoId);
      return this.nav.push(DashboardPage, "true")
      //  DashboardPage;
      
    } else {
      return LoginPage;
    }
  }

  async presentAlert(data) {
    const alert = await this.alertCtrl.create({
      title: 'Alert',
      message: data,
      buttons: ['OK']
    });
    await alert.present();
  }
  unsub() {
    this.clickSub.unsubscribe();
  }
  simpleNotif(res:any) {
    this.clickSub = this.localNotifications.on('click').subscribe(data => {
      console.log("locallllllllllllllllll", data);
      this.presentAlert('Your notifiations contains a secret = ' + data.data.secret);
      this.unsub();
    });
    this.localNotifications.schedule({
      id: 1,
      text: 'Your pending approval is'+' '+res,
      data: { secret: 'secret' },
      badge:res

    });
  }

  getPendingApproval(user:any) {
    let time_bf = new Date();
    let context = {};
    this.authService.getData({}, 'Lpo/getPendingApprovals').then((result) => {
      this.branchListdetails = result;
      const newArray = this.branchListdetails.find(element => element.USER_INFO_ID == user.UserInfoId);
      console.log('branch Seconds:', newArray, user.UserInfoId);
      if(newArray != undefined){
      this.simpleNotif(newArray.FINANCE_PAY_COUNT);
      }
    }, (err) => { 
      console.log('branch Seconds error', err);
    });

  }

}
