import { Component } from '@angular/core';
import { IonicPage, Platform, NavController, NavParams, ToastController, LoadingController, Modal, ModalController, ModalOptions, ViewController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RestProvider } from '../../providers/rest/rest';

@IonicPage()
@Component({
  selector: 'page-paymentcasecomments',
  templateUrl: 'paymentcasecomments.html',
})
 
export class PaymentCaseCommentsModalPage {
  casecommentsdetails: any;
  pushnotificationValues: any;
  casecommentsForm: FormGroup
  insertedValues: any;
  casemodaldata: any = this.navParams.get('data');
  Case: any;
  user: any = localStorage.getItem('userData');


  allcomments: any;
  usercomments: any;
  systemcomments: any;

  pet: string = "User";
  tab_name: any;

  constructor(public platform: Platform, public navCtrl: NavController, public navParams: NavParams, 
    private formBuilder: FormBuilder, public authService: RestProvider, public toastCtrl: ToastController,
    public loadingCtrl: LoadingController, public view: ViewController, private modal: ModalController
    ) {
    this.user = this.user ? JSON.parse(this.user) : {};
    this.casecommentsForm = this.formBuilder.group({
      COMMENTS: ['', Validators.compose([Validators.required])],
      CASE_ID: ['', Validators.compose([Validators.required])],
      CASE_REQ_ID: ['', Validators.compose([Validators.required])]
    });
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

  insertCaseComments() {
    
    let resourseData: any = localStorage.getItem('resourseData');
    resourseData = JSON.parse(resourseData);
    let casecommentsData = this.casecommentsForm.value;
    casecommentsData.user_name = this.user.Surname;
    casecommentsData.Ctype = 0;
    casecommentsData.userid = this.user.UserInfoId;
    casecommentsData.user_emp_id = this.user.UserEmployeeId;
    casecommentsData.Case = JSON.stringify(this.Case);
    casecommentsData.ResourseId = resourseData.RESOURCE_ID;

    this.presentLoadingDefault(true);
    this.authService.postData(casecommentsData, 'case_management/CaseCommentsinsert').then((result) => {
      this.presentLoadingDefault(false);
      this.presentToast("Comments successfully saved");
      this.insertedValues = result;
      this.closeModal();

    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });
  }


  ionViewWillLoad() {

    this.pet = "User";
    const Data = this.navParams.get('data');

    let params = {} as any;
    params.CASE_ID = Data[0].CASE_ID;
    params.PAYMENT_REQUEST_ID = Data[0].PAYMENT_REQUEST_ID;
    params.PAYMENT_REQ_BILL_ID = Data[0].PAYMENT_REQ_BILL_ID;
    params.PAYMENT_NUMBER = Data[0].PAYMENT_NUMBER

    console.log(params);
    this.presentLoadingDefault(true);
    this.authService.postData(params, 'case_management/getAllCasePaymentComments').then((result) => {
      this.casecommentsdetails = result;
      this.allcomments = result;
      this.usercomments = this.casecommentsdetails.filter(x => x.USER_SURNAME != 'ADMIN');
      this.systemcomments = this.casecommentsdetails.filter(x => x.USER_SURNAME == 'ADMIN');

      console.log(this.casecommentsdetails);

      this.presentLoadingDefault(false);

      if (this.casecommentsdetails.length > 0) {
        this.presentLoadingDefault(false);
      } else {
        this.presentLoadingDefault(false);
      }

    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });

  }

  resetForm() {
    this.navCtrl.setRoot(this.navCtrl.getActive().component);
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'middle'
    });
    toast.present();
  }
  closeModal() {
    this.view.dismiss();
  }

  showBtn = -1;
  isOpen = false;
  oldBtn = -1;
  showUndoBtn(index) {
    if (this.isOpen == false) {
      this.isOpen = true;
      this.oldBtn = index;
      this.showBtn = index;
    } else {
      if (this.oldBtn == index) {
        this.isOpen = false;
        this.showBtn = -1;
        this.oldBtn = -1;
      } else {
        this.showBtn = index;
        this.oldBtn = index;
      }
    }
  }

  segmentChanged(event) {
    console.log(event.value);
    let tabValue = event.value;
    this.tab_name = event.value;
    if (tabValue == 'All') {
    } else if (tabValue == 'User') {
    } else if (tabValue == 'System') {
    }
  }

  createComments() {

    const Data = this.navParams.get('data');

    console.log(Data);

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };
    let myModalData = [{
      PAYMENT_REQUEST_ID: Data[0].PAYMENT_REQUEST_ID,
      type: Data[0].TYPE,
      PAYMENT_REQ_BILL_ID: 0,
      PAYMENT_DETAIL: Data[0].PAYMENT_DETAIL
    }];
    let myModal: Modal = this.modal.create('PaymentModalPage', { data: myModalData }, myModalOptions);

    myModal.present();


    myModal.onWillDismiss(() => {
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