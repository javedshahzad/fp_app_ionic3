import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController, Modal, ModalController, ModalOptions, ViewController } from 'ionic-angular';
import { DashboardPage } from '../dashboard/dashboard';
import { RestProvider } from '../../providers/rest/rest';


@Component({
  selector: 'page-rentaloverduelabel',
  templateUrl: 'rentaloverduelabel.html',
})
export class RentalOverdueLabelPage {

  paymentdetailsall: any;
  searchpaymentdetails = [] as any;
  insertedValues: any;
  modalnavigationdata: any;
  payment_list_show = 'none';
  payment_list = 'block';
  securitydepositlist: any;

  rentdetailsall: any;
  rentdetails: any;

  caseCount: any;
  within_60days: any;
  above_180days: any;
  above_60_180days

  searchData = { "search_value": "" };
  user: any = localStorage.getItem('userData');
  resourceData: any = localStorage.getItem('resourseData');

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public authService: RestProvider, public toastCtrl: ToastController, private modal: ModalController,
    public loadingCtrl: LoadingController, public view: ViewController) {
    this.user = this.user ? JSON.parse(this.user) : {};
    this.resourceData = this.resourceData ? JSON.parse(this.resourceData) : {};
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


  ionViewDidLoad() {
    this.returndetails();
  }

  returndetails() {
    let myTitle = 'Rent Refund';
    this.presentLoadingDefault(true);
    let data = {
      user_id: this.user.UserInfoId,
      resource_id: this.resourceData.RESOURCE_ID,
      res_type_id: this.resourceData.TYPE_ID
    }

    this.authService.postData(data, 'rent/getRentalOverdueLabelWise').then((result) => {

      this.rentdetailsall = result;
      this.rentdetails = result;

      console.log(this.rentdetailsall);

      this.caseCount = this.rentdetailsall[0].CASE_COUNT;
      this.within_60days = this.rentdetailsall[0].WITHIN_60DAYS;
      this.above_60_180days = this.rentdetailsall[0].ABOVE_60_180DAYS;
      this.above_180days = this.rentdetailsall[0].ABOVE_180DAYS;

      this.presentLoadingDefault(false);
      if (this.rentdetailsall.length > 0) {
        this.presentLoadingDefault(false);
      } else {
        this.presentLoadingDefault(false);
        this.presentToast(`No data found in ${myTitle}`);
      }
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });
  }

  openDetailModal(type: any) {

    let showmodal = 0;

    if (type == 'Within 60 days' && this.within_60days > 0) {

      showmodal = 1;

    } else if (type == 'Above 60 to 180 days' && this.above_60_180days > 0) {
      showmodal = 1;

    } else if (type == 'Above 180 days' && this.above_180days > 0) {
      showmodal = 1;

    } else if (type == 'Legal Case' && this.caseCount > 0) {
      showmodal = 1;

    }

    if (showmodal == 1) {

      const myModalOptions: ModalOptions = {
        enableBackdropDismiss: false
      };

      let myModalData = [
        type
      ];

      let myModal: Modal = this.modal.create('RentalOverduePage', { data: myModalData }, myModalOptions);

      myModal.present();

      myModal.onDidDismiss((data) => {
        this.ionViewDidLoad();
      });

      myModal.onWillDismiss((data) => {
        this.ionViewDidLoad();
      });

    }

  }

  SearchpaymentDetail() {

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
