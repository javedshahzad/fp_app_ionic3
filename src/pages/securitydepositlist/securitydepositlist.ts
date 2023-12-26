import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController, Modal, ModalController, ModalOptions, ViewController } from 'ionic-angular';
import { DashboardPage } from '../dashboard/dashboard';
import { RestProvider } from '../../providers/rest/rest';

 
@Component({
  selector: 'page-securitydepositlist',
  templateUrl: 'securitydepositlist.html',
})
export class SecurityDepositListPage {
  paymentdetailsall: any;
  searchpaymentdetails = [] as any;
  insertedValues: any;
  modalnavigationdata: any;
  payment_list_show = 'none';
  payment_list = 'block';
  securitydepositlist: any;
  
  CeoCount: any;
  SEC_DEPOSIT_CEO_APPROVAL: any;
  SEC_DEPOSIT_CEO_APPROVAL_COUNT: any;
  ESCALATION_CEO_COO: any;
  ESCALATION_CEO_COO_COUNT: any;
  SEC_DEPOSIT_NOT_INITIATED:any;
  SEC_DEPOSIT_NOT_INITIATED_COUNT:any;

  SEC_PENDING_MAINT_FM:any;
  SEC_PENDING_MAINT_FM_COUNT:any;

  SEC_DEPOSIT_PENDING_LEASE_VERIFICATION:any;
  SEC_DEPOSIT_PENDING_LEASE_VERIFICATION_COUNT:any;

  SEC_DEPOSIT_CLIENT_APPROVAL:any;
  SEC_DEPOSIT_CLIENT_APPROVAL_COUNT:any;

  SEC_DEPOSIT_INV_CREATION:any;
  SEC_DEPOSIT_INV_CREATION_COUNT:any;

  SEC_DEPOSIT_FINANCE_VER:any;
  SEC_DEPOSIT_FINANCE_VER_COUNT:any;

  SEC_DEPOSIT_UNDER_CHQ:any;
  SEC_DEPOSIT_UNDER_CHQ_COUNT:any;

  SEC_DEPOSIT_DIRECTOR_SIGN:any;
  SEC_DEPOSIT_DIRECTOR_SIGN_COUNT:any;

  SEC_DEPOSIT_AMT_REL_CLIENT:any;
  SEC_DEPOSIT_AMT_REL_CLIENT_COUNT:any;

  GURANTEE_CHQ_RELEASED:any;
  GURANTEE_CHQ_RELEASED_COUNT:any;

  HANDOVER_TO_CLIENT:any;
  HANDOVER_TO_CLIENT_COUNT:any;

  SEC_DEPOSIT_GURANTEE_CHEQUE:any;
  SEC_DEPOSIT_GURANTEE_CHEQUE_COUNT:any;

  FM_CONFIRM_QUTATION_UPLOAD:any;
  FM_CONFIRM_QUTATION_UPLOAD_COUNT:any;

  CLIENT_APPROVAL_QUOTATION_SENT:any;
  CLIENT_APPROVAL_QUOTATION_SENT_COUNT:any;


  searchData = { "search_value": "" };
  
  search_value: any = "";

  user: any = localStorage.getItem('userData');
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

   
  getCeoCount() {
    
    this.presentLoadingDefault(true);
    let userdata = {
      UserInfoId: this.user.UserInfoId,
    }

    if (this.user.UserInfoId != undefined || this.user.UserInfoId > 0) {
      this.authService.dashboardPostData(userdata, 'dashboard/getCEOCOUNT').then((result) => {
        this.CeoCount = result;
        this.SEC_DEPOSIT_CEO_APPROVAL = this.CeoCount.find(x => x.LABLE_TYPE == 'SECURITY_DEPOSIT_COO_CEO_APPROVAL').LABLE_COUNT;
        this.presentLoadingDefault(false);
      }, (err) => {
        this.presentLoadingDefault(false);
        console.log(err);
      });
    } else {
      //this.presentLoadingDefault(false);
    }
  }

