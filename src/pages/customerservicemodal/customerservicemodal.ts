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
  selector: 'page-customerservicemodal',
  templateUrl: 'customerservicemodal.html',
})
export class CustomerServiceModalPage {
  PaidTab:any;
  service_and_demand_unitcount:any;
    service_and_demand_details :any;
    paidlist:any;
    unpaidlist:any;
    service_and_demand_list:any;
    myModalData :any;
    type:any;
    modaltype =this.navParams.get('data');
    user : any = localStorage.getItem('userData');
    constructor(public navCtrl: NavController, public navParams: NavParams,private modal: ModalController,
        public authService:RestProvider, public toastCtrl:ToastController,
        public loadingCtrl: LoadingController, public view: ViewController) {
          this.PaidTab = "Paid";
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
    if(Data[1]=="Service Charge"){
      this.getdata();
    }else if(Data[1]=="Demand Charge"){
      this.getdata();
    }
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
  getdata(){
    const Data = this.navParams.get('data');
    let propertydata = {
      PROPERTY_NAME:Data[0],
      BUILD_CODE:Data[2],
      TYPE:Data[1]
    };
   
    let myTitle = 'Unit List';
    this.presentLoadingDefault(true);
    this.authService.postData(propertydata,'customer/UnitList/').then((result) => {
      this.service_and_demand_unitcount = result;
      this.paidlist = this.service_and_demand_unitcount.filter(item=>item.AMOUNT ===0);
      this.unpaidlist = this.service_and_demand_unitcount.filter(item=>item.AMOUNT !=0);
      if(this.service_and_demand_unitcount.length > 0){
        this.getservice_and_demandlist();
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

  getservice_and_demandlist(){
    this.presentLoadingDefault(true);
    let myTitle = 'Service Details';
    this.authService.getData({},'customer/ServiceDetails/').then((result) => {
      this.service_and_demand_list = result;
      if(this.service_and_demand_list.length > 0){
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
  openModal(PROPERTY_NAME:any,BUILD_CODE:any,UNIT:any,type:any) {

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };
    if(type=="Service Charge PAID"){
      this.myModalData = [this.service_and_demand_list.filter(item=> (item.PROPERTY_NAME ===PROPERTY_NAME)&&(item.BUILD_CODE ===BUILD_CODE) && (item.UNIT ===UNIT) && (item.BALAMT ===0)),
        type
      ]
    }else if(type=="Service Charge UNPAID"){
      this.myModalData = [this.service_and_demand_list.filter(item=> (item.PROPERTY_NAME ===PROPERTY_NAME)&&(item.BUILD_CODE ===BUILD_CODE) && (item.UNIT ===UNIT)&& (item.BALAMT !=0)),type]
    }else if(type=="Demand Charge PAID"){
      this.myModalData =[this.service_and_demand_list.filter(item=> (item.PROPERTY_NAME ===PROPERTY_NAME)&&(item.BUILD_CODE ===BUILD_CODE) && (item.UNIT ===UNIT)&&(item.BALAMT ===0)),type]
    }else if(type=="Demand Charge UNPAID"){
      this.myModalData =[this.service_and_demand_list.filter(item=> (item.PROPERTY_NAME ===PROPERTY_NAME)&&(item.BUILD_CODE ===BUILD_CODE) && (item.UNIT ===UNIT)&& (item.BALAMT !=0)),type]
    }

    let myModal: Modal = this.modal.create('CustomerModalPage', { data: this.myModalData }, myModalOptions);

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