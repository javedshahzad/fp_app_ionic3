import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, Modal, ModalController, ModalOptions, ViewController } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';

@IonicPage()
@Component({
  selector: 'page-propertymodal',
  templateUrl: 'propertymodal.html',
})
export class PropertyModalPage {
  avilabilityunitcount: any;
  availabilitylist: any;
  overdueunitcount: any;
  overduelist: any;
  rentalunitcount: any;
  rentallist: any;
  myModalData: any;
  type: any;
  unitdata = this.navParams.get('data');
  insertedValues: any;
  user: any = localStorage.getItem('userData');
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public authService: RestProvider, public toastCtrl: ToastController, private modal: ModalController,
    public loadingCtrl: LoadingController, public view: ViewController) {
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
    if (Data[0].TYPE == "Availability") {
      this.getavailabilityunitcount();
    } else if (Data[0].TYPE == "Overdue") {
      this.getoverdueunitcount();
    } else {
      this.getrentalunitcount();
    }
  }
  getavailabilityunitcount() {
    const Data = this.navParams.get('data');
    let myTitle = 'Availability Building';
    let PROPERTY = Data[0];
    this.presentLoadingDefault(true);
    this.authService.postData(PROPERTY, 'property/AvailabilityUnit/').then((result) => {
      this.avilabilityunitcount = result;
      if (this.avilabilityunitcount.length > 0) {
        this.getavailabilitylist();
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
  getavailabilitylist() {
    this.presentLoadingDefault(true);
    let myTitle = 'Availability';
    this.authService.getData({}, 'property/AvailabilityDetails/').then((result) => {
      this.availabilitylist = result;
      if (this.availabilitylist.length > 0) {
        this.presentLoadingDefault(false);
        console.log(`Data found in ${myTitle}`);
      } else {
        this.presentLoadingDefault(false);
        console.log(`No data found in ${myTitle}`);
      }
    }, (err) => {
      console.log(err);
    });
  }

  getoverdueunitcount() {
    const Data = this.navParams.get('data');
    let myTitle = 'Overdue Building';
    let PROPERTY = Data[0];
    this.presentLoadingDefault(true);
    this.authService.postData(PROPERTY, 'property/OverdueUnit/').then((result) => {
      this.overdueunitcount = result;
      if (this.overdueunitcount.length > 0) {
        this.getoverduelist();
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
  getoverduelist() {
    this.presentLoadingDefault(true);
    let myTitle = 'Overdue';
    this.authService.getData({}, 'property/OverdueDetails/').then((result) => {
      this.overduelist = result;
      if (this.overduelist.length > 0) {
        this.presentLoadingDefault(false);
        console.log(`Data found in ${myTitle}`);
      } else {
        this.presentLoadingDefault(false);
        console.log(`No data found in ${myTitle}`);
      }
    }, (err) => {
      console.log(err);
    });
  }

  getrentalunitcount() {
    const Data = this.navParams.get('data');
    let myTitle = 'Rental Building';
    let PROPERTY = Data[0];
    this.presentLoadingDefault(true);
    this.authService.postData(PROPERTY, 'property/RentalUnit/').then((result) => {
      this.rentalunitcount = result;
      if (this.rentalunitcount.length > 0) {
        this.getrentallist();
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
  getrentallist() {
    this.presentLoadingDefault(true);
    let myTitle = 'Rental';
    this.authService.getData({}, 'property/RentalDetails/').then((result) => {
      this.rentallist = result;
      if (this.rentallist.length > 0) {
        this.presentLoadingDefault(false);
        console.log(`Data found in ${myTitle}`);
      } else {
        this.presentLoadingDefault(false);
        console.log(`No data found in ${myTitle}`);
      }
    }, (err) => {
      console.log(err);
    });
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


  openModal(PROPERTY_NAME: any, BUILDING_CODE: any, type: any) {

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };
    if (type == "Availability") {
      this.myModalData = [this.availabilitylist.filter(item => (item.PROPERTY_NAME === PROPERTY_NAME) && (item.BUILDING_CODE === BUILDING_CODE)),
      this.type = type
      ]
    } else if (type == "Overdue") {
      this.myModalData = [this.overduelist.filter(item => (item.PROPERTY_NAME === PROPERTY_NAME) && (item.BUILD_CODE === BUILDING_CODE)),
      this.type = type
      ]
    } else {
      this.myModalData = [this.rentallist.filter(item => (item.PROP_NAME === PROPERTY_NAME) && (item.BUILD_CODE === BUILDING_CODE)),
      this.type = type
      ]
    }

    let myModal: Modal = this.modal.create('AvailabilityModalPage', { data: this.myModalData }, myModalOptions);

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

  closeModal() {
    this.view.dismiss();
  }

  presentLoadingCustom(show) {
    let loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: `<img width = 50 height= 50 src="assets/imgs/logo_new.png" />`,
      duration: 5000
    });

    if (show) {
      loading.present();
    } else {
      loading.dismissAll();
      loading = null
    }
  }

}