import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, Modal, ModalController, ModalOptions, ViewController } from 'ionic-angular';
import { DashboardPage } from '../dashboard/dashboard';
import { RestProvider } from '../../providers/rest/rest';

@IonicPage()
@Component({
  selector: 'page-hoto',
  templateUrl: 'hoto.html'
})
export class HotoPage {
  hotoDetailsall: any;
  insertedValues: any;
  searchData = { "search_value": "" };
  hotodetailssearch: any;
  user: any = localStorage.getItem('userData');
  ImageList:any;

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

  hotoDetails() {
    let myTitle = 'Hoto';
    this.presentLoadingDefault(true);
    this.authService.getData({}, 'hoto/HotoList').then((result) => {
      this.hotoDetailsall = result;
      this.hotodetailssearch = result;
      this.presentLoadingDefault(false);
      if (this.hotoDetailsall.length > 0) {
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
    this.hotoDetails();
  }

  openModal(LEASE_NUM: any, HANDOVER_ID: any) {

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let myModalData = [{
      LEASE_NUM: LEASE_NUM,
      HOTO_ID: HANDOVER_ID
    }];

    let myModal: Modal = this.modal.create('HotoCommentPage', { data: myModalData }, myModalOptions);

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


  SearchhotoDetail() {
    let hoto_val = this.searchData.search_value;
    if (hoto_val != '') {
      this.hotoDetailsall = this.hotodetailssearch.filter(item => (item.LEASE_NUMBER ? item.LEASE_NUMBER.includes(hoto_val) : '') || (item.UNIT ? item.UNIT.includes(hoto_val) : '') || (item.TENANT_NAME ? item.TENANT_NAME.includes(hoto_val) : ''));
    } else {
      this.hotoDetailsall = this.hotodetailssearch
    }
  }

  openAttachment(HANDOVER_ID:any,LEASE_NUMBER:any){
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };
  
    let  myModalData = [{
      LEASE_NUMBER: LEASE_NUMBER,
      HANDOVER_ID:HANDOVER_ID
    }];
  
    let myModal: Modal = this.modal.create('HotoattachmentPage', { data: myModalData }, myModalOptions);
  
    myModal.present();
  
  
    myModal.onWillDismiss(() => {
      this.ionViewDidLoad();
      // console.log("I'm about to dismiss");
      // console.log(data);
    });
  }

  Getallimagelist(LEASE_NUMBER: any, count: any) {
    if (count > 0) {
      this.presentLoadingDefault(true);
      this.authService.getData({}, 'hoto/GethotoattachList/'+LEASE_NUMBER + '').then((result) => {
        this.presentLoadingDefault(false);
        this.ImageList = result;
        const myModalOptions: ModalOptions = {
          enableBackdropDismiss: false
        };
        const myModalData = [{
          ImageList: this.ImageList,
          page_name: 'HOTO'
        }];

        const myModal: Modal = this.modal.create('lpoimagelist', { data: myModalData }, myModalOptions);
        myModal.present();
        myModal.onDidDismiss((data) => {
        });
        myModal.onWillDismiss((data) => {
        });

      }, (err) => {
        this.presentLoadingDefault(false);
        this.presentToast(err);
      });
    } else {
      this.presentToast('No Image Found');
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
