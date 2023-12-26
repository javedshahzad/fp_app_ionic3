import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, Modal, ModalController, ModalOptions, ViewController } from 'ionic-angular';
import { DashboardPage } from '../dashboard/dashboard';
import { RestProvider } from '../../providers/rest/rest';


@IonicPage()
@Component({
  selector: 'page-casemanagement',
  templateUrl: 'casemanagement.html',
})
  
export class CasemanagementPage {

  caseManagementDetails = [] as any;
  casesearchdetails: any;
  insertedValues: any;
  searchData = { "search_value": "" };
  user: any = localStorage.getItem('userData');
  modelData = this.navParams.get('data');
  showescalateddays = 0;
  ImageList:any;

  constructor(
    public navCtrl: NavController, public navParams: NavParams,
    public authService: RestProvider, public toastCtrl: ToastController, private modal: ModalController,
    public loadingCtrl: LoadingController, public view: ViewController
  ){
      this.user = this.user ? JSON.parse(this.user) : {};
  }


  ngOnInit() {    
    if(this.modelData.Type == 'ESCALATIONTOCEO'){
        this.showescalateddays = 1;
    }
    this.casedetails();
  }

  closeModal() {
    this.view.dismiss();
  }

  casedetails() {

    let data = {
        UserInfoId: this.user.UserInfoId,
        type: this.modelData.Type
    }
 
    this.presentLoadingDefault(true);
    this.authService.postData(data, 'case_management/CaseManagementList/').then((result) => {
      this.caseManagementDetails = result;
      this.casesearchdetails = result;
      if (this.modelData.SearchData != '' && this.modelData.SearchData != undefined) {
        this.searchData.search_value = this.modelData.SearchData;
        this.SearchrtcaseDetail();
      }

      this.presentLoadingDefault(false);
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });
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

  openModal(CASE_REQUEST_ID: any, CASE: any) {

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let myModalData = [{
      CASE_REQ_ID: CASE_REQUEST_ID,
      CASE_ID: CASE.CASE_ID,
      CASE: CASE
    }];

    let myModal: Modal = this.modal.create('CaseModalPage', { data: myModalData }, myModalOptions);

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

  resetForm() {
      this.navCtrl.setRoot(this.navCtrl.getActive().component);
  }

  ionViewDidLoad() {
      console.log('ionViewDidLoad CasemanagementPage');
  }

  openModalCaseUpload(CASE_REQUEST_ID: any, CASE_ID: any) {
    
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let myModalData = [{
      CASE_REQUEST_ID: CASE_REQUEST_ID,
      CASE_ID: CASE_ID
    }];

    let myModal: Modal = this.modal.create('CaseFileUploadsPage', { data: myModalData }, myModalOptions);

    myModal.present();

    myModal.onDidDismiss((data) => {
    });

    myModal.onWillDismiss((data) => {
    });

  }

  openpaymentDetailModal(CASE_REQUEST_ID:any,CASE_REQUEST:any){

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let  myModalData = [{
      CASE_REQUEST_ID: CASE_REQUEST_ID,
      CASE_REQUEST:CASE_REQUEST
    }];

    let myModal: Modal = this.modal.create('PaymentDetailPage', { data: myModalData }, myModalOptions);

    myModal.present();

    myModal.onDidDismiss((data) => {
    });

    myModal.onWillDismiss((data) => {
    });

  }

  SearchrtcaseDetail() {
    let case_val = this.searchData.search_value;
    if (case_val != '') {
      let filterData = this.caseManagementDetails.filter(item => this.filter(item));
      //  (!item.CASE_REQUEST_ID  && item.CASE_REQUEST_ID.includes(case_val)));
      this.casesearchdetails = filterData;
      //  || ((!item.LEASE_NO || typeof item.LEASE_NO === "string") && item.LEASE_NO.includes(case_val))
      let case_first_name_search = this.caseManagementDetails.filter((item) => {
        let _val = item['FIRST_PARTY'] ? item['FIRST_PARTY'].toString().toUpperCase() : '';
        return _val.includes(case_val.toUpperCase())
      });
      for (var i = 0; i < case_first_name_search.length; i++) {
        this.casesearchdetails.push(case_first_name_search[i]);
      }
    } else {
      this.casesearchdetails = this.caseManagementDetails
    }
    console.log(this.casesearchdetails);
  }

  filter(item) {
    let _val = this.searchData.search_value;
    let _case_val = item['CASE_REQUEST_ID'] ? item['CASE_REQUEST_ID'].toString() : '';
    let _lease_val = item['LEASE_NO'] ? item['LEASE_NO'].toString() : '';
    let _cno_val = item['CASE_NO'] ? item['CASE_NO'].toString() : '';
    return (_case_val.includes(_val) || _lease_val.includes(_val) || _cno_val.includes(_val));
  }

  
  Getallimagelist(CASE_REQUEST_ID: any, count: any) {
    if (count > 0) {
      this.presentLoadingDefault(true);
      this.authService.getData({}, 'payment/GetLegalPaymentImagelist/' + CASE_REQUEST_ID + '').then((result) => {
        this.presentLoadingDefault(false);
        this.ImageList = result;
        const myModalOptions: ModalOptions = {
          enableBackdropDismiss: false
        };
        const myModalData = [{
          ImageList: this.ImageList,
          page_name: 'Case Management'
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