  ionViewDidLoad() {
    //this.getCeoCount();
    this.getsecuritydepositlist();
  }
 
  
  openDetailModal(type: any) {
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    if (type == "Pending COO/CEO Approval") {
      this.modalnavigationdata = this.securitydepositlist.filter(item => item.PAID == 5 && item.SECURITY_DEPOSIT_REF_ID != 0 && item.IS_HOLD == 0 && item.CASE_COUNT_1 == item.CASE_SETTLED_COUNT); 
      console.log('Pending COO/CEO Approval',this.modalnavigationdata);     
    } else if (type == "Escalation to CEO/COO"){
      this.modalnavigationdata = this.ESCALATION_CEO_COO;
      console.log('Escalation to CEO/COO',this.modalnavigationdata); 
    } else if (type == 'SD Not initiated'){
      this.modalnavigationdata = this.SEC_DEPOSIT_NOT_INITIATED;
      console.log('SD Not initiated',this.modalnavigationdata); 
    } else if (type == "Pending Maint FM Confirmation"){
      this.modalnavigationdata = this.SEC_PENDING_MAINT_FM;
      console.log('Pending Maint FM Confirmation',this.modalnavigationdata); 
    } else if (type == "Pending Leasing Verification"){
      this.modalnavigationdata = this.SEC_DEPOSIT_PENDING_LEASE_VERIFICATION;
      console.log('Pending Leasing Verification',this.modalnavigationdata); 
    } else if (type == "Pending Client Approval"){
      this.modalnavigationdata = this.SEC_DEPOSIT_CLIENT_APPROVAL;
      console.log('Pending Client Approval',this.modalnavigationdata); 
    } else if (type == "Pending Invoice Creation"){
      this.modalnavigationdata = this.SEC_DEPOSIT_INV_CREATION;
      console.log('Pending Invoice Creation',this.modalnavigationdata); 
    } else if (type == "Pending Finance Verification"){
      this.modalnavigationdata = this.SEC_DEPOSIT_FINANCE_VER;
      console.log('Pending Finance Verification',this.modalnavigationdata); 
    } else if (type == "Under chq Preparation"){
      this.modalnavigationdata = this.SEC_DEPOSIT_UNDER_CHQ;
      console.log('Under chq Preparation',this.modalnavigationdata); 
    } else if (type == "Director Signature"){
      this.modalnavigationdata = this.SEC_DEPOSIT_DIRECTOR_SIGN;
      console.log('Director Signature',this.modalnavigationdata); 
    } 

    let myModalData = [{
      modalnavigationdata : this.modalnavigationdata,
      type : type
    }];

    let myModal: Modal = this.modal.create('SecurityDepositDetailPage', { data: myModalData }, myModalOptions);

    myModal.present();

    myModal.onDidDismiss((data) => {
      this.ionViewDidLoad();
    });

    myModal.onWillDismiss((data) => {
      this.ionViewDidLoad();
    });
  }
 
