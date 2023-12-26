import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController, Modal, ModalController, ModalOptions, ViewController } from 'ionic-angular';
import { DashboardPage } from '../dashboard/dashboard';
import { RestProvider } from '../../providers/rest/rest';

@Component({
  selector: 'page-finance',
  templateUrl: 'finance.html',
})

export class FinanceListPage {

  financedetailsll: any;
  insertedValues: any;
  financesearch: any;
  searchData = { "search_value": "" };
  finance_ceo_esculation = 'none';
  user: any = localStorage.getItem('userData');
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public authService: RestProvider, public toastCtrl: ToastController,
    private modal: ModalController,
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

  jobAssignmentDetails() {
    let myTitle = 'finance';
    this.presentLoadingDefault(true);
    this.authService.getData({}, 'finance/FinanceEscalationList').then((result) => {
      this.financedetailsll = result;
      this.financesearch = result;
      console.log(this.financesearch);
      this.presentLoadingDefault(false);
      if (this.financedetailsll.length > 0) {
        this.presentLoadingDefault(false);
        //this.presentToast(`Data found in ${myTitle}`);
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
    this.jobAssignmentDetails();
  }

  closeModal() {
    this.view.dismiss();
  }

  openFinanceCMTSModal(PAYREQ_ID:any){
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };
  
    let  myModalData = [{
      PAYREQ_ID: PAYREQ_ID
    }];
  
    let myModal: Modal = this.modal.create('FinanceCommentPage', { data: myModalData }, myModalOptions);
  
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

  show_esculation(type:any){
    if(type == 'CEO'){
      this.finance_ceo_esculation ='block';
    }else{
      this.finance_ceo_esculation ='none';
    }
  }

  // Case ceo escalation data extend//
  showfinanceceoBtn = -1;
  isfinanceceoOpen = false;
  oldfinanceceoBtn = -1;
  showUndofinanceceoBtn(index) {
    if (this.isfinanceceoOpen == false) {
      this.isfinanceceoOpen = true;
      this.oldfinanceceoBtn = index;
      this.showfinanceceoBtn = index;
    } else {
      if (this.oldfinanceceoBtn == index) {
        this.isfinanceceoOpen = false;
        this.showfinanceceoBtn = -1;
        this.oldfinanceceoBtn = -1;
      } else {
        this.showfinanceceoBtn = index;
        this.oldfinanceceoBtn = index;
      }
    }
  }

  SearchdrecDetail() {
    let drec_val = this.searchData.search_value;
    if (drec_val != '') {
      this.financesearch = this.financesearch.filter(item => (item.DESCRIPTION ? item.DESCRIPTION.includes(drec_val) : ''));
    } else {
      this.financesearch = this.financedetailsll;
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