import { Component } from '@angular/core';
import { IonicPage, Platform, NavController, Events, LoadingController, ToastController, NavParams, Modal, ModalController, ModalOptions, ViewController, AlertController } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { CasemanagementlablePage } from '../casemanagementlable/casemanagementlable';
import { PaymentRequestListPage } from '../paymentrequestlist/paymentrequestlist';
import { DrecPage } from '../drec/drec';
import { ChequeListLabelPage } from '../chequelistlabel/chequelistlabel';
import { RentPage } from '../rentrefund/rent';
import { HotoPage } from '../hoto/hoto';
import { PropertyManagementPage } from '../propertymanagement/propertymanagement';
import { CustomerServicePage } from '../customerserviceproperty/customerservice';
import { TaskManagementPage } from '../taskmanagement/taskmanagement';
import { ReturnChequeListPage } from '../returnchequelist/returnchequelist';
//import { EsculationPage } from '../esculation/esculation';
import { JobAssignmentListPage } from '../jobassignment/jobassignment';
import { FinanceListPage } from '../finance/finance';
import { CommentsToCommentsPage } from '../commentstocomments/commentstocomments';
import { NotificationPage } from '../notification/notification';
import { MyprofilePage } from '../myprofile/myprofile';
import { lpoPageModule } from '../lpo/lpo';
import { CallmanagementPage } from '../callmanagement/callmanagement';
import { AngularFireDatabase } from 'angularfire2/database';
import { Badge } from '@ionic-native/badge';
import { MinutesOfMeetingPage } from '../minutesofmeeting/minutesofmeeting';
import { SecurityDepositListPage } from '../securitydepositlist/securitydepositlist';
import { RentalBalanceLabelPage } from '../rentalbalancelabel/rentalbalancelabel';
import { RentalOverdueLabelPage } from '../rentaloverduelabel/rentaloverduelabel';
import { FinancePaymentDetailPage } from '../financepaymentrequestdetails/financepaymentrequestdetails';
import { DocumentTrackingLabelsPage } from '../documenttrackinglabels/documenttrackinglabels';
import { InventoryPage } from '../inventory/inventory';
import { ContractLabelsPage } from '../contractlabels/contractlabels';
import { UtilityPage } from '../utility/utility';
import { AttendancePage } from '../attendance/attendance';
import { ChequePage } from '../chequelist/cheque';
import { EsculationLabelPage } from '../esculationlabel/esculationlabel';
import { FinancePaymentRequestLabelPage } from '../financepaymentrequestlabel/financepaymentrequestlabel';
import { MyMeetingsPage } from '../mymeetings/mymeetings';
import { CeoesclatedPage } from '../ceoesclated/ceoesclated';
import { Constant } from '../../providers/constant/constant';

import { DrecLabelPage } from '../dreclabel/dreclabel';
import { ParkingPage } from '../parking/parking';
import { ChatPage } from '../chat/chat';
import { LocalNotifications } from '@ionic-native/local-notifications';

@IonicPage()
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
})

export class DashboardPage {

  notificationall = {
    MynotificationList: [] as any,
    TodayNotification: [] as any,
    YesterdayNotification: [] as any,
    LastWeekNotification: [] as any,
    notificationCount: [] as any
  } as any;

  Searchnotificationall = {} as any;
  escalationdetailsall = {} as any;
  useraccessdata = {} as any;
  today: any;
  rdata: any;
  CeoCount: any;
  CASE_CEO: any;
  PENDING_APPROVAL_CEO: any;
  PENDING_FOR_CEO_PAYMENT: any = 0;
  ESCALATION_TO_CEO_PAYMENT: any;
  CALL_MANAGE_CEO_ESCLATE: any;
  SEC_DEPOSIT_CEO_ESCALATION: any;
  SEC_DEPOSIT_CEO_APPROVAL: any;
  DREC_CEO_ESCLATION: any
  CHEQUE_CEO: any;
  RETURN_CHEQUE: any;
  escalationdetail: any;
  LPO_COUNT: any;
  Lpomanament: any;
  resourse: any;
  messages = [] as any;
  isSupport: any;
  hasPermission: any;
  total_msg_count: any;
  total_msg_count_1: any;
  singlemessages_list: any;
  groupmessagesAll: any;
  groupchatuser: any;
  groupNames: any;
  total_group_msg_count: any;
  total_group_msg: any;
  searchpaymentdetails = [] as any;
  modalnavigationdata: any;
  Escalation_to_coo_ceo: any;
  CHEQUE_APPROVAL_COUNT: any;

  WAITING_FOR_CEO_FINANCE_PAYMENT: any;
  ESCALATION_TO_CEO_FINANCE_PAYMENT: any;

  user: any = localStorage.getItem('userData');
  resourcedetails: any = localStorage.getItem('resourseData');
  myprofile: any;
  myprofilecount = 1;
  searchpaymentpendingapprovaldetails: any;
  show_escalation_count = 0;

  public profileImg: string;
  clickSub: any;
  clickSubPRF: any;
  loginData:any;