  getsecuritydepositlist(){
    this.presentLoadingDefault(true);
    this.authService.getData({},'security/SecurityDetails/').then((result) => {

      this.securitydepositlist       = result;
      this.SEC_DEPOSIT_CEO_APPROVAL  = this.securitydepositlist.filter(item => item.PAID == 5 && item.SECURITY_DEPOSIT_REF_ID != 0 && item.IS_HOLD == 0 && item.CASE_COUNT_1 == item.CASE_SETTLED_COUNT); 
      this.ESCALATION_CEO_COO        = this.securitydepositlist.filter(item => item.ESC_COUNT > 0 && item.IS_HOLD == 0); 
      this.SEC_DEPOSIT_NOT_INITIATED = this.securitydepositlist.filter(item => item.SECURITY_DEPOSIT_REF_ID == 0); 
      this.SEC_PENDING_MAINT_FM      = this.securitydepositlist.filter(item => item.IS_REJECTED == 0 && item.PAID == 0 && item.SECURITY_DEPOSIT_REF_ID != 0 && item.IS_HOLD == 0 && item.CASE_COUNT_1 == item.CASE_SETTLED_COUNT);
      this.SEC_DEPOSIT_PENDING_LEASE_VERIFICATION = this.securitydepositlist.filter(item => item.PAID == 1 && item.SECURITY_DEPOSIT_REF_ID != 0 && item.IS_HOLD == 0 && item.CASE_COUNT_1 == item.CASE_SETTLED_COUNT);
      this.SEC_DEPOSIT_CLIENT_APPROVAL = this.securitydepositlist.filter(item => item.PAID == 2 && item.SECURITY_DEPOSIT_REF_ID != 0 && item.IS_HOLD == 0 && item.CASE_COUNT_1 == item.CASE_SETTLED_COUNT);
      this.SEC_DEPOSIT_INV_CREATION = this.securitydepositlist.filter(item => item.PAID == 3 && item.SECURITY_DEPOSIT_REF_ID != 0 && item.IS_HOLD == 0 && item.CASE_COUNT_1 == item.CASE_SETTLED_COUNT);
      this.SEC_DEPOSIT_FINANCE_VER = this.securitydepositlist.filter(item => item.PAID == 4 && item.SECURITY_DEPOSIT_REF_ID != 0 && item.IS_HOLD == 0 && item.CASE_COUNT_1 == item.CASE_SETTLED_COUNT);
      this.SEC_DEPOSIT_UNDER_CHQ = this.securitydepositlist.filter(item => item.PAID == 6 && item.SECURITY_DEPOSIT_REF_ID != 0 && item.IS_HOLD == 0 && item.CASE_COUNT_1 == item.CASE_SETTLED_COUNT);
      this.SEC_DEPOSIT_DIRECTOR_SIGN = this.securitydepositlist.filter(item => item.PAID == 7 && item.SECURITY_DEPOSIT_REF_ID != 0 && item.IS_HOLD == 0 && item.CASE_COUNT_1 == item.CASE_SETTLED_COUNT);
      this.SEC_DEPOSIT_AMT_REL_CLIENT = this.securitydepositlist.filter(item => item.PAID == 8 && item.SECURITY_DEPOSIT_REF_ID != 0 && item.IS_HOLD == 0 && item.CASE_COUNT_1 == item.CASE_SETTLED_COUNT);
      this.GURANTEE_CHQ_RELEASED = this.securitydepositlist.filter(item => item.PAID == 10 && item.SECURITY_DEPOSIT_REF_ID != 0 && item.IS_HOLD == 0 && item.CASE_COUNT_1 == item.CASE_SETTLED_COUNT);
      this.HANDOVER_TO_CLIENT = this.securitydepositlist.filter(item => item.PAID == 9 && item.SECURITY_DEPOSIT_REF_ID != 0 && item.IS_HOLD == 0 && item.CASE_COUNT_1 == item.CASE_SETTLED_COUNT);
      this.SEC_DEPOSIT_GURANTEE_CHEQUE = this.securitydepositlist.filter(item => item.CHEQUE_ID > 0 && item.SECURITY_DEPOSIT_REF_ID != 0 && item.IS_HOLD == 0 && item.CASE_COUNT_1 == item.CASE_SETTLED_COUNT);
      this.FM_CONFIRM_QUTATION_UPLOAD = this.securitydepositlist.filter(item => item.FM_COUNT > 0 );
      this.CLIENT_APPROVAL_QUOTATION_SENT = this.securitydepositlist.filter(item => item.IS_CLIENT_QUOTE_SENT > 0 );


      this.ESCALATION_CEO_COO_COUNT = this.ESCALATION_CEO_COO.length;
      this.SEC_DEPOSIT_CEO_APPROVAL_COUNT = this.SEC_DEPOSIT_CEO_APPROVAL.length;
      this.SEC_DEPOSIT_NOT_INITIATED_COUNT = this.SEC_DEPOSIT_NOT_INITIATED.length;
      this.SEC_PENDING_MAINT_FM_COUNT = this.SEC_PENDING_MAINT_FM.length;
      this.SEC_DEPOSIT_PENDING_LEASE_VERIFICATION_COUNT = this.SEC_DEPOSIT_PENDING_LEASE_VERIFICATION.length;
      this.SEC_DEPOSIT_CLIENT_APPROVAL_COUNT = this.SEC_DEPOSIT_CLIENT_APPROVAL.length;
      this.SEC_DEPOSIT_INV_CREATION_COUNT = this.SEC_DEPOSIT_INV_CREATION.length;
      this.SEC_DEPOSIT_FINANCE_VER_COUNT = this.SEC_DEPOSIT_FINANCE_VER.length;
      this.SEC_DEPOSIT_UNDER_CHQ_COUNT = this.SEC_DEPOSIT_UNDER_CHQ.length;
      this.SEC_DEPOSIT_DIRECTOR_SIGN_COUNT = this.SEC_DEPOSIT_DIRECTOR_SIGN.length;
      this.SEC_DEPOSIT_AMT_REL_CLIENT_COUNT = this.SEC_DEPOSIT_AMT_REL_CLIENT.length;
      this.GURANTEE_CHQ_RELEASED_COUNT = this.GURANTEE_CHQ_RELEASED.length;
      this.HANDOVER_TO_CLIENT_COUNT = this.HANDOVER_TO_CLIENT.length;
      this.SEC_DEPOSIT_GURANTEE_CHEQUE_COUNT = this.SEC_DEPOSIT_GURANTEE_CHEQUE.length;
      this.FM_CONFIRM_QUTATION_UPLOAD_COUNT = this.FM_CONFIRM_QUTATION_UPLOAD.length;
      this.CLIENT_APPROVAL_QUOTATION_SENT_COUNT = this.CLIENT_APPROVAL_QUOTATION_SENT.length;
      
      this.presentLoadingDefault(false);
     

    }, (err) => {
        console.log(err);
    });
  }

  SearchpaymentDetail() {

    if (this.search_value != '') {
      this.openModel('ALL', this.search_value)
    }
    
  } 

  openModel(type: any,searchValue:any) {

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };    

    let myModalData = [{
      SearchData: searchValue,
      type : type
    }];

    let myModal: Modal = this.modal.create('SecurityDepositDetailPage', { data: myModalData }, myModalOptions);

    myModal.present();

    myModal.onDidDismiss((data) => {
      this.ionViewDidLoad();
    });

    myModal.onWillDismiss((data) => {
      this.ionViewDidLoad();
    });
  }

  openMultipleApprovalDatailModal(type: any) {

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    if (type == "Pending COO/CEO Approval") {
      this.modalnavigationdata = this.securitydepositlist.filter(item => item.PAID == 5); 
      console.log('Pending COO/CEO Approval',this.modalnavigationdata);     
    } else if (type == "Escalation to CEO/COO"){
      this.modalnavigationdata = this.ESCALATION_CEO_COO;
      console.log('Escalation to CEO/COO',this.modalnavigationdata); 
    }

    let myModalData = [
      this.modalnavigationdata
    ];

    let myModal: Modal = this.modal.create('SecurityDepositMultipleApprovalPage', { data: myModalData }, myModalOptions);

    myModal.present();

    myModal.onDidDismiss((data) => {
      this.ionViewDidLoad();
    });

    myModal.onWillDismiss((data) => {
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
