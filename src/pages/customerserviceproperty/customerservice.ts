import { Component } from '@angular/core';
import { NavController, NavParams,ToastController,LoadingController,Modal, ModalController, ModalOptions,ViewController } from 'ionic-angular';
import { DashboardPage } from '../dashboard/dashboard';
import { RestProvider } from '../../providers/rest/rest';

/**
 * Generated class for the DashboardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-customerservice',
  templateUrl: 'customerservice.html',
})
export class CustomerServicePage {
    ServiceTab:any;
    buildcount = {} as any;
    insertedValues: any;
     user :any =  localStorage.getItem('userData');
      constructor(public navCtrl: NavController, public navParams: NavParams,
          public authService:RestProvider, public toastCtrl:ToastController,private modal: ModalController,
          public loadingCtrl: LoadingController, public view: ViewController) {
            this.ServiceTab = "Service Charges";
              this.user = this.user ? JSON.parse(this.user) : {};               
      }

      presentToast(msg) {
        let toast = this.toastCtrl.create({
          message: msg,
          duration: 2000,
          position:'middle'
        });
        toast.present();
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

      goBack(){
        this.navCtrl.setRoot(DashboardPage);
      }

      propertyDetails(){
        let myTitle = 'Customer Service';
        this.presentLoadingDefault(true);
        this.authService.getData({},'customer/BuildList').then((result) => {
          this.buildcount = result;
          this.presentLoadingDefault(false);
          if(this.buildcount){
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
  ionViewDidLoad() {
    this.propertyDetails();
  }

  openModal(PROPERTY_NAME:any,type:any) {
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let  myModalData = [{
        PROPERTY_NAME: PROPERTY_NAME,
        TYPE :type
    }];

    let myModal: Modal = this.modal.create('CustomerServiceUnitPage', { data: myModalData }, myModalOptions);

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
