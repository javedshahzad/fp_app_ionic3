import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController, Modal, ModalController, ModalOptions, ViewController } from 'ionic-angular';
import { DashboardPage } from '../dashboard/dashboard';
import { RestProvider } from '../../providers/rest/rest';

 
@Component({
  selector: 'page-dreclabel',
  templateUrl: 'dreclabel.html',
})
export class DrecLabelPage {

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

  searchData = { "search_value": "" };  
  search_value: any = "";

  drecDetailsall = {
    lnkchqnotcollectedlist: [] as any,
    lnkchqreceivednotHolist: [] as any,
    lnkhonotacknowledgedlist: [] as any,
    lnkchqreceivednotsubmittedlist: [] as any,
    lnkchqsubmitedtodeplist: [] as any,
    lnkbtnejariDetailsGetlist: [] as any,
    lnkchqsentformgrlist: [] as any,
    lnkchqrcvdfrommgrlist: [] as any,
    lnkchqcollectedpmgrlist: [] as any,
    lnkbtnEscalationCeoGetlist: [] as any,
    drecDetailsall: [] as any
  } as any;
  
  drecdetailssearch: any;

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

   
  drecDetails() {
    let myTitle = 'Drec';
    this.presentLoadingDefault(true);
    this.authService.getData({}, 'drec/DrecList').then((result) => {
        this.drecDetailsall = result;
        this.drecdetailssearch = result;
        this.presentLoadingDefault(false);

    }, (err) => {
        this.presentLoadingDefault(false);
        this.presentToast(err);
    });
}

  ionViewDidLoad() {
    this.drecDetails();
  }
 
  
  openDetailModal(type: any) {
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };
    
    let myModalData = [{      
      type : type
    }];

    let myModal: Modal = this.modal.create('DrecDetailsPage', { data: myModalData }, myModalOptions);

    myModal.present();

    myModal.onDidDismiss((data) => {
      this.ionViewDidLoad();
    });

    myModal.onWillDismiss((data) => {
      this.ionViewDidLoad();
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
