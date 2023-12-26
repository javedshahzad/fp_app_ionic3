import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, LoadingController, ViewController, ToastController } from 'ionic-angular';
import { ItemlistModelPage } from '../itemlist-model/itemlist-model';
import { RestProvider } from '../../providers/rest/rest';

@IonicPage()
@Component({
  selector: 'page-inventoryItem',
  templateUrl: 'inventoryItem.html',
})
export class InventoryItemPage {
 
  inventoryList: any;
  inventoryImageList:any;
  imagecount = 0;
  Data = this.navParams.get('data');
  itemDetails = this.Data[0].itemDetails;
  constructor(public navCtrl: NavController, public navParams: NavParams, public modelCtrl: ModalController,
    public authService: RestProvider, public toastCtrl: ToastController, public loadingCtrl: LoadingController,
    public view: ViewController
  ) {
  }


  ionViewWillLoad() {
    console.log('ionViewDidLoad');
    console.log(this.itemDetails);
    this.getInventoryItemImages();
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'top'
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

  closeModal() {
    this.view.dismiss();
  }

  getInventoryItemImages() {

      let params = {
          item_id: this.itemDetails.ITEM_ID
      }
      console.log(params);

      this.authService.postData(params, 'inventory/getInventoryImageList').then((result) => {
        this.inventoryImageList = result; 
        if(this.inventoryImageList.length > 0){
          this.imagecount = 1;
        }else{
          this.imagecount = 0;
        }
        
        console.log(this.inventoryImageList);

      }, (err) => {
        this.presentToast(err);
      });
    
  }

  getImage(){
    let objFile = this.inventoryImageList[0];
    let bytes = objFile.FILE_CONTENT.data;
    let file_type = objFile.FILE_TYPE;
    let file_name = objFile.FILE_NAME;
    let nameSplit = file_name.split('.');
    let extn = nameSplit[nameSplit.length - 1];
    if(file_type == 'IMAGE'){
      return `data:image/${extn};base64,${this.encode(bytes)}`;
    }else{
      return `./assets/imgs/no-found-photo.png`
    }
  }

  
  encode (input) {
    var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var output = "";
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    var i = 0;

    while (i < input.length) {
        chr1 = input[i++];
        chr2 = i < input.length ? input[i++] : Number.NaN; // Not sure if the index 
        chr3 = i < input.length ? input[i++] : Number.NaN; // checks are needed here

        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;

        if (isNaN(chr2)) {
            enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
            enc4 = 64;
        }
        output += keyStr.charAt(enc1) + keyStr.charAt(enc2) +
                  keyStr.charAt(enc3) + keyStr.charAt(enc4);
    }
    return output;
  }

}

