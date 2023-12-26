import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController, Modal, ModalController, ModalOptions, ViewController } from 'ionic-angular';
import { DashboardPage } from '../dashboard/dashboard';
import { RestProvider } from '../../providers/rest/rest';
import { ChequePage } from '../chequelist/cheque';

@Component({
  selector: 'page-chequelistlabel',
  templateUrl: 'chequelistlabel.html',
})
 
export class ChequeListLabelPage {

  chequeListData = {} as any;
  searchData = { "search_value": "" };  
  user: any = localStorage.getItem('userData');
  search_value: any = "";
  showescalateddays = 0;

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
    this.presentLoadingDefault(true);
    this.authService.getData({}, 'cheque/ChequeListSummary').then((result) => {
      this.chequeListData = result;
      this.presentLoadingDefault(false);
      console.log(this.chequeListData);
      console.log(this.chequeListData.TOTAL_COUNT);            

    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });
  }

  ionViewDidLoad() {    
    this.returndetails();
  }

  openDetailModal(type: any) {
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let flag = 'N';

    let myModalData = [{
      type: type
    }];

    if (type == 'CHRA' && this.chequeListData.HOLD_REQ_APPROVAL > 0){
      flag = 'Y'
    }

    if (type == 'COH' && this.chequeListData.CHEQUE_ON_HOLD > 0){
      flag = 'Y'
    }

    if (type == 'REDA' && this.chequeListData.REDEPOSIT_APPROVED > 0){
      flag = 'Y'
    }

    if (type == 'ESCMGR' && this.chequeListData.ESCMGRLIST > 0){
      flag = 'Y'
    }

    if (type == 'ESCCEO' && this.chequeListData.ESCCEOLIST > 0){
      flag = 'Y'
    }

    if (type == 'PC2BC' && this.chequeListData.CHEQUE_TO_CLEAR > 0){
      flag = 'Y'
    }

    if (type == 'ALL CHEQUE LIST' && this.chequeListData.TOTAL_COUNT > 0){
      flag = 'Y'
    }

    if(flag == 'Y') {
      let myModal: Modal = this.modal.create(ChequePage, { data: myModalData }, myModalOptions);
      myModal.present();

      myModal.onDidDismiss(() => {   
      });
      myModal.onWillDismiss(() => {
      });
    }
        
  }

  openModel(type: any, searchValue: any){

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let flag = 'N';

    let myModalData = [{
      type: type,
      SearchData: searchValue
    }];

    let myModal: Modal = this.modal.create(ChequePage, { data: myModalData }, myModalOptions);
    myModal.present();

    myModal.onDidDismiss(() => {   
    });
    myModal.onWillDismiss(() => {
    });

  }

  SearchCase() {
    if (this.search_value != '') {
      console.log(this.search_value);
      this.openModel('ALL CHEQUE LIST', this.search_value)
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
