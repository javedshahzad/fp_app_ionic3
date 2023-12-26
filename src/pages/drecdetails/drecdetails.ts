import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, Modal, ModalController, ModalOptions, ViewController } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertController } from 'ionic-angular';
  
@IonicPage()
@Component({
  selector: 'page-drecdetails',
  templateUrl: 'drecdetails.html',
})
export class DrecDetailsPage {
  
  securitydepositdetails: any;
  user: any = localStorage.getItem('userData');
  resourse: any = JSON.parse(localStorage.getItem('resourseData'));
  ResourseList: any;
  LEASE_NO: any;
  rejectbtn_approvebtn_show = 'none';
  reject_cmt = 'none';
  approve_cmt = 'none';

  btnTxt: any = 'Save';
  RejectForm: FormGroup;
  ApproveForm: FormGroup;
  securitydepositlist:any;
  showescalateddays = 0;
  ImageList: any;
  drecDetailsall = {
    lnkchqnotcollectedlist: [] as any,
    lnkchqreceivednotHolist: [] as any,
    lnkhonotacknowledgedlist: [] as any,
    lnkchqreceivednotsubmittedlist: [] as any,
    lnkchqsubmitedtodeplist: [] as any,
    lnkbtnejariDetailsGetlist: [] as any,
    lnkchqsentformgrlist: [] as any,
    lnkchqrcvdfrommgrlist: [] as any,
    lnkchqcollectedpmgrlist: [] as any,
    lnkbtnEscalationCeoGetlist: [] as any,
    drecDetailsall: [] as any
} as any;

drecListall:any;


