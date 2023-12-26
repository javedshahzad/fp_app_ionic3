import { Component } from '@angular/core';
import { NavController, NavParams,ToastController,LoadingController,Events } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { AssetpreventivemaintancePage } from '../assetpreventivemaintance/assetpreventivemaintance';
/**
 * Generated class for the SearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {
  assetDetailsList : any;
  assetDetails:any;
  searchData = {"search_value": ""};
  public user = {} as any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public events: Events,
    public authService:RestProvider, public toastCtrl:ToastController,public loadingCtrl: LoadingController) {
     
  }
  loading = this.loadingCtrl.create();
  SearchAssetDetail(){
    // Your app login API web service call triggers 
      if(this.searchData.search_value){
        this.authService.postData(this.searchData,'asset_details/getAssetDetailsSearchList').then((result) => {
        this.assetDetailsList = result;
        if(this.assetDetailsList.length == 0)
          this.presentToast("No data found for this Barcode no");
       //   console.log('List ',this.assetDetailsList);
      }, (err) => {
        this.presentToast(err);
      });
      }
      else{
      this.presentToast("Enter the Barcode number");
      }
  }
  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position:'middle',
      cssClass:'toast-style'
    });
    toast.present();
  }
  ionViewDidLoad() {
    this.events.publish('userloggedin');
  //  console.log('ionViewDidLoad SearchPage');
  }
  getAssetDetailPreventiveMaintancePage(assetDetailId){
    this.assetDetails = assetDetailId
    this.presentLoadingDefault(true);
   // console.log('ionViewDidLoad assetDetailId ' , assetDetailId);
    this.authService.getData({},'asset_details/getAssetDetailPrevMainById/'+assetDetailId).then((result) => {
      this.presentLoadingDefault(false);
      let assetDetailsPrevMaintance = result;  
      this.navCtrl.setRoot(AssetpreventivemaintancePage,{'assetDetail':assetDetailsPrevMaintance});
  }, (err) => {
    this.presentToast(err);
    this.presentLoadingDefault(false);
  });
    
  }
  presentLoadingDefault(show) {    
    if(show)
      this.loading.present();
    else
      this.loading.dismiss();
  };

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
