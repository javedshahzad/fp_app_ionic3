import { Component } from '@angular/core';
import { NavController, NavParams, Modal, ModalController, ModalOptions,ViewController, ToastController } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { DashboardPage } from '../dashboard/dashboard';

@Component({
  selector: 'page-inventory',
  templateUrl: 'inventory.html',
})
export class InventoryPage {
  inventoryList: any;
  inventoryDetails: any;
  searchData = { "search_value": "" };


  resourcedetails: any = localStorage.getItem('resourseData');
  user: any = localStorage.getItem('userData');

  constructor(public navCtrl: NavController, public navParams: NavParams, private modal: ModalController,
    public authService: RestProvider, public toastCtrl: ToastController,public view: ViewController,
  ) {

    this.user = this.user ? JSON.parse(this.user) : {};
    this.resourcedetails = this.resourcedetails ? JSON.parse(this.resourcedetails) : {};

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InventoryPage');

    let params = {
      user_info_id: this.user.UserInfoId
    }

    this.authService.postData(params, 'inventory/getInventorySearchList').then((result) => {
      this.inventoryList = result;
      if (this.inventoryList.length == 0) {
        this.presentToast("No data found.");
      }
    }, (err) => {
      this.presentToast(err);
    });

  }

  goBack() {
    this.navCtrl.setRoot(DashboardPage);
  }

  SearchInventory() {
    if (this.searchData.search_value) {
      this.authService.postData(this.searchData, 'inventory/getInventorySearchList').then((result) => {
        this.inventoryList = result;
        if (this.inventoryList.length == 0) {
          this.presentToast("No data found.");
        }

      }, (err) => {
        this.presentToast(err);
      });
    }
    else {
      this.presentToast("enter the Barcode Number");
    }
  }

  SearchInventoryById(itemID) {

    let itemDetails = this.inventoryList.find(item => item.ITEM_ID == itemID);

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };
    
    let myModalData = [{
      itemDetails: itemDetails
    }];

    let myModal: Modal = this.modal.create('InventoryItemPage', { data: myModalData }, myModalOptions);

    myModal.present();

    myModal.onWillDismiss(() => {
      this.ionViewDidLoad();
    });

  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'top'
    });
    toast.present();
  }

  closeModal() {
    this.view.dismiss();
  }
  
}
