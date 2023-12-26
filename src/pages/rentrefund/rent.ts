import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController, Modal, ModalController, ModalOptions, ViewController } from 'ionic-angular';
import { DashboardPage } from '../dashboard/dashboard';
import { RestProvider } from '../../providers/rest/rest';

@Component({
  selector: 'page-rent',
  templateUrl: 'rent.html',
})
export class RentPage {
  rentdetailsall: any;
  rentdetails: any;
  insertedValues: any;
  searchData = { "search_value": "" };
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
    let myTitle = 'Rent Refund';
    this.presentLoadingDefault(true);
    this.authService.getData({}, 'rent/RentList').then((result) => {
      this.rentdetailsall = result;
      this.rentdetails = result;
      this.presentLoadingDefault(false);
      if (this.rentdetailsall.length > 0) {
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
    this.returndetails();
  }

  openModal(UNIT: any, CLIENT: any,RENT_DATA:any) {

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let myModalData = [{
      UNIT: UNIT,
      CLIENT: CLIENT,
      RENT_DATA:RENT_DATA
    }];

    let myModal: Modal = this.modal.create('RentCommentPage', { data: myModalData }, myModalOptions);

    myModal.present();

    myModal.onDidDismiss((data) => {
    });

    myModal.onWillDismiss((data) => {
    });

  }

  SearchrentDetail() {
    let search_val = this.searchData.search_value;
    if (search_val != '') {
      this.rentdetails = this.rentdetailsall.filter(item => (item.CUSTOMER_NUMBER ? item.CUSTOMER_NUMBER.includes(search_val) : '') || (item.CLIENT ? item.CLIENT.includes(search_val) : '') || (item.UNIT ? item.UNIT.includes(search_val) : ''));
    } else {
      this.rentdetails = this.rentdetailsall;
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
