import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, Modal, ModalController, ModalOptions, ViewController } from 'ionic-angular';
import { DashboardPage } from '../dashboard/dashboard';
import { RestProvider } from '../../providers/rest/rest';
import * as moment from 'moment';


@IonicPage()
@Component({
  selector: 'page-returncheque',
  templateUrl: 'returncheque.html',
})

export class ReturnChequePage {

  rtnchequedetails = this.navParams.get('data');
  returnchequedetailsall: any;
  returnchequeSearch: any;
  insertedValues: any;
  searchData = { "search_value": "" };
  ID: any;
  lbldateextenddate: any;
  extendeddate_val: any;
  redeposite_reason_val: any;
  redeposite_mindate: any;
  redeposite_maxdate: any;
  Isextend = 0;
  redepositedisables = 'false';
  redeposite_modal = 'none';
  return_chq_list = 'block';
  return_chq_search = 'none';
  color_display = '';
  bk_color_display = 'white';
  user: any = localStorage.getItem('userData');
  showescalateddays = 0;
  ImageList: any;


  constructor(public navCtrl: NavController, public navParams: NavParams,
    public authService: RestProvider, public toastCtrl: ToastController, private modal: ModalController,
    public loadingCtrl: LoadingController, public view: ViewController) {
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


  ionViewDidLoad() {

    if (this.rtnchequedetails[0].type == 'ESCLATION TO MGR' || this.rtnchequedetails[0].type == 'ESCLATION TO CEO' || this.rtnchequedetails[0].type == 'ESCLATION TO CEO PPR') {
      this.color_display = 'red';
      this.showescalateddays = 1;
    }

    this.return_chq_list = 'block';
    this.return_chq_search = 'none';
    this.returndetails();

  }

  returndetails() {
    let paramdata = {
      type: this.rtnchequedetails[0].type
    };
    this.presentLoadingDefault(true);
    this.authService.postData(paramdata, 'returncheque/ReturnChequeByStatus').then((result) => {
      this.returnchequedetailsall = result;
      this.returnchequeSearch = result;

      if (this.rtnchequedetails[0].SearchData != '' && this.rtnchequedetails[0].SearchData != undefined) {
        this.searchData.search_value = this.rtnchequedetails[0].SearchData;
        this.SearchReturnchequeDetail();
      }

      this.presentLoadingDefault(false);


    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });
  }

  openModal(CASH_RECEIPT_ID: any, ESCLATED_COUNT: any, RETURN_CHQ: any) {

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let myModalData = [{
      CASH_RECEIPT_ID: CASH_RECEIPT_ID,
      ESCLATED_COUNT: ESCLATED_COUNT,
      RETURN_CHQ: RETURN_CHQ
    }];

    let myModal: Modal = this.modal.create('ReturnCommentPage', { data: myModalData }, myModalOptions);

    myModal.present();

    myModal.onDidDismiss((data) => {

    });

    myModal.onWillDismiss((data) => {

    });

  }
  closeModal() {
    this.view.dismiss();
  }
  cancelreturncheque(CASH_RECEIPT_ID: any) {
    this.presentLoadingDefault(true);
    let canceldata = {
      CASH_RECEIPT_ID: CASH_RECEIPT_ID
    };
    this.authService.postData(canceldata, 'returncheque/CancelReturnCheque').then((result) => {
      this.presentLoadingDefault(false);
      this.presentToast("successfully Return Cheque Cancelled!!!");
      this.insertedValues = result;
      this.returndetails();
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });
  }

  redepositemodal(CASH_RECEIPT_ID: any) {
    this.ID = CASH_RECEIPT_ID;
    let redepositedetails = this.returnchequedetailsall[0].rtnchequedetailsdata.filter(item => item.ID == CASH_RECEIPT_ID);
    let extendcount = redepositedetails[0].EXDEND_DATE;
    let redepositedate = redepositedetails[0].RE_DEPOSITE_DATE;
    let returndate = moment(redepositedetails[0].RETURN_DT);
    let chqno = redepositedetails[0].CHQNO;
    let intermstatus = redepositedetails[0].STATUS_NAME;

    let datecount = moment().diff(returndate, 'days');
    if (datecount <= 21) {
      this.Isextend = 0;
      let datecount2 = datecount + 21;
      this.lbldateextenddate = "Re-Deposite Details, For Cheque No :" + chqno + ", Current cheque Status : " + intermstatus;
      if (redepositedate > 0) {
        this.extendeddate_val = moment(returndate).add(redepositedate, 'days');
        this.redeposite_reason_val = redepositedetails[0].RE_DEPOSITE_REASON;
        if (redepositedetails[0].RE_DEPOSITE_BY > 0) {
          this.redepositedisables = 'true';
        }
      } else {
        this.redeposite_maxdate = moment(returndate).add(datecount2, 'days').format("YYYY-MM-DD");
        this.redeposite_mindate = moment().format("YYYY-MM-DD");
        this.redepositedisables = 'false';
        this.redeposite_reason_val = '';
      }
    } else if (extendcount > 0) {
      this.Isextend = 0;
      let datecount2 = datecount + 21;
      this.lbldateextenddate = "Re-Deposite Details, For Cheque No :" + chqno + ", Current cheque Status : " + intermstatus;
      if (redepositedate > 0) {
        this.extendeddate_val = moment(returndate).add(redepositedate + 1, 'days');
        this.redeposite_reason_val = redepositedetails[0].RE_DEPOSITE_REASON;
        if (redepositedetails[0].RE_DEPOSITE_BY > 0) {
          this.redepositedisables = 'true';
        }
      } else {
        this.redeposite_maxdate = moment(returndate).add(datecount2, 'days').format("YYYY-MM-DD");
        this.redeposite_mindate = moment().format("YYYY-MM-DD");
        this.redepositedisables = 'false';
        this.redeposite_reason_val = '';
      }
    }
    this.redeposite_modal = 'block';
  }


  onCloseredeposite_modal() {
    this.redeposite_modal = 'none';
  }

  updateRedeposite_Status(redeposite_date: any, redeposite_reason: any) {
    let policecase = {
      casedetails: this.returnchequedetailsall[0].rtnchequedetailsdata.filter(item => item.ID == this.ID),
      redeposite_date: redeposite_date,
      redeposite_reason: redeposite_reason,
      IsExtend: this.Isextend,
      userId: this.user.UserInfoId,
      userempId: this.user.UserEmployeeId,
      username: this.user.Surname
    }


    this.presentLoadingDefault(true);
    this.authService.postData(policecase, 'returncheque/UpdateRedepositeStatus').then((result) => {
      this.presentLoadingDefault(false);
      this.presentToast("successfully Redeposite Status Updated!!!");
      this.insertedValues = result;
      this.returndetails();
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });
  }
  openAttachment(CASE_REQUEST_ID: any) {
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let myModalData = [{
      CASE_REQUEST_ID: CASE_REQUEST_ID
    }];

    let myModal: Modal = this.modal.create('ReturnchequeattachementPage', { data: myModalData }, myModalOptions);

    myModal.present();


    myModal.onWillDismiss(() => {
      this.ionViewDidLoad();
    });
  }

  SearchrtchequeDetail() {
    let cheque_no = this.searchData.search_value;
    if (cheque_no != '') {
      this.returnchequeSearch = this.returnchequedetailsall.filter(item => (item.CHQNO ? item.CHQNO.includes(cheque_no) : '') || (item.ATTRIBUTE4 ? item.ATTRIBUTE4.includes(cheque_no) : '') || (item.CUSTOMER_NAME ? item.CUSTOMER_NAME.includes(cheque_no) : ''));
      this.return_chq_list = 'block';
      this.redeposite_modal = 'none';
      this.return_chq_search = 'block';
    } else {
      this.returnchequeSearch = this.returnchequedetailsall;
    }
  }

  SearchReturnchequeDetail() {
    let case_val = this.searchData.search_value;
    if (case_val != '') {
      let filterData = this.returnchequedetailsall.filter(item => this.filter(item));
      this.returnchequeSearch = filterData;

    } else {
      this.returnchequeSearch = this.returnchequedetailsall
    }
    console.log(this.returnchequeSearch);
  }

  filter(item) {
    let _val = this.searchData.search_value;
    let _case_val = item['CHQNO'] ? item['CHQNO'].toString() : '';
    let _lease_val = item['CUSTOMER'] ? item['CUSTOMER'].toString() : '';
    let _cno_val = item['UNIT'] ? item['UNIT'].toString() : '';
    let _cus_val = item['ATTRIBUTE4'] ? item['ATTRIBUTE4'].toString() : '';
    return (_case_val.includes(_val) || _lease_val.includes(_val) || _cno_val.includes(_val) || _cus_val.includes(_val));
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
          page_name: 'Return Cheque'
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
    } else {
      loading.dismissAll();
      loading = null
    }
  }

}