  constructor(public navCtrl: NavController, public toastCtrl: ToastController, public authService: RestProvider,
    public loadingCtrl: LoadingController, private modal: ModalController, public view: ViewController,
    public navParams: NavParams, public db: AngularFireDatabase, public badge: Badge,
    public constant: Constant, public events: Events,
    public platform: Platform, public localNotifications: LocalNotifications, public alertCtrl: AlertController, 
  ) {
    this.user = this.user ? JSON.parse(this.user) : {};
    this.resourcedetails = this.resourcedetails ? JSON.parse(this.resourcedetails) : {};

    this.today = Date.now();

    this.db.list('/user_message/').valueChanges().subscribe(data => {
      this.singlemessages_list = data;
      this.singlemessages_list = this.singlemessages_list.filter(y => y.receiver_id === this.user.UserInfoId && y.read_status == 0);
      this.total_msg_count = this.singlemessages_list.length;
    });

    this.db.list('/group_chat_messages/').valueChanges().subscribe(data => {
      this.groupmessagesAll = data;
    });

    this.db.list('/group_chat_user/').valueChanges().subscribe(data => {
      this.groupchatuser = data;
      this.groupNames = this.groupchatuser.filter(x => x.user_id == this.user.UserInfoId);
      this.total_group_msg_count = 0;
      for (let i = 0; i < this.groupNames.length; i++) {
        this.total_group_msg = this.groupmessagesAll.filter(y => y.group_name === this.groupNames[i].group_name && y.read_status == 0 && y.user_id != this.user.UserInfoId);
        this.total_msg_count += this.total_group_msg.length;
      }

    });

  }


  casemanagement() {
    if (this.useraccessdata.CASE_ACCESS == 1) {
      this.navCtrl.push(CasemanagementlablePage, {}, { animate: true, direction: 'forward' });
    }
  }

  paymentrequest() {
    if (this.useraccessdata.PAYMENT_REQUEST_ACCESS == 1) {
      this.navCtrl.push(PaymentRequestListPage, {}, { animate: true, direction: 'forward' });
    }
  }

  financepaymentrequest() {
    if (this.useraccessdata.FIN_PAY_REQ_ACCESS == 1) {
      this.navCtrl.push(FinancePaymentRequestLabelPage, {}, { animate: true, direction: 'forward' });
    }
  }

  documenttracking() {
    if (this.useraccessdata.DOC_TRACKING_ACCESS == 1) {
      this.navCtrl.push(DocumentTrackingLabelsPage, {}, { animate: true, direction: 'forward' });
    }
  }

  drec() {
    if (this.useraccessdata.DREC_ACCESS == 1) {
      //this.navCtrl.push(DrecPage, {}, { animate: true, direction: 'forward' });
      this.navCtrl.push(DrecLabelPage, {}, { animate: true, direction: 'forward' });
    }
  }

  returncheque() {
    if (this.useraccessdata.RETURN_CHQ_ACCESS == 1) {
      this.navCtrl.push(ReturnChequeListPage, {}, { animate: true, direction: 'forward' });
    }
  }

  cheque() {
    if (this.useraccessdata.CHEQUE_LIST_ACCESS == 1) {
      this.navCtrl.push(ChequeListLabelPage, {}, { animate: true, direction: 'forward' });
    }
  }

  rent_refund() {
    if (this.useraccessdata.RENT_REFUND_ACCESS == 1) {
      this.navCtrl.push(RentPage, {}, { animate: true, direction: 'forward' });
    }
  }

  hoto() {
    if (this.useraccessdata.HOTO_ACCESS == 1) {
      this.navCtrl.push(HotoPage, {}, { animate: true, direction: 'forward' });
    }
  }

  property() {
    if (this.useraccessdata.PROPERTY_LIST_ACCESS == 1) {
      this.navCtrl.push(PropertyManagementPage, {}, { animate: true, direction: 'forward' });
    }
  }

  customerservice() {
    if (this.useraccessdata.CUSTOMER_SERVICE_ACCESS == 1) {
      this.navCtrl.push(CustomerServicePage, {}, { animate: true, direction: 'forward' });
    }
  }

  taskmanagement() {
    if (this.useraccessdata.TASK_ACCESS == 1) {
      this.navCtrl.push(TaskManagementPage, {}, { animate: true, direction: 'forward' });
    }
  }

  securitydeposite() {
    if (this.useraccessdata.SECURITY_DEPOSIT_ACCESS == 1) {
      //this.navCtrl.push(SecurityDepositUnitPage, {}, { animate: true, direction: 'forward' });
      this.navCtrl.push(SecurityDepositListPage, {}, { animate: true, direction: 'forward' });
    }
  }

  escalation() {
    if (this.useraccessdata.ESCALATION_ACCESS == 1) {
      //this.navCtrl.push(EsculationPage, {}, { animate: true, direction: 'forward' });
      this.navCtrl.push(EsculationLabelPage, {}, { animate: true, direction: 'forward' });

      // const myModalOptions: ModalOptions = {
      //   enableBackdropDismiss: false
      // };

      // let myModalData = [{
      //   user_info_id: this.user.UserInfoId
      // }];

      // let myModal: Modal = this.modal.create(EsculationLabelPage, { data: myModalData }, myModalOptions);

      // myModal.present();
      // myModal.onDidDismiss((data) => {
      // });
      // myModal.onWillDismiss((data) => {
      // });

    }

  }

  jobassignments() {
    if (this.useraccessdata.JD_ACCESS == 1) {
      this.navCtrl.push(JobAssignmentListPage, {}, { animate: true, direction: 'forward' });
    }
  }

