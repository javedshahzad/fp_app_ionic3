import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,LoadingController,Modal, ModalController, ModalOptions,ViewController } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';

@IonicPage()
@Component({
  selector: 'page-securitybuild',
  templateUrl: 'securitybuild.html',
})
export class SecurityBuildPage {
  securitybuildcount:any;
  securitydepositlist:any;
  overdueunitcount:any;
  overduelist:any;
  rentalunitcount:any;
  rentallist:any;
  myModalData:any;
  type:any;
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
      this.getavailabilityunitcount(); 
  }
  getavailabilityunitcount(){
    const Data = this.navParams.get('data');
    let PROPERTY= Data[0];
    this.presentLoadingDefault(true);
    this.authService.postData(PROPERTY,'security/SecurityDepositBuildingList/').then((result) => {
      this.securitybuildcount = result;
      if(this.securitybuildcount.length > 0){
        this.getsecuritydepositlist();
        //this.presentToast(`Data found in ${myTitle}`);
      }else{
        this.presentLoadingDefault(false);
        //this.presentToast(`No data found in ${myTitle}`);
      }
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });
  }
  
  getsecuritydepositlist(){
    this.presentLoadingDefault(true);
    let myTitle = 'Security Deposite';
    this.authService.getData({},'security/SecurityDetails/').then((result) => {
      this.securitydepositlist = result;
      if(this.securitydepositlist.length > 0){
        this.presentLoadingDefault(false);
        console.log(`Data found in ${myTitle}`);
      }else{
        this.presentLoadingDefault(false);
        console.log(`No data found in ${myTitle}`);
      }
    }, (err) => {
        console.log(err);
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

  openModal(PROPERTY_NAME:any,BUILD_CODE:any) {

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: true
    };
      this.myModalData = [this.securitydepositlist.filter(item => (item.PROPERTY_NAME ===PROPERTY_NAME) && (item.BUILD_CODE ===BUILD_CODE))
                          ]

    let myModal: Modal = this.modal.create('SecurityDepositDetailPage', { data: this.myModalData }, myModalOptions);

    myModal.present();

    myModal.onDidDismiss((data) => {
    });

    myModal.onWillDismiss((data) => {
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