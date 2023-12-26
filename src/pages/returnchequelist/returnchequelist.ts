import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController, Modal, ModalController, ModalOptions, ViewController } from 'ionic-angular';
import { DashboardPage } from '../dashboard/dashboard';
import { RestProvider } from '../../providers/rest/rest';

@Component({
  selector: 'page-returnchequelist',
  templateUrl: 'returnchequelist.html',
})

export class ReturnChequeListPage {
  returnchequedetailsall = {} as any;
  rtnchequedetails: any;
  insertedValues: any;
  return_cheque_list = 'block';
  return_chq_label = 'block';
  searchData = { "search_value": "" };
  returnchequeSearch = {} as any;
  return_chq_search = 'none';
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

  returndetails() {
    let myTitle = 'Return Cheque';
    this.presentLoadingDefault(true);
    this.authService.getData({}, 'returncheque/getReturnChequeList').then((result) => {
      this.returnchequedetailsall = result;
      this.returnchequeSearch = result;
      this.presentLoadingDefault(false);
      if (this.returnchequedetailsall.alldata > 0) {
        this.presentLoadingDefault(false);
        ///this.presentToast(`Data found in ${myTitle}`);
      } else {
        this.presentLoadingDefault(false);
        this.presentToast(`No data found in ${myTitle}`);
      }
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });
  }

  ionViewDidLoad() {
    this.return_chq_label = 'block';
    this.return_cheque_list = 'block';
    this.return_chq_search = 'none';

    this.returndetails();
  }

  openDetailModal(type: any) {

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };
    
    // if(type=="FOLLOW UP"){
    //   this.rtnchequedetails = this.returnchequedetailsall.followupdata;
    // }else if(type =="WAITING FOR RETURN CHEQUE MEMO"){
    //   this.rtnchequedetails = this.returnchequedetailsall.waitingmemodata;
    // }else if(type =="WAITING FOR LETTER FROM POLICE TO BANK"){
    //   this.rtnchequedetails = this.returnchequedetailsall.policetobankdata;
    // }else if(type =="WAITING FOR BANK RESPONSE TO POLICE"){
    //   this.rtnchequedetails = this.returnchequedetailsall.banktopolicedata;
    // }else if(type =="WAITING FOR POLICE CASE FIELD"){
    //   this.rtnchequedetails = this.returnchequedetailsall.policecasefielddata;
    // }else if(type =="WAITING FOR POLICE RESPONSE"){
    //   this.rtnchequedetails = this.returnchequedetailsall.policeresponsedata;
    // }else if(type =="WAITING JUDGEMENT FROM PUBLIC PROSECUTION"){
    //   this.rtnchequedetails = this.returnchequedetailsall.judgement_pp_data;
    // }else if(type =="ESCLATION TO MGR"){
    //   this.rtnchequedetails = this.returnchequedetailsall.esculationtomgrdata
    // }else if(type =="ESCLATION TO CEO"){
    //   this.rtnchequedetails = this.returnchequedetailsall.esculationtoceodata;
    // }else if(type =="POLICE CASE HOLD"){
    //   this.rtnchequedetails = this.returnchequedetailsall.policecaseholddata;
    // }else if(type =="FULL AMOUNT RECOVERED"){
    //   this.rtnchequedetails = this.returnchequedetailsall.fullamountrcvddata
    // }else if(type =="FOLLOW UP DATE EXTEND REQUEST"){
    //   this.rtnchequedetails = this.returnchequedetailsall.dateextendrequestdata;
    // }else if(type =="ALL RETURN CHEQUE LIST"){
    //   this.rtnchequedetails = this.returnchequedetailsall.alldata
    // }

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
  
  openModal(CASH_RECEIPT_ID: any) {

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let myModalData = [{
      CASH_RECEIPT_ID: CASH_RECEIPT_ID
    }];

    let myModal: Modal = this.modal.create('ReturnCommentPage', { data: myModalData }, myModalOptions);

    myModal.present();

    myModal.onWillDismiss(() => {
      this.ionViewDidLoad();
      // console.log("I'm about to dismiss");
      // console.log(data);
    });

  }

  cancelreturncheque(CASH_RECEIPT_ID: any) {
    this.presentLoadingDefault(true);
    let canceldata = {
      CASH_RECEIPT_ID: CASH_RECEIPT_ID
    };
    this.authService.postData(canceldata, 'returncheque/CancelReturnCheque').then((result) => {
      this.presentLoadingDefault(false);
      this.presentToast("successfully Return Cheque Cancelled!!!");
      this.insertedValues = result;
      this.returndetails();
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });
  }

  returnSearchdetails() {
    console.log('Search..');
    let paramdata = {
      type: null
    };
    this.presentLoadingDefault(true);
    this.authService.postData(paramdata, 'returncheque/ReturnChequeByStatus').then((result) => {
      this.returnchequeSearch = result;
      this.presentLoadingDefault(false);
      // if (this.returnchequeSearch.length > 0) {
      //   this.presentLoadingDefault(false);
      // } else {
      //   this.presentLoadingDefault(false);
      // }
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });
  }

  SearchrtchequeDetail() {

    let cheque_no = this.searchData.search_value;
    if (cheque_no != '') {
      this.returnSearchdetails();
      this.returnchequeSearch = this.returnchequeSearch.filter(item => (item.CHQNO ? item.CHQNO.includes(cheque_no) : '') || (item.ATTRIBUTE4 ? item.ATTRIBUTE4.includes(cheque_no) : '') || (item.CUSTOMER_NAME ? item.CUSTOMER_NAME.includes(cheque_no) : ''));
      this.return_chq_label = 'none';
      this.return_cheque_list = 'none';
      this.return_chq_search = 'block';
    } else {
      this.returnchequeSearch = this.returnchequedetailsall;
    }
  }

  SearchCase() {
    if (this.search_value != '') {
      console.log(this.search_value);
      //this.openModel('ALL CHEQUE LIST', this.search_value)
      const myModalOptions: ModalOptions = {
        enableBackdropDismiss: false
      };

      let myModalData = [{      
        type: 'ALL RETURN CHEQUE LIST',
        SearchData: this.search_value
      }];
  
      let myModal: Modal = this.modal.create('ReturnChequePage', { data: myModalData }, myModalOptions);
  
      myModal.present();
  
      myModal.onDidDismiss(() => {      
      });
  
      myModal.onWillDismiss(() => {      
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