  constructor(public navCtrl: NavController, public navParams: NavParams,
    public authService: RestProvider, public toastCtrl: ToastController, private modal: ModalController,
    public loadingCtrl: LoadingController, public view: ViewController, private formBuilder: FormBuilder,
    public atrCtrl: AlertController) {
    this.user = this.user ? JSON.parse(this.user) : {};

    this.ResourseList = this.resourse;

    if (this.ResourseList.TYPE_USER === "CEO" || this.ResourseList.TYPE_USER === "COO") {
      this.rejectbtn_approvebtn_show = 'block';
    } else {
      this.rejectbtn_approvebtn_show = 'none';
    }

    this.RejectForm = this.formBuilder.group({
      LEASE_NO: ['', Validators.compose([Validators.required])],
      comments: ['', Validators.compose([Validators.required])]
    });

    this.ApproveForm = this.formBuilder.group({
      LEASE_NO: ['', Validators.compose([Validators.required])],
      comments: ['', Validators.compose([Validators.required])]
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

  ionViewDidLoad() {
    let Data = this.navParams.get('data');
    console.log(Data);

    if(Data[0].type == 'Escalation to CEO/COO'){
      this.showescalateddays = 1;
    }
    
    this.drecDetails();

  }


  drecDetails() {
    let myTitle = 'Drec';
    let Data = this.navParams.get('data');
    this.presentLoadingDefault(true);
    this.authService.getData({}, 'drec/DrecList').then((result) => {
        this.drecDetailsall = result;

        if (Data[0].type  == 'lnkchqnotcollectedlist'){
          this.drecListall = this.drecDetailsall.lnkchqnotcollectedlist
        }else if(Data[0].type  == 'lnkchqsentformgrlist'){
          this.drecListall = this.drecDetailsall.lnkchqsentformgrlist
        }else if(Data[0].type  == 'lnkchqrcvdfrommgrlist'){
          this.drecListall = this.drecDetailsall.lnkchqrcvdfrommgrlist
        }else if(Data[0].type  == 'lnkchqcollectedpmgrlist'){
          this.drecListall = this.drecDetailsall.lnkchqcollectedpmgrlist
        }else if(Data[0].type  == 'lnkchqreceivednotHolist'){
          this.drecListall = this.drecDetailsall.lnkchqreceivednotHolist
        }else if(Data[0].type  == 'lnkhonotacknowledgedlist'){
          this.drecListall = this.drecDetailsall.lnkhonotacknowledgedlist
        }else if(Data[0].type  == 'lnkchqreceivednotsubmittedlist'){
          this.drecListall = this.drecDetailsall.lnkchqreceivednotsubmittedlist
        }else if(Data[0].type  == 'lnkchqsubmitedtodeplist'){
          this.drecListall = this.drecDetailsall.lnkchqsubmitedtodeplist
        }else if(Data[0].type  == 'lnkbtnejariDetailsGetlist'){
          this.drecListall = this.drecDetailsall.lnkbtnejariDetailsGetlist
        }else if(Data[0].type  == 'Escalation to CEO/COO'){
          this.drecListall = this.drecDetailsall.lnkbtnEscalationCeoGetlist
        }

        console.log('Drec List All -->',this.drecDetailsall);
        this.presentLoadingDefault(false);

    }, (err) => {
        this.presentLoadingDefault(false);
        this.presentToast(err);
    });
}

  Rejectbtn(LEASE_NUMBER: any) {
    this.LEASE_NO = LEASE_NUMBER;
    this.reject_cmt = 'block';
  }

  Approvebtn(LEASE_NUMBER: any) {
    this.LEASE_NO = LEASE_NUMBER;
    this.approve_cmt = 'block';
  }

  openModal(LEASE_NUM: any,DREC:any) {
    const myModalOptions: ModalOptions = {
        enableBackdropDismiss: false
    };

    let myModalData = [{
        LEASE_NUM: LEASE_NUM,
        DREC:DREC
    }];

    let myModal: Modal = this.modal.create('DrecCommentsPage', { data: myModalData }, myModalOptions);

    myModal.present();

    myModal.onDidDismiss((data) => {
    });

    myModal.onWillDismiss((data) => {
    });
}

openModalAttachment(LEASE_NUM: any) {
  const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
  };

  let myModalData = [{
      LEASE_NUM: LEASE_NUM
  }];

  let myModal: Modal = this.modal.create('DrecAttachmentsPage', { data: myModalData }, myModalOptions);

  myModal.present();

  myModal.onDidDismiss((data) => {
  });

  myModal.onWillDismiss((data) => {
  });
}


// Confirm popup code
showConfirmAlert(LEASE_NUM: any,STATUS_ID: any,FILE_TYPE1:any,FILE_TYPE2:any,FILE_TYPE3:any,FILE_TYPE4:any) {
  var msg = '';
  var current_value = '';
  var previous_value = '';
  if(STATUS_ID == 1){
      msg = 'Click yes to DREC CHQ RCVD NOT HANDED OVER TO PRO';
      current_value = 'DREC CHQ RCVD NOT HANDED OVER TO PRO';
      previous_value = 'DREC CHQ NOT COLLECTED FROM CLIENT';
  }else if(STATUS_ID == 2){
      msg = 'Click yes to DREC CHQ HANDED OVER TO PRO BUT NOT ACKNOWLEDGD';
      current_value = 'DREC CHQ HANDED OVER TO PRO BUT NOT ACKNOWLEDGD';
      previous_value = 'DREC CHQ RCVD NOT HANDED OVER TO PRO';
  }else if(STATUS_ID == 3){
      msg = 'Click yes to DREC CHQ RECIVED BY PRO NOT YET SUBMITTED TO DREC DEPT';
      current_value = 'DREC CHQ RECIVED BY PRO NOT YET SUBMITTED TO DREC DEPT';
      previous_value = 'DREC CHQ HANDED OVER TO PRO BUT NOT ACKNOWLEDGD';
  }else if(STATUS_ID == 4){
      msg = 'Click yes to DREC CHQ SUBMITTED TO DEPARTMENT AND OBTAIN EJARI';
      current_value = 'DREC CHQ SUBMITTED TO DEPARTMENT AND OBTAIN EJARI';
      previous_value = 'DREC CHQ RECIVED BY PRO NOT YET SUBMITTED TO DREC DEPT';
  }

  let alertConfirm = this.atrCtrl.create({
      title: '',
      message: msg,
      buttons: [
          {
              text: 'Cancel',
              role: 'cancel',
              handler: () => {
                  console.log('No clicked');
              }
          },
          {
              text: 'Yes',
              handler: () => {
                  console.log('Yes clicked');
                                         
                  if(STATUS_ID == 1){
                      if(FILE_TYPE1 ==1  && FILE_TYPE2 ==1 && FILE_TYPE3 ==1 && FILE_TYPE4 ==1){                                                               
                          this.drecInsertUpdateStatus(LEASE_NUM,2,current_value,previous_value);
                      }else{
                          this.presentToast(`Please Upload  Document TL TC Chq Rcpt`);
                      }
                  }else if(STATUS_ID == 2){
                      this.drecInsertUpdateStatus(LEASE_NUM,3,current_value,previous_value);
                  }else if(STATUS_ID == 3){
                      this.drecInsertUpdateStatus(LEASE_NUM,4,current_value,previous_value);
                  }else if(STATUS_ID == 4){
                      this.drecInsertUpdateStatus(LEASE_NUM,5,current_value,previous_value);
                  }                          
              }
          }
      ]
  });
  alertConfirm.present();
}


drecInsertUpdateStatus(LEASE_NUM:any,STATUS_ID: any,CURRENT_VALUE: any,PREVIOUS_VALUE: any){
  let drecStatusData = {} as any;
  drecStatusData.lease_number   = LEASE_NUM;
  drecStatusData.status_id      = STATUS_ID;
  drecStatusData.current_value  = CURRENT_VALUE;
  drecStatusData.previous_value = PREVIOUS_VALUE;
  drecStatusData.created_by     = this.user.UserInfoId;
  drecStatusData.modified_by    = this.user.UserInfoId;

  this.presentLoadingDefault(true);
  this.authService.postData(drecStatusData,'drec/Drecstatusinsert').then((result) => {
          this.presentLoadingDefault(false);
          this.presentToast("Status Update successfully.");                                    
  }, (err) => {
          this.presentLoadingDefault(false);
          this.presentToast(err);
  });
}
 

onCloseHand(mode) {
    if (mode == 'reject') {
      this.reject_cmt = 'none';
    } else if (mode == 'approve') {
      this.approve_cmt = 'none';
    }
  }


  Approve_con() {
    let approvedata = this.ApproveForm.value;
    approvedata.modified_by = this.user.UserInfoId;
    approvedata.usertype = this.ResourseList.TYPE_USER ? this.ResourseList.TYPE_USER : '';

    this.presentLoadingDefault(true);
    this.btnTxt = 'In Progress...'
    this.authService.postData(approvedata, 'security/UpdateSecurityDepositStatus').then((result) => {
      this.getsecuritydepositlist();
      this.presentLoadingDefault(false);
      this.btnTxt = 'Save';
      this.approve_cmt = 'none';
    }, (err) => {
      this.presentLoadingDefault(false);
      this.btnTxt = 'Save';
      this.approve_cmt = 'none';
      this.presentToast(err);
    });
  }

  Reject_con() {
    let rejectdata = this.RejectForm.value;
    rejectdata.modified_by = this.user.UserInfoId;
    rejectdata.usertype = this.ResourseList.TYPE_USER ? this.ResourseList.TYPE_USER : '';

    this.presentLoadingDefault(true);
    this.btnTxt = 'In Progress...'
    this.authService.postData(rejectdata, 'security/getRejectSecurityDeposit').then((result) => {
      this.getsecuritydepositlist();
      this.presentLoadingDefault(false);
      this.btnTxt = 'Save';
      this.reject_cmt = 'none';
    }, (err) => {
      this.presentLoadingDefault(false);
      this.btnTxt = 'Save';
      this.reject_cmt = 'none';
      this.presentToast(err);
    });
  }

  getsecuritydepositlist(){
    let Data = this.navParams.get('data');
    console.log(Data);
    this.presentLoadingDefault(true);
    this.authService.getData({},'security/SecurityDetails/').then((result) => {
      this.securitydepositlist = result;
      if(Data[0].type == 'Pending COO/CEO Approval'){
        this.securitydepositdetails = this.securitydepositlist.filter(item => item.PAID == 5 && item.SECURITY_DEPOSIT_REF_ID != 0 && item.IS_HOLD == 0 && item.CASE_COUNT_1 == item.CASE_SETTLED_COUNT);       
      }else if (Data[0].type == 'Escalation to CEO/COO'){
        this.securitydepositdetails = this.securitydepositlist.filter(item => item.ESC_COUNT > 0 && item.IS_HOLD == 0);       
      }
      
      this.presentLoadingDefault(false);
    }, (err) => {
        console.log(err);
    });
  }

  Getallimagelist(LEASE_NUMBER: any, count: any) {
    if (count > 0) {
      this.presentLoadingDefault(true);
      this.authService.getData({}, 'drec/DrecUploadFileList1/' + LEASE_NUMBER + '').then((result) => {
        this.presentLoadingDefault(false);
        this.ImageList = result;
        const myModalOptions: ModalOptions = {
          enableBackdropDismiss: false
        };
        const myModalData = [{
          ImageList: this.ImageList,
          page_name: 'Drec'
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