import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController, Modal, ModalController, ModalOptions, ViewController } from 'ionic-angular';
import { DashboardPage } from '../dashboard/dashboard';
import { RestProvider } from '../../providers/rest/rest';
import { ChequePage } from '../chequelist/cheque';
import { CeoesclatedPage } from '../ceoesclated/ceoesclated';

@Component({
  selector: 'page-esculationlabel',
  templateUrl: 'esculationlabel.html',
})
 
export class EsculationLabelPage {

  
  escalationdetailsall = {
    AllEscalation: [] as any,
    CaseEscalationCEOdata: [] as any,
    ChqListEscalationCEOdata: [] as any,
    PymtEscalationCEOdata: [] as any,
    PymtEscalationMGRdata: [] as any,
    callmanagementescalationcount: [] as any,
    caseescalationmgrdata: [] as any,
    chequeescalationmgrdata: [] as any,
    escalationceoall: [] as any,
    escalationmgrall: [] as any,
    rtnChqEsculationCEOdata: [] as any,
    rtnesculationtomgrdata: [] as any,
    drecEscCEOList: [] as any,
    drecEscMgrList: [] as any
  } as any;

  searchpaymentdetails = [] as any;
  modalnavigationdata: any;
  rdata: any;
  searchData = { "search_value": "" };
  securitydepositlist: any;
  user: any = localStorage.getItem('userData');

  caseListCount: any;
  chequeListCount: any;
  casePaymentCount: any;
  returnChequeCount: any;
  callCount: any;
  drecCount: any;

  ESCALATION_CEO_COO: any;
  ESCALATION_CEO_COO_COUNT: any;
  escalationData = this.navParams.get('data');
  securityDepositCount: any;

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

  getEscalation() {

    this.presentLoadingDefault(true);
    let userdata = {
      UserInfoId: this.user.UserInfoId,
      UserEmployeeId: this.user.UserEmployeeId
    }

    this.authService.postData(userdata, 'escalation/EscalationList').then((result) => {
      this.escalationdetailsall = result;
      console.log(this.escalationdetailsall);

      this.caseListCount = this.escalationdetailsall.CaseEscalationCEOdata.length;
      this.chequeListCount = this.escalationdetailsall.ChqListEscalationCEOdata.length;
      this.casePaymentCount = this.escalationdetailsall.PymtEscalationCEOdata.length;
      this.returnChequeCount = this.escalationdetailsall.rtnChqEsculationCEOdata.length;
      this.callCount = this.escalationdetailsall.callMgntEsculationCEOdata.length;
      this.drecCount = this.escalationdetailsall.drecEscCEOList.length;

      this.presentLoadingDefault(false);
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });

  }


  getsecuritydepositlist() {
    this.authService.getData({}, 'security/SecurityDetails/').then((result) => {
      this.securitydepositlist = result;
      this.ESCALATION_CEO_COO = this.securitydepositlist.filter(item => item.ESC_COUNT > 0 && item.IS_HOLD == 0);
      this.ESCALATION_CEO_COO_COUNT = this.ESCALATION_CEO_COO.length;
      this.securityDepositCount = this.ESCALATION_CEO_COO_COUNT;

    }, (err) => {
      console.log(err);
    });
  }

  ionViewDidLoad() {

    this.getEscalation();
    this.getsecuritydepositlist();
    this.paymentdetails();
  }


  paymentdetails() {

    this.authService.getData({}, 'payment/getPendingCeoPaymentList').then((result) => {
      this.searchpaymentdetails = result;
      console.log('Pending CEO Payment List', this.searchpaymentdetails);

    }, (err) => {
      this.presentToast(err);
    });
  }

  openDetailModal(type: any) {
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    if (type == 'CMS') {

      let myModalData = {
        Type: 'ESCALATIONTOCEO',
        SearchData: ''
      };

      let myModal: Modal = this.modal.create('CasemanagementPage', { data: myModalData }, myModalOptions);
      myModal.present();

      myModal.onDidDismiss((data) => {
      });

      myModal.onWillDismiss((data) => {
      });

    } else if (type == 'RCS') {

      let myModalData = [{
        type: 'ESCLATION TO CEO'
      }];

      let myModal: Modal = this.modal.create('ReturnChequePage', { data: myModalData }, myModalOptions);
      myModal.present();

      myModal.onDidDismiss((data) => {
      });

      myModal.onWillDismiss((data) => {
      });

    } else if (type == 'CS') {

      let myModalData = [{
        type: 'ESCCEO'
      }];

      let myModal: Modal = this.modal.create(ChequePage, { data: myModalData }, myModalOptions);
      myModal.present();

      myModal.onDidDismiss((data) => {
      });

      myModal.onWillDismiss((data) => {
      });

    } else if (type == 'CM') {

      let mymodaldata = [{
        inspection: 1
      }]

      let myModal: Modal = this.modal.create(CeoesclatedPage, { data: mymodaldata }, myModalOptions);
      myModal.present();

      myModal.onDidDismiss((data) => {
      });

      myModal.onWillDismiss((data) => {
      });

    } else if (type == 'CPR') {
      this.rdata = localStorage.getItem('resourseData');
      this.rdata = this.rdata ? JSON.parse(this.rdata) : { TYPE_USER: null };
      this.modalnavigationdata = this.searchpaymentdetails.escalation_to_ceo;
      console.log('Escalation CEO', this.modalnavigationdata);

      if (this.rdata.TYPE_USER == 'CEO') {

        let myModalData = [{
          CASE_REQUEST_ID: 0,
          PAY_REQ_STATUS: 2,
          CASE_REQUEST: this.modalnavigationdata,
          LABEL_TYPE: 'Escalation CEO'
        }];

        let myModal: Modal = this.modal.create('PaymentDetailPage', { data: myModalData }, myModalOptions);
        myModal.present();

        myModal.onDidDismiss((data) => {
        });

        myModal.onWillDismiss((data) => {
        });

      }

    } else if (type == 'DREC') {

      let mymodaldata = [{
        inspection: 1
      }]

      let myModal: Modal = this.modal.create('DrecDetailsPage', { data: mymodaldata }, myModalOptions);
      myModal.present();

      myModal.onDidDismiss((data) => {
      });

      myModal.onWillDismiss((data) => {
      });

    }

    else if (type == 'SECURITY DEPOSIT') {

      this.modalnavigationdata = this.ESCALATION_CEO_COO;
      console.log('Escalation to CEO/COO', this.modalnavigationdata);

      let myModalData = [{
        modalnavigationdata: this.modalnavigationdata,
        type: 'Escalation to CEO/COO'
      }];

      let myModal: Modal = this.modal.create('SecurityDepositDetailPage', { data: myModalData }, myModalOptions);
      myModal.present();

      myModal.onDidDismiss((data) => {
      });

      myModal.onWillDismiss((data) => {
      });

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
