import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, Modal, ModalController, ModalOptions, ViewController } from 'ionic-angular';
import { DashboardPage } from '../dashboard/dashboard';
import { RestProvider } from '../../providers/rest/rest';

@IonicPage()
@Component({
  selector: 'page-utilitypaymentdetail',
  templateUrl: 'utilitypaymentdetail.html',
})

export class UtilityPaymentDetailPage {

  resourcedetails: any = localStorage.getItem('resourseData');
  user: any = localStorage.getItem('userData');
  Data = this.navParams.get('data');

  paymentid:any;
  unitname:any;
  paymode:any;
  TotalAmount = 0;
  payee:any;
  searchData = { "search_value": "" };
  utilityDetails: any;
  utilityPaymentDetails:any;
 
  showiteminall = 0;
  showiteminall1 =0;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public authService: RestProvider, public toastCtrl: ToastController, private modal: ModalController,
    public loadingCtrl: LoadingController, public view: ViewController) {
    this.user = this.user ? JSON.parse(this.user) : {};
    this.resourcedetails = this.resourcedetails ? JSON.parse(this.resourcedetails) : {};

    let Data = this.navParams.get('data');
    this.paymentid = Data[0].groupid;
    this.unitname = Data[0].unitname;
    this.paymode = Data[0].paymode;
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
    //this.navCtrl.setRoot(DashboardPage);
    this.view.dismiss();
  }


  ionViewDidLoad() {
    this.getUtilityPaymentDetails();
  }

  getUtilityPaymentDetails() {

    let Data = this.navParams.get('data');
          
      let params = {
        user_info_id: this.user.UserInfoId,
        groupId: Data[0].groupid
      };

      this.presentLoadingDefault(true);
      this.authService.postData(params, 'utility/getUtilityPaymentDetails').then((result) => {

        this.utilityPaymentDetails = result;
        console.log(this.utilityPaymentDetails);

        for(let i=0; i< this.utilityPaymentDetails.length; i++){
            console.log(this.utilityPaymentDetails[i].TOTAL);
            this.TotalAmount = this.TotalAmount + parseFloat(this.utilityPaymentDetails[i].TOTAL);
            this.payee = this.utilityPaymentDetails[0].PAYEE
        }
        this.presentLoadingDefault(false);

      }, (err) => {
        this.presentLoadingDefault(false);
        this.presentToast(err);
      });

    

  }

  showBtn = -1;
  isOpen = false;
  oldBtn = -1;

  showUndoBtn(index) {
    if (this.isOpen == false) {
      this.isOpen = true;
      this.oldBtn = index;
      this.showBtn = index;
    } else {
      if (this.oldBtn == index) {
        this.isOpen = false;
        this.showBtn = -1;
        this.oldBtn = -1;
      } else {
        this.showBtn = index;
        this.oldBtn = index;
      }
    }
  }

  openModal(groupid: any) {

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    
    let myModalData = [{
      groupid: groupid
    }];

    let myModal: Modal = this.modal.create('UtilityPaymentCommentPage', { data: myModalData }, myModalOptions);

    myModal.present();

    myModal.onWillDismiss(() => {
      this.ionViewDidLoad();
    });

  }

  
  openModalUpload(groupid: any) {

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    
    let myModalData = [{
      groupid: groupid
    }];

    let myModal: Modal = this.modal.create('UtilityAttachmentPage', { data: myModalData }, myModalOptions);

    myModal.present();

    myModal.onWillDismiss(() => {
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
