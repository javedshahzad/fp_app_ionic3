import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, Modal, ModalController, ModalOptions, ViewController } from 'ionic-angular';
import { DashboardPage } from '../dashboard/dashboard';
import { RestProvider } from '../../providers/rest/rest';


@IonicPage()
@Component({
  selector: 'page-esculationtomgrlabel',
  templateUrl: 'esculationtomgrlabel.html',
})
export class EsculationToMgrLabelPage {
  
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

  
  searchData = { "search_value": "" };

  user: any = localStorage.getItem('userData');

  caseListCount:any;
  chequeListCount:any;
  casePaymentCount:any;
  returnChequeCount:any;
  callCount:any;
  drecCount:any;
  
  escalationData = this.navParams.get('data');

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
      this.presentLoadingDefault(false);     
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });

  }

  ionViewDidLoad() {
      console.log(this.escalationData);
      this.caseListCount   = this.escalationData[0].cms;
      this.chequeListCount = this.escalationData[0].cs;
      this.casePaymentCount = this.escalationData[0].cpr;
      this.returnChequeCount = this.escalationData[0].rcs;
      this.callCount = this.escalationData[0].cm;
      this.drecCount = this.escalationData[0].drec;

      //this.getEscalation();
  }


  openDrecModal(LEASE_NUM: any,DREC:any) {
      const myModalOptions: ModalOptions = {
          enableBackdropDismiss: false
      };

      let myModalData = [{
          LEASE_NUM: LEASE_NUM,DREC:DREC
      }];

      let myModal: Modal = this.modal.create('DrecCommentsPage', { data: myModalData }, myModalOptions);

      myModal.present();

      myModal.onDidDismiss((data) => {         
      });

      myModal.onWillDismiss((data) => {        
      });
  }

  
  openHOTOModal(LEASE_NUM: any, HANDOVER_ID: any) {

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let myModalData = [{
      LEASE_NUM: LEASE_NUM,
      HOTO_ID: HANDOVER_ID ? HANDOVER_ID :0
    }];

    let myModal: Modal = this.modal.create('HotoCommentPage', { data: myModalData }, myModalOptions);

    myModal.present();

    myModal.onDidDismiss((data) => {      
    });

    myModal.onWillDismiss((data) => {      
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