  finance() {
    if (this.useraccessdata.FINANCE_ACCESS == 1) {
      this.navCtrl.push(FinanceListPage, {}, { animate: true, direction: 'forward' });
    }
  }

  comments() {
    if (this.useraccessdata.COMMENTS_ACCESS == 1) {
      this.navCtrl.push(CommentsToCommentsPage, {}, { animate: true, direction: 'forward' });
    }
  }

  notification() {
    if (this.useraccessdata.NOTIFICATION_ACCESS == 1) {
      this.navCtrl.push(NotificationPage, {}, { animate: true, direction: 'forward' });
    }
  }

  profile() {
    if (this.useraccessdata.MYPROFILE_ACCESS == 1) {
      this.navCtrl.push(MyprofilePage, {}, { animate: true, direction: 'forward' });

      // const myModalOptions: ModalOptions = {
      //   enableBackdropDismiss: false
      // };

      // let myModalData = [{
      //   user_info_id: this.user.UserInfoId
      // }];

      // let modelpage = '';


      // let myModal: Modal = this.modal.create(MyprofilePage, { data: myModalData }, myModalOptions);

      // myModal.present();
      // myModal.onDidDismiss((data) => {
      // });
      // myModal.onWillDismiss((data) => {
      // });

    }

  }

  lpo() {
    if (this.useraccessdata.LPO_ACCESS == 1) {
      this.navCtrl.push(lpoPageModule, {}, { animate: true, direction: 'forward' });
    }
  }

  call_management() {
    if (this.useraccessdata.CALL_MANAGEMENT_ACCESS == 1) {
      this.navCtrl.push(CallmanagementPage, {}, { animate: true, direction: 'forward' });
    }
  }

  chatoption() {
    //this.navCtrl.push(ChatPage, {}, { animate: true, direction: 'forward' });

    if (this.useraccessdata.CHAT_ACCESS == 1) {

      this.navCtrl.push(ChatPage, {}, { animate: true, direction: 'forward' });

      // const myModalOptions: ModalOptions = {
      //   enableBackdropDismiss: false
      // };

      // let myModalData = [{
      //   user_info_id: this.user.UserInfoId
      // }];

      // let modelpage = '';
      // modelpage = 'ChatPage';

      // let myModal: Modal = this.modal.create(modelpage, { data: myModalData }, myModalOptions);

      // myModal.present();
      // myModal.onDidDismiss((data) => {

      // });
      // myModal.onWillDismiss((data) => {

      // });

    }
  }

  minutesOfMeeting() {
    if (this.useraccessdata.MOM_ACCESS == 1) {
      this.navCtrl.push(MinutesOfMeetingPage, {}, { animate: true, direction: 'forward' });
    }
  }

  rentalbalance() {
    if (this.useraccessdata.RENTAL_BALANCE_ACCESS == 1) {
      this.navCtrl.push(RentalBalanceLabelPage, {}, { animate: true, direction: 'forward' });
    }

  }

  rentaloverdue() {
    if (this.useraccessdata.RENTAL_OVERDUE_ACCESS == 1) {
      this.navCtrl.push(RentalOverdueLabelPage, {}, { animate: true, direction: 'forward' });
    }
  }

  inventory() {
    if (this.useraccessdata.INVENTORY_ACCESS == 1) {
      this.navCtrl.push(InventoryPage, {}, { animate: true, direction: 'forward' });
    }
  }

  contract() {
    if (this.useraccessdata.CONTRACT_ACCESS == 1) {
      this.navCtrl.push(ContractLabelsPage, {}, { animate: true, direction: 'forward' });
    }
  }

  utility() {
    if (this.useraccessdata.UTILITY_ACCESS == 1) {
      this.navCtrl.push(UtilityPage, {}, { animate: true, direction: 'forward' });
    }
  }

  attendance() {
    if (this.useraccessdata.ATTENDANCE_ACCESS == 1) {
      this.navCtrl.push(AttendancePage, {}, { animate: true, direction: 'forward' });
    }
  }

  parking() {
    if (this.useraccessdata.PARKING_ACCESS == 1) {
      this.navCtrl.push(ParkingPage, {}, { animate: true, direction: 'forward' });
    }
  }

  getNotificationList() {
    let time_bf = new Date();
    let userdata = {
      UserInfoId: this.user.UserInfoId,
      UserEmployeeId: this.user.UserEmployeeId
    }

    if (this.user.UserInfoId != undefined || this.user.UserInfoId > 0) {
      this.authService.dashboardPostData(userdata, 'notification/getNotificationCount').then((result) => {
        this.notificationall = result;
        console.log(this.notificationall);
        let time_af = new Date();
        let seconds = Math.round((time_af.getTime() - time_bf.getTime()) / 1000);
        console.log(' Notification Seconds:', seconds);
      }, (err) => {
        console.log(err);
      });
    } else {
      console.log('Failed User Id');
    }
  }

  getUserAccessForm() {
    let time_bf = new Date();
    let userdata = {
      UserInfoId: this.user.UserInfoId,
      UserEmployeeId: this.user.UserEmployeeId
    }

    if (this.user.UserInfoId != undefined || this.user.UserInfoId > 0) {

      this.authService.dashboardPostData(userdata, 'dashboard/getUserAccessForm').then((result) => {
        this.useraccessdata = result;

        this.getNotificationList();

        let time_af = new Date();
        let seconds = Math.round((time_af.getTime() - time_bf.getTime()) / 1000);
        console.log(' getUserAccessForm Seconds:', seconds);

      }, (err) => {
        console.log(err);
        this.navCtrl.setRoot(this.navCtrl.getActive().component);
      });
    } else {
      this.navCtrl.setRoot(this.navCtrl.getActive().component);
    }
  }

