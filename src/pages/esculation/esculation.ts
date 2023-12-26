import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, Modal, ModalController, ModalOptions, ViewController } from 'ionic-angular';
import { DashboardPage } from '../dashboard/dashboard';
import { RestProvider } from '../../providers/rest/rest';


@IonicPage()
@Component({
  selector: 'page-esculation',
  templateUrl: 'esculation.html',
})
export class EsculationPage {
  
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

  escalationCallCount = {} as any;
  insertedValues: any;
  ceo_esculation = 'none';
  mgr_esculation = 'none';
  return_ceo_esculation = 'none';
  return_mgr_esculation = 'none';
  case_mgr_esculation = 'none';
  case_ceo_esculation = 'none';
  payment_ceo_esculation = 'none';
  payment_mgr_esculation = 'none';
  cheque_ceo_esculation = 'none';
  cheque_mgr_esculation = 'none';
  callmanagement_ceo_esculation = 'none';
  callmanagement_mgr_esculation = 'none';
  drec_ceo_esculation = 'none';
  drec_mgr_esculation = 'none';
  ho_leasing_esculation ='none';
  to_leasing_esculation ='none';
  searchData = { "search_value": "" };
  user: any = localStorage.getItem('userData');

  
  securitydepositlist: any;  
  ESCALATION_CEO_COO: any;
  ESCALATION_CEO_COO_COUNT: any;

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
      this.getEscalation();
      this.getsecuritydepositlist();
  }

  setescalationdata(esculation_type: any) {
    this.return_ceo_esculation = 'none';
    this.return_mgr_esculation = 'none';
    this.case_mgr_esculation = 'none';
    this.case_ceo_esculation = 'none';
    this.payment_ceo_esculation = 'none';
    this.payment_mgr_esculation = 'none';
    this.cheque_ceo_esculation = 'none';
    this.cheque_mgr_esculation = 'none';
    this.callmanagement_ceo_esculation = 'none';
    this.callmanagement_mgr_esculation = 'none';
    this.drec_ceo_esculation = 'none';
    this.drec_mgr_esculation = 'none';
    this.ho_leasing_esculation ='none';
    this.to_leasing_esculation ='none';

    if (esculation_type == 'Return Cheque CEO Escalation') {
      this.return_ceo_esculation = 'block';
    } else if (esculation_type == 'Payment Request CEO Escalation') {
      this.payment_ceo_esculation = 'block';
    } else if (esculation_type == 'Cheque List CEO Escalation') {
      this.cheque_ceo_esculation = 'block';
    } else if (esculation_type == 'Case List CEO Escalation') {
      this.case_ceo_esculation = 'block';
    } else if (esculation_type == 'Return Cheque MGR Escalation') {
      this.return_mgr_esculation = 'block';
    } else if (esculation_type == 'Payment Request MGR Escalation') {
      this.payment_mgr_esculation = 'block';
    } else if (esculation_type == 'Cheque List MGR Escalation') {
      this.cheque_mgr_esculation = 'block';
    } else if (esculation_type == 'Case List MGR Escalation') {
      this.case_mgr_esculation = 'block';
    } else if (esculation_type == 'Call Management CEO Escalation') {
      this.callmanagement_ceo_esculation = 'block';
    } else if (esculation_type == 'Call Management MGR Escalation') {
      this.callmanagement_mgr_esculation = 'block';
    } else if (esculation_type == 'DREC CEO Escalation') {
      this.drec_ceo_esculation = 'block';
    } else if (esculation_type == 'DREC MGR Escalation') {
      this.drec_mgr_esculation = 'block';
    }else if (esculation_type == 'HOTO_TAKEOVER CEO Escalation') {
      this.to_leasing_esculation = 'block';
    } else if (esculation_type == 'HOTO_HANDOVER CEO Escalation') {
      this.ho_leasing_esculation = 'block';
    }
  }

  show_esculation(type: any) {
    this.ceo_esculation = 'none';
      this.mgr_esculation = 'none';
      this.return_ceo_esculation = 'none';
      this.return_mgr_esculation = 'none';
      this.case_mgr_esculation = 'none';
      this.case_ceo_esculation = 'none';
      this.payment_ceo_esculation = 'none';
      this.payment_mgr_esculation = 'none';
      this.cheque_ceo_esculation = 'none';
      this.cheque_mgr_esculation = 'none';
      this.callmanagement_ceo_esculation = 'none';
      this.callmanagement_mgr_esculation = 'none';
    if (type == 'CEO') {
      this.ceo_esculation = 'block';
    } else {
      this.mgr_esculation = 'block';
    }
  }


  getsecuritydepositlist() {
    this.authService.getData({}, 'security/SecurityDetails/').then((result) => {
      this.securitydepositlist = result;
      this.ESCALATION_CEO_COO = this.securitydepositlist.filter(item => item.ESC_COUNT > 0 && item.IS_HOLD == 0);
      this.ESCALATION_CEO_COO_COUNT = this.ESCALATION_CEO_COO.length;

    }, (err) => {
      console.log(err);
    });
  }

  openDetailModal(type: any) {
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };
  
    let myModalData = [{
      type : type,
      tms:0,
      cms: this.escalationdetailsall.CaseEscalationCEOdata.length,
      cs: this.escalationdetailsall.ChqListEscalationCEOdata.length,
      cpr: this.escalationdetailsall.PymtEscalationCEOdata.length,
      rcs: this.escalationdetailsall.rtnChqEsculationCEOdata.length,
      cm: this.escalationdetailsall.callMgntEsculationCEOdata.length,
      cnt: 0,
      ams:0,
      drec: this.escalationdetailsall.drecEscCEOList.length,
      sd: this.ESCALATION_CEO_COO_COUNT
    }];

    let myModal: Modal = this.modal.create('EsculationLabelPage', {data: myModalData}, myModalOptions);

    myModal.present();

    myModal.onDidDismiss((data) => {
      this.ionViewDidLoad();
    });

    myModal.onWillDismiss((data) => {
      this.ionViewDidLoad();
    });

  }


  openDetailModalMgr(type: any) {
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };
  
    let myModalData = [{
      type : type,
      tms:0,
      cms: this.escalationdetailsall.caseescalationmgrdata.length ,
      cs: this.escalationdetailsall.chequeescalationmgrdata.length,
      cpr: this.escalationdetailsall.PymtEscalationMGRdata.length,
      rcs: this.escalationdetailsall.rtnesculationtomgrdata.length,
      cm: this.escalationdetailsall.callMgntEsculationMGRdata.length,
      cnt: 0,
      ams:0,
      drec: this.escalationdetailsall.drecEscMgrList.length,
      sd: 0,
      hoto:0
    }];

    let myModal: Modal = this.modal.create('EsculationToMgrLabelPage', {data: myModalData}, myModalOptions);

    myModal.present();

    myModal.onDidDismiss((data) => {
      this.ionViewDidLoad();
    });

    myModal.onWillDismiss((data) => {
      this.ionViewDidLoad();
    });

  }

  //   openModal(LEASE_NUM:any) {

  //     const myModalOptions: ModalOptions = {
  //       enableBackdropDismiss: false
  //     };

  //     let  myModalData = [{
  //       LEASE_NUM: LEASE_NUM
  //     }];

  //     let myModal: Modal = this.modal.create('DrecCommentsPage', { data: myModalData }, myModalOptions);

  //     myModal.present();

  //     myModal.onDidDismiss((data) => {
  //       // console.log("I have dismissed.");
  //       // console.log(data);
  //     });

  //     myModal.onWillDismiss((data) => {
  //       // console.log("I'm about to dismiss");
  //       // console.log(data);
  //     });

  //   }


  //   SearchdrecDetail(){
  //     let drec_val = this.searchData.search_value;
  //     if(drec_val!=''){
  //       this.drecDetailsall = this.drecdetailssearch.filter(item => (item.CUSTOMER_NAME ? item.CUSTOMER_NAME.includes(drec_val):'') || (item.LEASE_NUM ? item.LEASE_NUM.includes(drec_val):'')|| (item.UNIT_NO ? item.UNIT_NO.includes(drec_val):''));
  //     }else{
  //       this.drecDetailsall = this.drecdetailssearch
  //     }
  //   }


  // return mgr escalation data extend//
  showrtnmgrBtn = -1;
  isrtnmgrOpen = false;
  oldrtnmgrBtn = -1;
  showUndortnmgrBtn(index) {
    if (this.isrtnmgrOpen == false) {
      this.isrtnmgrOpen = true;
      this.oldrtnmgrBtn = index;
      this.showrtnmgrBtn = index;
    } else {
      if (this.oldrtnmgrBtn == index) {
        this.isrtnmgrOpen = false;
        this.showrtnmgrBtn = -1;
        this.oldrtnmgrBtn = -1;
      } else {
        this.showrtnmgrBtn = index;
        this.oldrtnmgrBtn = index;
      }
    }
  }

  // Case mgr escalation data extend//
  showcasemgrBtn = -1;
  iscasemgrOpen = false;
  oldcasemgrBtn = -1;
  showUndocasemgrBtn(index) {
    if (this.iscasemgrOpen == false) {
      this.iscasemgrOpen = true;
      this.oldcasemgrBtn = index;
      this.showcasemgrBtn = index;
    } else {
      if (this.oldcasemgrBtn == index) {
        this.iscasemgrOpen = false;
        this.showcasemgrBtn = -1;
        this.oldcasemgrBtn = -1;
      } else {
        this.showcasemgrBtn = index;
        this.oldcasemgrBtn = index;
      }
    }
  }

  // Payment Request mgr escalation data extend//
  showpymtmgrBtn = -1;
  ispymtmgrOpen = false;
  oldpymtmgrBtn = -1;
  showUndopymtmgrBtn(index) {
    if (this.ispymtmgrOpen == false) {
      this.ispymtmgrOpen = true;
      this.oldpymtmgrBtn = index;
      this.showpymtmgrBtn = index;
    } else {
      if (this.oldpymtmgrBtn == index) {
        this.ispymtmgrOpen = false;
        this.showpymtmgrBtn = -1;
        this.oldpymtmgrBtn = -1;
      } else {
        this.showpymtmgrBtn = index;
        this.oldpymtmgrBtn = index;
      }
    }
  }

  // Cheque List mgr escalation data extend//
  showchqmgrBtn = -1;
  ischqmgrOpen = false;
  oldchqmgrBtn = -1;
  showUndochqmgrBtn(index) {
    if (this.ischqmgrOpen == false) {
      this.ischqmgrOpen = true;
      this.oldchqmgrBtn = index;
      this.showchqmgrBtn = index;
    } else {
      if (this.oldchqmgrBtn == index) {
        this.ischqmgrOpen = false;
        this.showchqmgrBtn = -1;
        this.oldchqmgrBtn = -1;
      } else {
        this.showchqmgrBtn = index;
        this.oldchqmgrBtn = index;
      }
    }
  }



  // return ceo escalation data extend//
  showrtnceoBtn = -1;
  isrtnceoOpen = false;
  oldrtnceoBtn = -1;
  showUndortnceoBtn(index) {
    if (this.isrtnceoOpen == false) {
      this.isrtnceoOpen = true;
      this.oldrtnceoBtn = index;
      this.showrtnceoBtn = index;
    } else {
      if (this.oldrtnceoBtn == index) {
        this.isrtnceoOpen = false;
        this.showrtnceoBtn = -1;
        this.oldrtnceoBtn = -1;
      } else {
        this.showrtnceoBtn = index;
        this.oldrtnceoBtn = index;
      }
    }
  }

  // Case ceo escalation data extend//
  showcaseceoBtn = -1;
  iscaseceoOpen = false;
  oldcaseceoBtn = -1;
  showUndocaseceoBtn(index) {
    if (this.iscaseceoOpen == false) {
      this.iscaseceoOpen = true;
      this.oldcaseceoBtn = index;
      this.showcaseceoBtn = index;
    } else {
      if (this.oldcaseceoBtn == index) {
        this.iscaseceoOpen = false;
        this.showcaseceoBtn = -1;
        this.oldcaseceoBtn = -1;
      } else {
        this.showcaseceoBtn = index;
        this.oldcaseceoBtn = index;
      }
    }
  }

  // Payment Request ceo escalation data extend//
  showpymtceoBtn = -1;
  ispymtceoOpen = false;
  oldpymtceoBtn = -1;
  showUndopymtceoBtn(index) {
    if (this.ispymtceoOpen == false) {
      this.ispymtceoOpen = true;
      this.oldpymtceoBtn = index;
      this.showpymtceoBtn = index;
    } else {
      if (this.oldpymtceoBtn == index) {
        this.ispymtceoOpen = false;
        this.showpymtceoBtn = -1;
        this.oldpymtceoBtn = -1;
      } else {
        this.showpymtceoBtn = index;
        this.oldpymtceoBtn = index;
      }
    }
  }

  // return ceo escalation data extend//
  showcallceoBtn = -1;
  iscallceoOpen = false;
  oldcallceoBtn = -1;
  showUndocallceoBtn(index) {
    if (this.iscallceoOpen == false) {
      this.iscallceoOpen = true;
      this.oldcallceoBtn = index;
      this.showcallceoBtn = index;
    } else {
      if (this.oldcallceoBtn == index) {
        this.iscallceoOpen = false;
        this.showcallceoBtn = -1;
        this.oldcallceoBtn = -1;
      } else {
        this.showcallceoBtn = index;
        this.oldcallceoBtn = index;
      }
    }
  }



  // return mgr escalation data extend//
  showcallmgrBtn = -1;
  iscallmgrOpen = false;
  oldcallmgrBtn = -1;
  showUndocallmgrBtn(index) {
    if (this.iscallmgrOpen == false) {
      this.iscallmgrOpen = true;
      this.oldcallmgrBtn = index;
      this.showcallmgrBtn = index;
    } else {
      if (this.oldcallmgrBtn == index) {
        this.iscallmgrOpen = false;
        this.showcallmgrBtn = -1;
        this.oldcallmgrBtn = -1;
      } else {
        this.showcallmgrBtn = index;
        this.oldcallmgrBtn = index;
      }
    }
  }


  // Cheque List ceo escalation data extend//
  showchqceoBtn = -1;
  ischqceoOpen = false;
  oldchqceoBtn = -1;
  showUndochqceoBtn(index) {
    if (this.ischqceoOpen == false) {
      this.ischqceoOpen = true;
      this.oldchqceoBtn = index;
      this.showchqceoBtn = index;
    } else {
      if (this.oldchqceoBtn == index) {
        this.ischqceoOpen = false;
        this.showchqceoBtn = -1;
        this.oldchqceoBtn = -1;
      } else {
        this.showchqceoBtn = index;
        this.oldchqceoBtn = index;
      }
    }
  }

  showCeoDrecBtn = -1;
  isCeoDrecOpen = false;
  oldCeoDrecBtn = -1;
  showCeoDrec(index) {
      if (this.isCeoDrecOpen == false) {
          this.isCeoDrecOpen = true;
          this.oldCeoDrecBtn = index;
          this.showCeoDrecBtn = index;
      } else {
          if (this.oldCeoDrecBtn == index) {
              this.isCeoDrecOpen = false;
              this.showCeoDrecBtn = -1;
              this.oldCeoDrecBtn = -1;
          } else {
              this.isCeoDrecOpen = true;
              this.showCeoDrecBtn = index;
              this.oldCeoDrecBtn = index;
          }
      }
  }

  showMgrDrecBtn = -1;
  isMgrDrecOpen = false;
  oldMgrDrecBtn = -1;
  showMgrDrec(index) {
      if (this.isMgrDrecOpen == false) {
          this.isMgrDrecOpen = true;
          this.oldMgrDrecBtn = index;
          this.showMgrDrecBtn = index;
      } else {
          if (this.oldMgrDrecBtn == index) {
              this.isMgrDrecOpen = false;
              this.showMgrDrecBtn = -1;
              this.oldMgrDrecBtn = -1;
          } else {
              this.showMgrDrecBtn = index;
              this.oldMgrDrecBtn = index;
          }
      }
  }

  showTOESCCEOBtn = -1;
  isTOESCCEOOpen = false;
  oldTOESCCEOBtn = -1;
  showUndoTOESCCEOBtn(index) {
    if (this.isTOESCCEOOpen == false) {
      this.isTOESCCEOOpen = true;
      this.oldTOESCCEOBtn = index;
      this.showTOESCCEOBtn = index;
    } else {
      if (this.oldTOESCCEOBtn == index) {
        this.isTOESCCEOOpen = false;
        this.showTOESCCEOBtn = -1;
        this.oldTOESCCEOBtn = -1;
      } else {
        this.showTOESCCEOBtn = index;
        this.oldTOESCCEOBtn = index;
      }
    }
  }

  showHOESCCEOBtn = -1;
  isHOESCCEOOpen = false;
  oldHOESCCEOBtn = -1;
  showUndoHOESCCEOBtn(index) {
    if (this.isHOESCCEOOpen == false) {
      this.isHOESCCEOOpen = true;
      this.oldHOESCCEOBtn = index;
      this.showHOESCCEOBtn = index;
    } else {
      if (this.oldHOESCCEOBtn == index) {
        this.isHOESCCEOOpen = false;
        this.showHOESCCEOBtn = -1;
        this.oldHOESCCEOBtn = -1;
      } else {
        this.showHOESCCEOBtn = index;
        this.oldHOESCCEOBtn = index;
      }
    }
  }

  openCaseCMTSModal(CASE_REQ_ID: any, CASE_ID: any,CASE:any) {
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let myModalData = [{
      CASE_REQ_ID: CASE_REQ_ID,
      CASE_ID: CASE_ID,
      CASE:CASE
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

  openReturnModal(ID: any, ESCLATED_COUNT: any,RETURN_CHQ:any) {
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let myModalData = [{
      CASH_RECEIPT_ID: ID,
      ESCLATED_COUNT: ESCLATED_COUNT,
      RETURN_CHQ:RETURN_CHQ
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

  openChequeModal(ID: any,CHEQUE:any) {
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let myModalData = [{
      ID: ID,
      CHEQUE:CHEQUE
    }];

    let myModal: Modal = this.modal.create('ChequeCommentPage', { data: myModalData }, myModalOptions);


    myModal.onWillDismiss(() => {
      this.ionViewDidLoad();
    });
    myModal.present();
  }

  openDetailModal_pay_req(CASE_REQUEST_ID: any) {
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let myModalData = [{
      CASE_REQUEST_ID: CASE_REQUEST_ID
    }];

    let myModal: Modal = this.modal.create('PaymentDetailPage', { data: myModalData }, myModalOptions);

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
          // console.log("I have dismissed.");
          // console.log(data);
      });

      myModal.onWillDismiss((data) => {
          // console.log("I'm about to dismiss");
          // console.log(data);
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
      // console.log("I have dismissed.");
      // console.log(data);
    });

    myModal.onWillDismiss((data) => {
      // console.log("I'm about to dismiss");
      // console.log(data);
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
