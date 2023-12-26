import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController, Modal, ModalController, ModalOptions, ViewController, IonicPage } from 'ionic-angular';
import { DashboardPage } from '../dashboard/dashboard';
import { RestProvider } from '../../providers/rest/rest';


@IonicPage()
@Component({
  selector: 'page-rentalbalance',
  templateUrl: 'rentalbalance.html',
})
export class RentalBalancePage {

  rentdetailsall: any;
  rentdetails: any;
  rentalOverdueList:any;

  insertedValues: any;
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

  closeModal() {
    this.view.dismiss();
  }

  returndetails() {
    let myTitle = 'Rent Refund';
    let Data = this.navParams.get('data');

    console.log(Data);

    this.presentLoadingDefault(true);
    let data = {
      user_id: this.user.UserInfoId,
      resource_id: this.resourceData.RESOURCE_ID,
      res_type_id: this.resourceData.TYPE_ID
    }

    this.authService.postData(data, 'rent/getRentalBalanceList').then((result) => {
      this.rentalOverdueList = result;

      if(Data[0] == 'Within 60 days'){
        this.rentdetailsall = this.rentalOverdueList.filter(x=> x.WITHIN_DAYS <= 60 && x.CASE_COUNT == 0);
        this.rentdetails    = this.rentalOverdueList.filter(x=> x.WITHIN_DAYS <= 60 && x.CASE_COUNT == 0);
      }else if(Data[0] == 'Above 60 to 180 days'){
        this.rentdetailsall = this.rentalOverdueList.filter(x=> x.WITHIN_DAYS >= 61 && x.WITHIN_DAYS <= 180 && x.CASE_COUNT == 0);
        this.rentdetails    = this.rentalOverdueList.filter(x=> x.WITHIN_DAYS >= 61 && x.WITHIN_DAYS <= 180 && x.CASE_COUNT == 0);
      }else if(Data[0] == 'Above 180 days'){
        this.rentdetailsall = this.rentalOverdueList.filter(x=> x.WITHIN_DAYS > 180 && x.CASE_COUNT == 0);
        this.rentdetails    = this.rentalOverdueList.filter(x=> x.WITHIN_DAYS > 180 && x.CASE_COUNT == 0);
      }else if(Data[0] == 'Legal Case'){
        this.rentdetailsall = this.rentalOverdueList.filter(x=> x.CASE_COUNT > 0);
        this.rentdetails    = this.rentalOverdueList.filter(x=> x.CASE_COUNT > 0);
      }else{
        this.rentdetailsall = result;
        this.rentdetails    = result;
      }

      console.log(this.rentdetailsall);

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


  openModal(LEASE_NUM: any, RENT_DATA: any) {

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let myModalData = [{
      LEASE_NUM: LEASE_NUM,
      RENT_DATA: RENT_DATA
    }];

    let myModal: Modal = this.modal.create('RentalBalanceCommentPage', { data: myModalData }, myModalOptions);

    myModal.present();

    myModal.onDidDismiss((data) => {
      this.ionViewDidLoad();
    });

    myModal.onWillDismiss((data) => {
      this.ionViewDidLoad();
    });

  }

  SearchrentDetail() {
    let search_val = this.searchData.search_value;
    if (search_val != '') {
      this.rentdetails = this.rentdetailsall.filter(item => (item.LEASE_NUM ? item.LEASE_NUM.includes(search_val) : '') || (item.CUSTOMER_NAME ? item.CUSTOMER_NAME.includes(search_val) : '') || (item.UNIT ? item.UNIT.includes(search_val) : ''));
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
