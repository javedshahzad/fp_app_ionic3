import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,LoadingController,Modal, ModalController, ModalOptions,ViewController } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';

/**
 * Generated class for the ModalPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-customerserviceunit',
  templateUrl: 'customerserviceunit.html',
})
export class CustomerServiceUnitPage {
  service_and_demand_unitcount:any;
  myModalData:any;
  TYPE:any;
  unitdata = this.navParams.get('data');
    insertedValues: any;
    user : any = localStorage.getItem('userData');
    constructor(public navCtrl: NavController, public navParams: NavParams, 
        public authService:RestProvider, public toastCtrl:ToastController,private modal: ModalController,
        public loadingCtrl: LoadingController, public view: ViewController) {
            this.user = this.user ? JSON.parse(this.user) : {};  
    }

  loading = this.loadingCtrl.create(); 
  presentLoadingDefault(show) { 
    if(!this.loading){
      this.loading = this.loadingCtrl.create(); 
    }  
    if(show){
      this.loading.present();
    }
    else{
      this.loading.dismissAll();
      this.loading =null
    }
  };

  ionViewWillLoad() {
    const Data = this.navParams.get('data');
    if(Data[0].TYPE=="Service Charge"){
      this.getunitcount();
    }else if(Data[0].TYPE == "Demand Charge"){
      this.getunitcount();
    }
  }
  getunitcount(){
    const Data = this.navParams.get('data');
    let myTitle = 'Building List';
    this.presentLoadingDefault(true);
    this.authService.postData(Data[0],'customer/Unit/').then((result) => {
      this.service_and_demand_unitcount = result;
      if(this.service_and_demand_unitcount.length > 0){
        this.presentLoadingDefault(false);
      //this.presentToast(`Data found in ${myTitle}`);
      }else{
        this.presentLoadingDefault(false);
        this.presentToast(`No data found in ${myTitle}`);
      }
    }, (err) => {
      this.presentLoadingDefault(false);
    this.presentToast(err);
    });
  }
  


  resetForm(){
    this.navCtrl.setRoot(this.navCtrl.getActive().component);
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position:'middle'
    });
    toast.present();
  }


  openModal(PROPERTY_NAME:any,BUILD_CODE:any,type:any) {

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };
    if(type=="Service Charge"){
      this.myModalData = [PROPERTY_NAME= PROPERTY_NAME,this.TYPE = type,BUILD_CODE=BUILD_CODE]
    }else if(type=="Demand Charge"){
      this.myModalData = [PROPERTY_NAME= PROPERTY_NAME,this.TYPE = type,BUILD_CODE=BUILD_CODE]
    }

    let myModal: Modal = this.modal.create('CustomerServiceModalPage', { data: this.myModalData }, myModalOptions);

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
    }else {
      loading.dismissAll();
      loading = null
    }
  }

}