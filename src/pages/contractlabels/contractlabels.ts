import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, Modal, ModalController, ModalOptions, ViewController } from 'ionic-angular';
import { DashboardPage } from '../dashboard/dashboard';
import { RestProvider } from '../../providers/rest/rest';

@IonicPage()
@Component({
  selector: 'page-contractlabels',
  templateUrl: 'contractlabels.html',
})
export class ContractLabelsPage {

  searchdocumenttrackingdetails: any;
  documenttrackingdetails: any;

  resourcedetails: any = localStorage.getItem('resourseData');
  user: any = localStorage.getItem('userData');
  Data = this.navParams.get('data');

  searchData = { "search_value": "" };

  customerContractCount:any;
  customerContract:any;
  supplierContractCount:any;
  supplierContract:any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public authService: RestProvider, public toastCtrl: ToastController, private modal: ModalController,
    public loadingCtrl: LoadingController, public view: ViewController) {
    this.user = this.user ? JSON.parse(this.user) : {};
    this.resourcedetails = this.resourcedetails ? JSON.parse(this.resourcedetails) : {};
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

  
  ionViewDidLoad() {
    this.documentTrackingdetails();
  }

  documentTrackingdetails() {
    let params = {
      user_info_id: this.user.UserInfoId,
      resource_type_id: this.resourcedetails.TYPE_ID,
      resource_type_user: this.resourcedetails.TYPE_USER,
      resource_id: this.resourcedetails.RESOURCE_ID
    };

    this.presentLoadingDefault(true);
    this.authService.postData(params, 'contract/getContractList').then((result) => {

    this.documenttrackingdetails = result;
    console.log(this.documenttrackingdetails);
    this.customerContract = this.documenttrackingdetails.filter(x=>  x.CONTRACT_SUPPLIER == 0);
    this.customerContractCount = this.customerContract.length;
    this.supplierContract = this.documenttrackingdetails.filter(x=> x.CONTRACTCUSTOMER  == 0);
    this.supplierContractCount = this.supplierContract.length;
    this.presentLoadingDefault(false);

    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });
  }
 

  openModal(type:any){

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let myModalData = [{
      type: type
    }];

    let myModal: Modal = this.modal.create('ContractDetailsPage', { data: myModalData }, myModalOptions);

    myModal.present();

    myModal.onWillDismiss(() => {
      this.ionViewDidLoad();
    });

  }

  openCustModal(type:any){

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let myModalData = [{
      type: type
    }];

    let myModal: Modal = this.modal.create('ContractCustomerDetailsPage', { data: myModalData }, myModalOptions);

    myModal.present();

    myModal.onWillDismiss(() => {
      this.ionViewDidLoad();
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
