import { Component } from '@angular/core';
import { IonicPage, Platform, NavController, NavParams, ToastController, LoadingController, Modal, ModalController, ModalOptions, ViewController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RestProvider } from '../../providers/rest/rest';

import { FileOpener } from '@ionic-native/file-opener';
import { File } from '@ionic-native/file';
import { Constant } from '../../providers/constant/constant';

@IonicPage()
@Component({
  selector: 'page-paymentcaseattachment',
  templateUrl: 'paymentcaseattachment.html',
})
 
export class PaymentCaseAttachmentModalPage {

  casecommentsdetails: any;
  pushnotificationValues: any;
  casecommentsForm: FormGroup
  insertedValues: any;
  casemodaldata: any = this.navParams.get('data');
  Case: any;
  user: any = localStorage.getItem('userData');

  caseuploadsdetails:any;
  
  downloadUrl:any;

  allattachment: any;
  userattachment: any;
  systemattachment: any;

  pet: string = "User";
  tab_name: any;

  constructor(
    public platform: Platform, public navCtrl: NavController, public navParams: NavParams,
    private formBuilder: FormBuilder, public authService: RestProvider,
    public toastCtrl: ToastController, public loadingCtrl: LoadingController,
    public view: ViewController, private file: File, private fileOpener: FileOpener,public constant:Constant,
    private modal: ModalController
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

  ionViewWillLoad() {

    this.pet = "User";
    const Data = this.navParams.get('data');

    let params = {} as any;
    params.CASE_REQUEST_ID = Data[0].CASE_REQUEST_ID;
    params.PAYMENT_REQUEST_ID = Data[0].PAYMENT_REQUEST_ID;
    params.PAYMENT_REQ_BILL_ID = Data[0].PAYMENT_REQ_BILL_ID;
    params.PAYMENT_NUMBER = Data[0].PAYMENT_NUMBER;

    console.log(params);
    this.presentLoadingDefault(true);
    this.authService.postData(params, 'case_management/getAllCasePaymentAttachment').then((result) => {
      this.casecommentsdetails = result;
      this.allattachment = result;
      this.userattachment = this.casecommentsdetails.filter(x => x.CREATED_BY != 'ADMIN');
      this.systemattachment = this.casecommentsdetails.filter(x => x.CREATED_BY == 'ADMIN');

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

  downloadFileData(ID: any, ATTACHMENT_TYPE: any) {

    let params = {} as any;
    params.ID  = ID;
    params.ATTACHMENT_TYPE = ATTACHMENT_TYPE;

    console.log(params);

    this.presentLoadingDefault(true);
    this.authService.postData(params, 'case_management/getAllCasePaymentAttachmentById').then((result) => {
      this.caseuploadsdetails = result;
      console.log(this.caseuploadsdetails);
      let file_name = this.caseuploadsdetails[0].FILE_NAME;
      let nameSplit = file_name.split('.');
      let extn = nameSplit[nameSplit.length - 1];
      this.downloadUrl = new Blob([new Uint8Array(this.caseuploadsdetails[0].FILE_CONTENT.data)]);
      let content_type = this.constant.fileTypes.filter(ext => ext.name == extn.toUpperCase())
      this.saveAndOpenPdf(this.downloadUrl,file_name,content_type[0]);

      this.presentLoadingDefault(false);
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });

  }

  saveAndOpenPdf(pdf: any, filename: any,content_type:any) {
    const writeDirectory = this.platform.is('ios') ? this.file.dataDirectory : this.file.externalDataDirectory;
    this.file.writeFile(writeDirectory, filename, pdf, {replace: true})
      .then(() => {
          this.fileOpener.open(writeDirectory + filename, content_type.type)
              .catch(() => {
                  console.log('Error opening pdf file');
              });
      })
      .catch((err) => {
          console.log(err);
          console.error('Error writing pdf file');
      });
  }

  openAttachment() {

    const Data = this.navParams.get('data');
    console.log(Data);

    const myModalOptions: ModalOptions = {
        enableBackdropDismiss: false
    };

    let myModalData = [{
        PAYMENT_REQUEST_ID: Data[0].PAYMENT_REQUEST_ID,
        PAYMENT_REQ_BILL_ID: Data[0].PAYMENT_REQ_BILL_ID
    }];

    let myModal: Modal = this.modal.create('PaymentAttachmentPage', { data: myModalData }, myModalOptions);

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