  getCeoCount() {
    let time_bf = new Date();
    let userdata = {
      UserInfoId: this.user.UserInfoId,
      userType: this.resourse.TYPE_USER
    }

    if (this.user.UserInfoId != undefined || this.user.UserInfoId > 0) {

      this.authService.dashboardPostData(userdata, 'dashboard/getCEOCOUNT').then((result) => {

        this.CeoCount = result;
        this.CASE_CEO = this.CeoCount.find(x => x.LABLE_TYPE == 'CASE_CEO').LABLE_COUNT;
        this.ESCALATION_TO_CEO_PAYMENT = this.CeoCount.find(x => x.LABLE_TYPE == 'ESCALATION_TO_CEO_PAYMENT').LABLE_COUNT;
        this.CHEQUE_CEO = this.CeoCount.find(x => x.LABLE_TYPE == 'CHEQUE_CEO').LABLE_COUNT;
        this.RETURN_CHEQUE = this.CeoCount.find(x => x.LABLE_TYPE == 'RETURN_CHEQUE').LABLE_COUNT;
        this.CALL_MANAGE_CEO_ESCLATE = this.CeoCount.find(x => x.LABLE_TYPE == 'CALL_MANAGEMENT_CEO_ESCLATION').LABLE_COUNT;
        this.SEC_DEPOSIT_CEO_ESCALATION = this.CeoCount.find(x => x.LABLE_TYPE == 'SECURITY_DEPOSIT_CEO_ESCALATION').LABLE_COUNT;
        this.DREC_CEO_ESCLATION = this.CeoCount.find(x => x.LABLE_TYPE == 'DREC_CEO_ESCLATION').LABLE_COUNT;


        this.PENDING_FOR_CEO_PAYMENT = this.CeoCount.find(x => x.LABLE_TYPE == 'PENDING_FOR_CEO_PAYMENT').LABLE_COUNT;
        this.CHEQUE_APPROVAL_COUNT = this.CeoCount.find(x => x.LABLE_TYPE == 'CHEQUE_CEO_APPROVAL').LABLE_COUNT;
        this.SEC_DEPOSIT_CEO_APPROVAL = this.CeoCount.find(x => x.LABLE_TYPE == 'SECURITY_DEPOSIT_COO_CEO_APPROVAL').LABLE_COUNT;

        this.escalationdetail = parseInt(this.CASE_CEO) + parseInt(this.CHEQUE_CEO) + parseInt(this.ESCALATION_TO_CEO_PAYMENT) + parseInt(this.RETURN_CHEQUE) + parseInt(this.CALL_MANAGE_CEO_ESCLATE) + parseInt(this.DREC_CEO_ESCLATION) + parseInt(this.SEC_DEPOSIT_CEO_ESCALATION);

        let time_af = new Date();
        let seconds = Math.round((time_af.getTime() - time_bf.getTime()) / 1000);
        console.log('getCeoCount Seconds:', seconds);

      }, (err) => {
        console.log(err);
      });
    } else {
      //this.presentLoadingDefault(false);
    }
  }

