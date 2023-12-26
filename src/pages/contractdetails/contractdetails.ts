import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, Modal, ModalController, ModalOptions, ViewController } from 'ionic-angular';
import { DashboardPage } from '../dashboard/dashboard';
import { RestProvider } from '../../providers/rest/rest';


@IonicPage()
@Component({
  selector: 'page-contractdetails',
  templateUrl: 'contractdetails.html',
})
export class ContractDetailsPage {

  searchdocumenttrackingdetails: any;
  documenttrackingdetails: any;

  insertedValues: any;
  resourcedetails: any = localStorage.getItem('resourseData');
  old_status: any;
  new_status: any;
  PAYMENT_REQ_ID: any;
  paymentbilldetailsall: any;
  comment_modal = 'none';
  Bill_comment_modal = 'none';
  new_bill_status: any;
  PAYMENT_REQUEST_BILL_ID: any;
  COMMENTS: any
  CASE_REQUEST_Item: any;
  CASE_REQUEST: any;
  btnTxtApprove: any = "Approve";
  btnTxtReject: any = "Reject";
  btnTxtSave: any = "Save";
  payment_approvetxt = '';
  user: any = localStorage.getItem('userData');
  Data = this.navParams.get('data');

  searchData = { "search_value": "" };

  lpoManagerList: any;
  mlist: any;

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

  documentTrackingdetails() {
    let Data = this.navParams.get('data');
    let params = {
      user_info_id: this.user.UserInfoId,
      resource_type_id: this.resourcedetails.TYPE_ID,
      resource_type_user: this.resourcedetails.TYPE_USER,
      resource_id: this.resourcedetails.RESOURCE_ID,
      type: Data[0].type
    };

    this.presentLoadingDefault(true);
    this.authService.postData(params, 'contract/getContractList').then((result) => {

      this.searchdocumenttrackingdetails = result;

      if (this.searchdocumenttrackingdetails.length > 0) {
        this.customerContract = this.searchdocumenttrackingdetails.filter(x=>  x.CONTRACT_SUPPLIER == 0);
        this.customerContractCount = this.customerContract.length;
        this.supplierContract = this.searchdocumenttrackingdetails.filter(x=> x.CONTRACTCUSTOMER  == 0);
        this.supplierContractCount = this.supplierContract.length;
        this.presentLoadingDefault(false);
      } else {
        this.presentLoadingDefault(false);
        this.presentToast('No Records to show');
      }

    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });
  }


  getLpoManagerList() {
    let params = {
      user_info_id: this.user.UserInfoId
    };

    this.authService.postData(params, 'payment/getLpoManagerList').then((result) => {
      this.lpoManagerList = result;
      console.log(this.lpoManagerList);

    }, (err) => {
      this.presentToast(err);
    });
  }

  ionViewDidLoad() {
    this.documentTrackingdetails();
  }

  openModal(PAYMENT_REQUEST_ID: any, PAYMENT_DETAIL: any) {
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };
    let myModalData = [{
      PAYMENT_REQUEST_ID: PAYMENT_REQUEST_ID,
      PAYMENT_DETAIL: PAYMENT_DETAIL
    }];

    let myModal: Modal = this.modal.create('FinancePaymentCommentPage', { data: myModalData }, myModalOptions);

    myModal.present();


    myModal.onWillDismiss(() => {
      this.ionViewDidLoad();
    });

  }

  getresource() {
    this.authService.getData({}, 'cheque/ResourceList/' + this.user.UserEmployeeId).then((result) => {
      this.resourcedetails = result;
      if (this.resourcedetails.length > 0) {
        console.log("Data Found In Resource Master");
      } else {
        console.log("Data Not Found In Resource Master");
      }
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });
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


  onCloseBill_comment_modal() {
    this.Bill_comment_modal = 'none';
  }

  onClosecomment_modal() {
    this.comment_modal = 'none';
  }

  openAttachment(CONTRACTID: any) {

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let myModalData = [{
      CONTRACTID: CONTRACTID
    }];

    let myModal: Modal = this.modal.create('ContractAttachmentPage', { data: myModalData }, myModalOptions);

    myModal.present();


    myModal.onWillDismiss(() => {
      this.ionViewDidLoad();
    });

  }

  SearchrtcaseDetail() {
    let case_val = this.searchData.search_value;
    if (case_val != '') {
      let filterData = this.searchdocumenttrackingdetails.filter(item => this.filter(item));
      this.supplierContract = filterData;
    } else {
      this.supplierContract = this.searchdocumenttrackingdetails.filter(x=> x.CONTRACTCUSTOMER  == 0);
    }
    console.log(this.supplierContract);
  }

  filter(item) {
    let _val = this.searchData.search_value;
    let _case_val = item['BUILDING_NAME'] ? item['BUILDING_NAME'].toString().toUpperCase() : '';
    let _lease_val = item['SUPPLIER_NAME'] ? item['SUPPLIER_NAME'].toString().toUpperCase() : '';
    let _cno_val = item['CONTRACTID'] ? item['CONTRACTID'].toString().toUpperCase() : '';
    return (_case_val.includes(_val.toUpperCase()) || _lease_val.includes(_val.toUpperCase()) || _cno_val.includes(_val.toUpperCase()));
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
