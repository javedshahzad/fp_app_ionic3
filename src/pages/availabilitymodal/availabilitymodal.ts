import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, Modal, ModalController, ModalOptions, ViewController } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';

@IonicPage()
@Component({
  selector: 'page-availabilitymodal',
  templateUrl: 'availabilitymodal.html',
})
export class AvailabilityModalPage {
  availabilitydetails: any;
  overduedetails: any;
  rentaldetails: any;
  modaltype = this.navParams.get('data');
  user: any = localStorage.getItem('userData');
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public authService: RestProvider, public toastCtrl: ToastController,
    public loadingCtrl: LoadingController, public view: ViewController,
    private modal: ModalController
  ) {
    this.user = this.user ? JSON.parse(this.user) : {};
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

  ionViewWillLoad() {
    const Data = this.navParams.get('data');
    if (Data[1] == "Availability") {
      this.availabilitydetails = Data;
    } else if (Data[1] == "Overdue") {
      this.overduedetails = Data;
      console.log(this.overduedetails);
    } else {
      this.rentaldetails = Data;
      console.log(this.rentaldetails);
    }
  }
  resetForm() {
    this.navCtrl.setRoot(this.navCtrl.getActive().component);
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'middle'
    });
    toast.present();
  }
  closeModal() {
    this.view.dismiss();
  }


  openModal(LEASE_NUM: any, RENT_DATA: any) {

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let myModalData = [{
      LEASE_NUM: LEASE_NUM,
      RENT_DATA: RENT_DATA
    }];

    let myModal: Modal = this.modal.create('RentalOverdueCommentPage', { data: myModalData }, myModalOptions);

    myModal.present();

    myModal.onDidDismiss((data) => {
      this.ionViewWillLoad();
    });

    myModal.onWillDismiss((data) => {
      this.ionViewWillLoad();
    });

  }

  openModalRentalBalance(LEASE_NUM: any, RENT_DATA: any) {

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
      this.ionViewWillLoad();
    });

    myModal.onWillDismiss((data) => {
      this.ionViewWillLoad();
    });

  }

}