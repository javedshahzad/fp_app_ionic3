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
  selector: 'page-securitydepositunit',
  templateUrl: 'securitydepositunit.html',
})
export class SecurityDepositUnitPage {
    securitybuild: any;
    insertedValues: any;
     user :any =  localStorage.getItem('userData');
      constructor(public navCtrl: NavController, public navParams: NavParams,
          public authService:RestProvider, public toastCtrl:ToastController,private modal: ModalController,
          public loadingCtrl: LoadingController, public view: ViewController) {
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
        this.presentLoadingDefault(true);
        this.authService.getData({},'security/SecurityDepositPropertyList').then((result) => {
          this.securitybuild = result;
          this.presentLoadingDefault(false);
          if(this.securitybuild.length>0){
            this.presentLoadingDefault(false);
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
  ionViewDidLoad() {
    this.propertyDetails();
  }

  openModal(PROPERTY_NAME:any) {
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: true
    };

    let  myModalData = [{
        PROPERTY_NAME: PROPERTY_NAME
    }];

    let myModal: Modal = this.modal.create('SecurityBuildPage', { data: myModalData }, myModalOptions);

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