  getLpodetails() {
    let time_bf = new Date();
    let lpo_type = '';

    if (this.resourse.TYPE_USER == 'COO') {
      lpo_type = 'WCOOA';
    } else if (this.resourse.TYPE_USER == 'CEO') {
      lpo_type = 'WCEOA';
    } else {
      lpo_type = 'USER_BASED';
    }

    let context = { LBL_TYPE: lpo_type, USER_ID: this.user.UserInfoId };

    //console.log(context);

    this.authService.postData(context, 'Lpo/GetLpoListByType').then((result) => {
      this.Lpomanament = result;
      this.LPO_COUNT = this.Lpomanament.length ? this.Lpomanament.length : 0;
      if (this.LPO_COUNT > 0) {
        let time_bf = new Date();
        let params = {
          user_info_id: this.user.UserInfoId,
          resource_type_id: this.resourcedetails.TYPE_ID,
          resource_type_user: this.resourcedetails.TYPE_USER,
          label_type: this.resourcedetails.TYPE_USER
        };

        this.authService.postData(params, 'payment/GetFinancePaymentPendingApprovalCount').then((result) => {
          this.WAITING_FOR_CEO_FINANCE_PAYMENT = this.searchpaymentpendingapprovaldetails.length;
          //console.log(this.searchpaymentpendingapprovaldetails);
          let isLogin = localStorage.getItem("isLogin");
          console.log("isLoginnnnn", this.loginData)
          if(this.loginData == "true"){
            this.simpleNotif(this.LPO_COUNT, this.WAITING_FOR_CEO_FINANCE_PAYMENT);
            this.loginData = "false";
            localStorage.removeItem("isLogin");
          }
          
        }, (err) => {
          console.log(err);
        });
        
      }
      let time_af = new Date();
      let seconds = Math.round((time_af.getTime() - time_bf.getTime()) / 1000);
      console.log('getLpodetails Seconds:', seconds);

    }, (err) => {
      console.log(err)
    });
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
  unsubPRF() {
    this.clickSubPRF.unsubscribe();
  }
  simpleNotif(res: any, prfCount:any) {
    console.log("sum of countttttttttt", prfCount+res);
    this.clickSub = this.localNotifications.on('click').subscribe(data => {
      console.log("locallllllllllllllllll", data);
      this.presentAlert('Your notifiations contains a secret = ' + data.data.secret);
      this.unsub();
    });
    this.localNotifications.schedule({
      id: 1,
      text: 'Your pending approval is' + ' ' + res,
      data: { secret: 'secret' },
      badge: res+prfCount
    });
  }

  simplePRF(res: any) {
    this.clickSubPRF = this.localNotifications.on('click').subscribe(data => {
      console.log("locallllllllllllllllll", data);
      this.presentAlert('Your notifiations contains a secret = ' + data.data.secret);
      this.unsubPRF();
    });
    this.localNotifications.schedule({
      id: 2,
      text: 'Your pending payment request is' + ' ' + res,
      data: { secret: 'secret' },
      badge: res

    });
  }

  GetAllresourse_list() {
    //this.presentLoadingDefault(true);
    let time_bf = new Date();
    this.authService.getData({}, 'Lpo/Getallresourse/' + this.user.UserInfoId + '').then((result) => {
      this.resourse = result[0];
      localStorage.setItem('resourseData', JSON.stringify(result[0]));

      let time_af = new Date();
      let seconds = Math.round((time_af.getTime() - time_bf.getTime()) / 1000);
      console.log(' GetAllresourse_list Seconds:', seconds);

      this.getLpodetails();
    }, (err) => {
      //this.presentLoadingDefault(false);
      //this.presentToast(err);
    });
  }

  getLength() {
    let Waiting_For_Manager_Verification = this.Lpomanament.filter(call => call.STATUS_ID === 1 && call.NEXT_APPROVAL_TYPE != 9 && call.NEXT_APPROVAL_TYPE != 13 && call.NEXT_APPROVAL_TYPE != 23);
    let Waiting_For_Finance_Confirmation = this.Lpomanament.filter(call => call.STATUS_ID === 1 && (call.NEXT_APPROVAL_TYPE === 9 || call.NEXT_APPROVAL_TYPE === 13));
    let Waiting_For_General_Manager_Approval = this.Lpomanament.filter(call => call.STATUS_ID === 1 && call.NEXT_APPROVAL_TYPE === 23);
    let Waiting_For_COO_Approval = this.Lpomanament.filter(call => call.STATUS_ID === 3);
    let Waiting_For_CEO_Approval = this.Lpomanament.filter(call => call.STATUS_ID === 4);

    if (this.resourse.TYPE_USER == 'Manager') {
      this.LPO_COUNT = Waiting_For_Manager_Verification.length;
    } else if (this.resourse.TYPE_USER == 'Finance-MGR') {
      this.LPO_COUNT = Waiting_For_Finance_Confirmation.length;
    } else if (this.resourse.TYPE_USER == 'General Manager') {
      this.LPO_COUNT = Waiting_For_General_Manager_Approval.length;
    } else if (this.resourse.TYPE_USER == 'COO') {
      this.LPO_COUNT = Waiting_For_COO_Approval.length;
    } else if (this.resourse.TYPE_USER == 'CEO') {
      this.LPO_COUNT = Waiting_For_CEO_Approval.length;
    } else {
      this.LPO_COUNT = 0;
    }


  };

  getLpoCeoCooCount() {
    let time_bf = new Date();
    this.authService.getData({}, 'Lpo/getLpoCount').then((result) => {
      this.Escalation_to_coo_ceo = result['ESCALATION_CEO_COO'];
      //this.presentLoadingDefault(false);
      let time_af = new Date();
      let seconds = Math.round((time_af.getTime() - time_bf.getTime()) / 1000);
      console.log(' getLpoCeoCooCount Seconds:', seconds);
    }, (err) => {
      // this.presentLoadingDefault(false);
      // console.log()
    });
  }



  getEscalation() {
    let time_bf = new Date();
    let userdata = {
      UserInfoId: this.user.UserInfoId,
      UserEmployeeId: this.user.UserEmployeeId
    }
    this.authService.dashboardPostData(userdata, 'escalation/EscalationList').then((result: any) => {
      let escData = result.AllEscalation
      this.escalationdetail = escData.length;
      let time_af = new Date();
      let seconds = Math.round((time_af.getTime() - time_bf.getTime()) / 1000);
      console.log(' getEscalation Seconds:', seconds);

    }, (err) => {
      //this.presentLoadingDefault(false);
      //this.presentToast(err);
    });
  }

  ionViewWillEnter() {
    this.today = Date.now();
    console.log("loginDataNavvvvvv", this.navParams.data);
    this.loginData = this.navParams.data;
    this.profileImg = 'http://flexion.fakhruddinproperties.com:8883/profile/' + this.user.UserInfoId + '/myimage.jpeg';
    // console.log(this.user);
    // console.log(this.resourcedetails);
    localStorage.setItem('resourseData', JSON.stringify(this.user.resourseData));
    this.resourse = this.user.resourseData;
    localStorage.setItem('useraccessdata', JSON.stringify(this.user.useraccessdata));
    this.events.publish('useraccess');
    this.useraccessdata = this.user.useraccessdata;

    if (this.resourcedetails.TYPE_USER == 'CEO') {
      this.show_escalation_count = 1;
    } else if (this.resourcedetails.TYPE_USER == 'COO') {
      this.show_escalation_count = 1;
    } else if (this.user.UserInfoId == 2) {
      this.show_escalation_count = 1;
    } else {
      this.show_escalation_count = 0;
    }

    if (this.resourcedetails.USER_PROFILE_ID > 0) {
      this.myprofilecount = 1;
    } else {
      this.myprofilecount = 0;
    }


    //this.GetAllresourse_list();
    //this.getmyprofiledetails();

    if (this.useraccessdata.NOTIFICATION_ACCESS == 1) {
      this.getNotificationList();
    }

    if (this.useraccessdata.NOTIFICATION_ACCESS == 1) {
      this.getNotificationList();
    }

    if (this.useraccessdata.LPO_ACCESS == 1) {
      this.getLpodetails();
      this.getLpoCeoCooCount();
    }



    //this.paymentdetails();
    this.getInsertRoiHeader();
    //this.getUserAccessForm();
    if (this.useraccessdata.FIN_PAY_REQ_ACCESS == 1) {
      this.financepaymentdetails();
      this.financepaymentCeoEscalation();
    }

    if (this.useraccessdata.PAYMENT_REQUEST_ACCESS == 1 || this.useraccessdata.RETURN_CHQ_ACCESS == 1 || this.useraccessdata.SECURITY_DEPOSIT_ACCESS == 1 || this.useraccessdata.ESCALATION_ACCESS == 1) {
      this.getCeoCount();
    }

    //this.getEscalation();

  }


  financepaymentdetails() {
    let time_bf = new Date();
    let params = {
      user_info_id: this.user.UserInfoId,
      resource_type_id: this.resourcedetails.TYPE_ID,
      resource_type_user: this.resourcedetails.TYPE_USER,
      label_type: this.resourcedetails.TYPE_USER
    };

    this.authService.postData(params, 'payment/GetFinancePaymentPendingApprovalCount').then((result) => {
      this.searchpaymentpendingapprovaldetails = result;
      let isLogin = localStorage.getItem("isLogin");
      if(this.loginData == "true"){
      this.WAITING_FOR_CEO_FINANCE_PAYMENT = this.searchpaymentpendingapprovaldetails.length;
      this.simplePRF(this.WAITING_FOR_CEO_FINANCE_PAYMENT);
      // this.loginData = "false";
      localStorage.removeItem("isLogin");
      }
      //console.log(this.searchpaymentpendingapprovaldetails);
      let time_af = new Date();
      let seconds = Math.round((time_af.getTime() - time_bf.getTime()) / 1000);
      console.log(' financepaymentdetails Seconds:', seconds);
    }, (err) => {
      console.log(err);
    });
  }

  financepaymentCeoEscalation() {
    let time_bf = new Date();

    let params = {
      user_info_id: this.user.UserInfoId,
      resource_type_id: this.resourcedetails.TYPE_ID,
      resource_type_user: this.resourcedetails.TYPE_USER
    };

    this.authService.postData(params, 'payment/getFinancePaymentCount').then((result) => {
      this.searchpaymentdetails = result;
      //console.log(this.searchpaymentdetails);
      this.ESCALATION_TO_CEO_FINANCE_PAYMENT = this.searchpaymentdetails.ESCALATION_COO_CEO;
      let time_af = new Date();
      let seconds = Math.round((time_af.getTime() - time_bf.getTime()) / 1000);
      console.log(' financepaymentCeoEscalation Seconds:', seconds);
    }, (err) => {
      console.log(err);
    });

  }



  // getmyprofiledetails() {
  //   let time_bf = new Date();
  //   this.authService.getData({}, 'account/Getmyprofileupdate/' + this.user.UserInfoId + '').then((result) => {
  //     this.myprofile = result;
  //     if (this.myprofile.length > 0) {
  //       this.myprofilecount = 1;
  //     }else{
  //       this.myprofilecount = 0;
  //     }
  //     let time_af = new Date();
  //     let seconds = Math.round((time_af.getTime() - time_bf.getTime()) / 1000);
  //     console.log(' getmyprofiledetails Seconds:', seconds);

  //   }, (err) => {
  //     this.presentToast(err);
  //   });
  // }

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
      this.loading.dismiss();
      this.loading = null
    }
  };

  paymentdetails() {

    let time_bf = new Date();
    this.authService.getData({}, 'payment/getPendingCeoPaymentList').then((result) => {
      this.searchpaymentdetails = result;

      //console.log('Pending CEO Payment List', this.searchpaymentdetails);
      let time_af = new Date();
      let seconds = Math.round((time_af.getTime() - time_bf.getTime()) / 1000);
      console.log('paymentdetails Seconds:', seconds);

    }, (err) => {
      this.presentToast(err);
    });

  }

  OpenPaymentDetailModal(PAY_REQ_STATUS: any) {
    if (this.useraccessdata.PAYMENT_REQUEST_ACCESS == 1) {
      this.rdata = localStorage.getItem('resourseData');
      this.rdata = this.rdata ? JSON.parse(this.rdata) : { TYPE_USER: null };

      if (this.rdata.TYPE_USER == 'CEO') {

        let time_bf = new Date();
        this.authService.getData({}, 'payment/getPendingCeoPaymentList').then((result) => {
          this.searchpaymentdetails = result;
          this.modalnavigationdata = this.searchpaymentdetails.pendingceodata;

          let time_af = new Date();
          let seconds = Math.round((time_af.getTime() - time_bf.getTime()) / 1000);
          console.log('paymentdetails Seconds:', seconds);

          const myModalOptions: ModalOptions = {
            enableBackdropDismiss: false
          };


          let myModalData = [{
            CASE_REQUEST_ID: 0,
            PAY_REQ_STATUS: PAY_REQ_STATUS,
            CASE_REQUEST: this.modalnavigationdata,
            LABEL_TYPE: ''
          }];
          let myModal: Modal = this.modal.create('PaymentDetailPage', { data: myModalData }, myModalOptions);
          myModal.present();
          myModal.onDidDismiss((data) => {
            this.getCeoCount();
          });
          myModal.onWillDismiss((data) => {
          });

        }, (err) => {
          this.presentToast(err);
        });

      }
    }
  }

  OpenLegalPaymentEscalationCeo(PAY_REQ_STATUS: any) {

    if (this.useraccessdata.PAYMENT_REQUEST_ACCESS == 1) {

      this.rdata = localStorage.getItem('resourseData');
      this.rdata = this.rdata ? JSON.parse(this.rdata) : { TYPE_USER: null };


      if (this.rdata.TYPE_USER == 'CEO') {

        let time_bf = new Date();
        this.authService.getData({}, 'payment/getPendingCeoPaymentList').then((result) => {
          this.searchpaymentdetails = result;
          this.modalnavigationdata = this.searchpaymentdetails.escalation_to_ceo;
          //console.log('Escalation CEO', this.modalnavigationdata);
          let time_af = new Date();
          let seconds = Math.round((time_af.getTime() - time_bf.getTime()) / 1000);
          console.log('paymentdetails Seconds:', seconds);

          const myModalOptions: ModalOptions = {
            enableBackdropDismiss: false
          };

          let myModalData = [{
            CASE_REQUEST_ID: 0,
            PAY_REQ_STATUS: PAY_REQ_STATUS,
            CASE_REQUEST: this.modalnavigationdata,
            LABEL_TYPE: 'Escalation CEO'
          }];

          let myModal: Modal = this.modal.create('PaymentDetailPage', { data: myModalData }, myModalOptions);
          myModal.present();
          myModal.onDidDismiss((data) => {
            this.getCeoCount();
          });
          myModal.onWillDismiss((data) => {
          });

        }, (err) => {
          this.presentToast(err);
        });


      }
    }
  }

  OpenLpoEscalationtoceocoo() {

    if (this.useraccessdata.LPO_ACCESS == 1) {
      const myModalOptions: ModalOptions = {
        enableBackdropDismiss: false
      };

      let mymodaldata = [{
        search_value: '',
        Lpomanament: [],
        type: 'Escalation to COO/CEO'
      }]

      const myModal: Modal = this.modal.create('lpooption', { data: mymodaldata }, myModalOptions);

      myModal.present();

      myModal.onDidDismiss(() => {
        //console.log("I have dismissed.");
        this.getLpoCeoCooCount();
      });

      myModal.onWillDismiss(() => {
        //console.log("I'm about to dismiss");
        this.getLpoCeoCooCount();
      });

    }
  }

  OpenLpoApproval() {

    if (this.useraccessdata.LPO_ACCESS == 1) {
      const myModalOptions: ModalOptions = {
        enableBackdropDismiss: false
      };

      let label_type = '';
      if (this.resourcedetails.TYPE_USER == 'CEO') {
        label_type = 'CEO';
      } else if (this.resourcedetails.TYPE_USER == 'COO') {
        label_type = 'COO';
      } else {
        label_type = 'USER_BASED';
      }

      let mymodaldata = [{
        search_value: '',
        Lpomanament: [],
        type: label_type
      }]

      const myModal: Modal = this.modal.create('lpooption', { data: mymodaldata }, myModalOptions);

      myModal.present();

      myModal.onDidDismiss(() => {
        //console.log("I have dismissed.");
        this.getLpoCeoCooCount();
      });

      myModal.onWillDismiss(() => {
        //console.log("I'm about to dismiss");
        this.getLpoCeoCooCount();
      });

    }
  }

  getInsertRoiHeader() {
    let time_bf = new Date();
    let commentsData = {
      created_by: this.user.UserInfoId,
      modified_by: this.user.UserInfoId,
      insert_type: 'Current',
      comments_type: 'R'
    }

    this.authService.postData(commentsData, 'task/getInsertRoiWeekLabel').then((result) => {
      //console.log('Roi header is inserted: ' + result);
      let time_af = new Date();
      let seconds = Math.round((time_af.getTime() - time_bf.getTime()) / 1000);
      console.log(' getInsertRoiHeader Seconds:', seconds);
    }, (err) => {
      this.presentToast(err);
    });

  }


  MyMeeting() {
    if (this.useraccessdata.MOM_ACCESS == 1) {
      this.navCtrl.push(MyMeetingsPage, {}, { animate: true, direction: 'forward' });
    }
    // const myModalOptions: ModalOptions = {
    //   enableBackdropDismiss: false
    // };

    // let myModalData = [{
    //   user_info_id: this.user.UserInfoId
    // }];

    // let modelpage = '';
    // modelpage = 'MyMeetingsPage';

    // let myModal: Modal = this.modal.create(modelpage, { data: myModalData }, myModalOptions);

    // myModal.present();
    // myModal.onDidDismiss((data) => {
    // });
    // myModal.onWillDismiss((data) => {
    // });

  }

  openDetailModal(type: any) {
    if (this.useraccessdata.CHEQUE_LIST_ACCESS == 1) {
      const myModalOptions: ModalOptions = {
        enableBackdropDismiss: false
      };

      let flag = 'N';

      let myModalData = [{
        type: type
      }];

      if (type == 'CHECEOAPPROVAL' && this.CHEQUE_APPROVAL_COUNT > 0) {
        flag = 'Y'
      }

      if (type == 'ESCCEO' && this.CHEQUE_CEO > 0) {
        flag = 'Y'
      }

      if (flag == 'Y') {

        let myModal: Modal = this.modal.create(ChequePage, { data: myModalData }, myModalOptions);
        myModal.present();

        myModal.onDidDismiss(() => {
        });
        myModal.onWillDismiss(() => {
        });
      }
    }
  }


  OpenFinancePaymentDetailModal(type: any) {
    if (this.useraccessdata.FIN_PAY_REQ_ACCESS == 1) {
      const myModalOptions: ModalOptions = {
        enableBackdropDismiss: false
      };

      let flag = 'N';
      let label_type = '';

      if (this.resourcedetails.TYPE_USER == 'CEO') {
        label_type = 'Wait for CEO approval';
        flag = 'Y';
      } else if (this.resourcedetails.TYPE_USER == 'COO') {
        label_type = 'Wait for COO approval';
        flag = 'Y';
      } else {
        label_type = 'User Pending';
        flag = 'Y';
      }


      if (type == 'CEOCOO_APPROVAL' && this.WAITING_FOR_CEO_FINANCE_PAYMENT > 0) {
        flag = 'Y';
      }

      if (type == 'CEO_ESCALATION' && this.ESCALATION_TO_CEO_FINANCE_PAYMENT > 0) {
        flag = 'Y';
        label_type = 'Escalation to COO-CEO';
      }

      if (flag == 'Y') {

        let myModalData = [{
          type: label_type
        }];

        let myModal: Modal = this.modal.create(FinancePaymentDetailPage, { data: myModalData }, myModalOptions);
        myModal.present();

        myModal.onDidDismiss(() => {
        });
        myModal.onWillDismiss(() => {
        });

      }
    }
  }


  OpenCaseEscalationtoceocoo(type: any) {
    if (this.useraccessdata.CASE_ACCESS == 1) {
      const myModalOptions: ModalOptions = {
        enableBackdropDismiss: false
      };

      let myModalData = {
        Type: type,
        SearchData: ''
      };

      let myModal: Modal = this.modal.create('CasemanagementPage', { data: myModalData }, myModalOptions);

      myModal.present();

      myModal.onDidDismiss((data) => {

      });

      myModal.onWillDismiss((data) => {
      });
    }
  }

  OpenReturnChequeEscalation(type: any) {
    if (this.useraccessdata.RETURN_CHQ_ACCESS == 1) {
      const myModalOptions: ModalOptions = {
        enableBackdropDismiss: false
      };

      let myModalData = [{
        type: type
      }];

      let myModal: Modal = this.modal.create('ReturnChequePage', { data: myModalData }, myModalOptions);

      myModal.present();

      myModal.onDidDismiss(() => {
      });

      myModal.onWillDismiss(() => {
      });
    }
  }


  OpenDrecEscalation(type: any) {
    if (this.useraccessdata.DREC_ACCESS == 1) {
      const myModalOptions: ModalOptions = {
        enableBackdropDismiss: false
      };

      let mymodaldata = [{
        type: type
      }]

      let myModal: Modal = this.modal.create('DrecDetailsPage', { data: mymodaldata }, myModalOptions);
      myModal.present();

      myModal.onDidDismiss((data) => {
      });

      myModal.onWillDismiss((data) => {
      });
    }
  }

  OpenSecDepEscalation(type: any) {
    if (this.useraccessdata.SECURITY_DEPOSIT_ACCESS == 1) {
      const myModalOptions: ModalOptions = {
        enableBackdropDismiss: false
      };

      let myModalData = [{
        type: type
      }];

      let myModal: Modal = this.modal.create('SecurityDepositDetailPage', { data: myModalData }, myModalOptions);
      myModal.present();

      myModal.onDidDismiss((data) => {
      });

      myModal.onWillDismiss((data) => {
      });

    }
  }


  CEO_ESCLATED_COUNTbtn() {
    if (this.useraccessdata.CALL_MANAGEMENT_ACCESS == 1) {
      const myModalOptions: ModalOptions = {
        enableBackdropDismiss: false
      };

      let mymodaldata = [{
        inspection: 1
      }]

      const myModal: Modal = this.modal.create(CeoesclatedPage, { data: mymodaldata }, myModalOptions);

      myModal.present();

      myModal.onDidDismiss(() => {
        console.log("I have dismissed.");
      });

      myModal.onWillDismiss(() => {
        console.log("I'm about to dismiss");
      });

    }
  }

}
