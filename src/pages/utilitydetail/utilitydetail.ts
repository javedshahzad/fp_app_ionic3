import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, Modal, ModalController, ModalOptions, ViewController } from 'ionic-angular';
import { DashboardPage } from '../dashboard/dashboard';
import { RestProvider } from '../../providers/rest/rest';

@IonicPage()
@Component({
  selector: 'page-utilitydetail',
  templateUrl: 'utilitydetail.html',
})

export class UtilityDetailPage {

  resourcedetails: any = localStorage.getItem('resourseData');
  user: any = localStorage.getItem('userData');
  Data = this.navParams.get('data');

  searchData = { "search_value": "" };
  utilityDetails: any;
  utilitySummaryDetails:any;

  showiteminall = 0;
  showiteminall1 =0;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public authService: RestProvider, public toastCtrl: ToastController, private modal: ModalController,
    public loadingCtrl: LoadingController, public view: ViewController) {
    this.user = this.user ? JSON.parse(this.user) : {};
    this.resourcedetails = this.resourcedetails ? JSON.parse(this.resourcedetails) : {};
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
    this.getUtilityDetailsByStatus();
  }

  getUtilityDetailsByStatus() {

    let Data = this.navParams.get('data');

    if (Data[0].labeltype != "" && Data[0].labeltype != null) {

      let params = {
        user_info_id: this.user.UserInfoId,
        labeltype: Data[0].labeltype
      };

      this.presentLoadingDefault(true);
      this.authService.postData(params, 'utility/getUtilitySummaryAll').then((result) => {

        this.utilitySummaryDetails = result;
        console.log(this.utilitySummaryDetails);
        this.showiteminall1 = 1;
        this.presentLoadingDefault(false);

      }, (err) => {
        this.presentLoadingDefault(false);
        this.presentToast(err);
      });


    } else {
      
      let params = {
        user_info_id: this.user.UserInfoId,
        status: Data[0].status
      };

      this.presentLoadingDefault(true);
      this.authService.postData(params, 'utility/getUtilityDetailsByStatus').then((result) => {

        this.utilityDetails = result;
        this.showiteminall = 1;

        console.log(this.utilityDetails);
        this.presentLoadingDefault(false);

      }, (err) => {
        this.presentLoadingDefault(false);
        this.presentToast(err);
      });

    }

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


  openModal(groupid: any,unit_name:any,paymode:any) {

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    
    let myModalData = [{
      groupid: groupid,
      unitname: unit_name,
      paymode: paymode
    }];

    let myModal: Modal = this.modal.create('UtilityPaymentDetailPage', { data: myModalData }, myModalOptions);

    myModal.present();

    myModal.onWillDismiss(() => {
      this.ionViewDidLoad();
    });

  }

}
