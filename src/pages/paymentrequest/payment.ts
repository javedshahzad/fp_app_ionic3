import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, Modal, ModalController, ModalOptions, ViewController } from 'ionic-angular';
import { DashboardPage } from '../dashboard/dashboard';
import { RestProvider } from '../../providers/rest/rest';

@IonicPage()
@Component({
  selector: 'page-payment',
  templateUrl: 'payment.html',
})
export class PaymentPage {
 
  term: string = "";
  paymentdetailsall = this.navParams.get('data');
  searchpaymentdetails = this.navParams.get('data');
  searchList = this.searchpaymentdetails[0].paymentrequestdata;
  insertedValues: any;
  searchData = { "search_value": "" };
  user: any = localStorage.getItem('userData');
  ImageList: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public authService: RestProvider, public toastCtrl: ToastController, private modal: ModalController,
    public loadingCtrl: LoadingController, public view: ViewController
  ) {
    this.user = this.user ? JSON.parse(this.user) : {};
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

  getPaymentRequestType(requestTypeId) {
    switch (requestTypeId) {
      case 1: {
        return 'Defender';
      }
      case 2: {
        return 'Plaintiff';
      }
      default: {
        return '';
      }
    }

  }

  paymentdetails() {
    this.presentLoadingDefault(true);
    this.authService.getData({}, 'payment/PaymentList').then((result) => {
      this.searchpaymentdetails = result;
      this.presentLoadingDefault(false);
      let type = this.searchpaymentdetails[0].type;
      if (type == "Pendnig MGR Approval") {
        this.paymentdetailsall[0].paymentrequestdata = this.searchpaymentdetails.pendingmgrdata;
      } else if (type == "Pendnig Leasing MGR Approval") {
        this.paymentdetailsall[0].paymentrequestdata = this.searchpaymentdetails.pendingleasmgrdata;
      } else if (type == "Pending CEO Approval") {
        this.paymentdetailsall[0].paymentrequestdata = this.searchpaymentdetails.pendingceodata;
      } else if (type == "Panding For Finance") {
        this.paymentdetailsall[0].paymentrequestdata = this.searchpaymentdetails.pendingfinancedata;
      } else if (type == "Waiting For Legal To Acknowledge") {
        this.paymentdetailsall[0].paymentrequestdata = this.searchpaymentdetails.paiddata;
      } else if (type == "Waiting For Bill Submission") {
        this.paymentdetailsall[0].paymentrequestdata = this.searchpaymentdetails.billsubmissiondata;
      } else if (type == "Waiting For Finance Acknowledgement") {
        this.paymentdetailsall[0].paymentrequestdata = this.searchpaymentdetails.waitforfinancedata;
      } else if (type == "Waiting For FInance MGR Acknowledgement") {
        this.paymentdetailsall[0].paymentrequestdata = this.searchpaymentdetails.waitforfinancemgrdata;
      } else if (type == "All Payment Request") {
        this.paymentdetailsall[0].paymentrequestdata = this.searchpaymentdetails.all;
      } else if (type == "Payment Request Cash more than 7 days with Legal") {
        this.paymentdetailsall[0].paymentrequestdata = this.searchpaymentdetails.paymentRequestCash_7daysdata;
      } else if (type == "Escalation to CEO") {
        this.paymentdetailsall[0].paymentrequestdata = this.searchpaymentdetails.escalation_to_ceo;
      }

    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });
  }

  ionViewDidLoad() {
    //this.paymentdetails();
  }

  openModal(CASE_REQUEST_ID: any) {

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let myModalData = [{
      CASE_REQUEST_ID: CASE_REQUEST_ID
    }];

    let myModal: Modal = this.modal.create('PaymentRequestCreatePage', { data: myModalData }, myModalOptions);

    myModal.present();

    myModal.onDidDismiss((data) => {
    });

    myModal.onWillDismiss((data) => {
    });

  }

  openDetailModal(CASE_REQUEST_ID: any, CASE_REQUEST: any) {
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };
    let myModalData = [{
      CASE_REQUEST_ID: CASE_REQUEST_ID,
      CASE_REQUEST: CASE_REQUEST,
      LABEL_TYPE: ''
    }];

    let myModal: Modal = this.modal.create('PaymentDetailPage', { data: myModalData }, myModalOptions);

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

  SearchpaymentDetail() {
    let case_val = this.searchData.search_value;
    if (case_val != '') {

      this.paymentdetailsall[0].paymentrequestdata = this.searchList.filter(item => {
        let _val = item['CLIENT_DESCRIPTION'] ? item['CLIENT_DESCRIPTION'].toString().toUpperCase() : '';
        let _val2 = item['REQUEST_TYPE_DESCRIPTION'] ? item['REQUEST_TYPE_DESCRIPTION'].toString().toUpperCase() : '';
        let _val3 = item['CASE_REQUEST_ID'] ? item['CASE_REQUEST_ID'].toString() : '';
        return (_val.includes(case_val.toUpperCase()) || _val2.includes(case_val.toUpperCase()) || _val3.includes(case_val.toUpperCase()))
      });

      //(item.CLIENT_DESCRIPTION.toString().toUpperCase() ? desc.includes(case_val):'') || (item.REQUEST_TYPE_DESCRIPTION.toUpperCase() ? item.REQUEST_TYPE_DESCRIPTION.toUpperCase().includes(case_val):'') || (String(item.CASE_REQUEST_ID).includes(case_val)));
    } else {
      this.paymentdetailsall[0].paymentrequestdata = this.searchList;
    }
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

  openAttachment(CASE_REQUEST_ID: any) {
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let myModalData = [{
      CASE_REQUEST_ID: CASE_REQUEST_ID
    }];

    let myModal: Modal = this.modal.create('CaseFileUploadsPage', { data: myModalData }, myModalOptions);

    myModal.present();

    myModal.onWillDismiss(() => {
      this.paymentdetails();
    });
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
          page_name: 'Payment'
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
