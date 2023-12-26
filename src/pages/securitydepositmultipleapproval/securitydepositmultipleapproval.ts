import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, Modal, ModalController, ModalOptions, ViewController } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';



@IonicPage()
@Component({
  selector: 'page-securitydepositmultipleapproval',
  templateUrl: 'securitydepositmultipleapproval.html',
})
export class SecurityDepositMultipleApprovalPage {
  securitydepositdetails1 = this.navParams.get('data');
  securitydepositdetails = this.securitydepositdetails1[0];
  user: any = localStorage.getItem('userData');
  resourse: any = JSON.parse(localStorage.getItem('resourseData'));
  ResourseList: any;
  LEASE_NO: any;
  rejectbtn_approvebtn_show = 'none';
  reject_cmt = 'none';
  approve_cmt = 'none';
  multiple_approve_cmt = 'none';
  multiple_reject_cmt = 'none';

  btnTxt: any = 'Save';
  RejectForm: FormGroup;
  ApproveForm: FormGroup;
  securitydepositlist: any;

  lease_number_arr = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public authService: RestProvider, public toastCtrl: ToastController, private modal: ModalController,
    public loadingCtrl: LoadingController, public view: ViewController, private formBuilder: FormBuilder) {
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

  Rejectbtn(LEASE_NUMBER: any) {
    this.LEASE_NO = LEASE_NUMBER;
    this.reject_cmt = 'block';
  }

  Approvebtn(LEASE_NUMBER: any) {
    this.LEASE_NO = LEASE_NUMBER;
    this.approve_cmt = 'block';
  }

  openModal(LEASE_NUMBER: any) {

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: true
    };

    let myModalData = [{
      LEASE_NUMBER: LEASE_NUMBER
    }];

    let myModal: Modal = this.modal.create('SecurityDepositCommentPage', { data: myModalData }, myModalOptions);

    myModal.present();

    myModal.onDidDismiss((data) => {
    });

    myModal.onWillDismiss((data) => {
    });

  }

  openAttachment(LEASE_NUMBER: any) {
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let myModalData = [{
      LEASE_NUMBER: LEASE_NUMBER
    }];

    let myModal: Modal = this.modal.create('SecuritydepositattachmentPage', { data: myModalData }, myModalOptions);

    myModal.present();


    myModal.onWillDismiss(() => {
    });
  }

  onCloseHand(mode) {
    if (mode == 'reject') {
      this.reject_cmt = 'none';
      this.multiple_reject_cmt = 'none';
    } else if (mode == 'approve') {
      this.approve_cmt = 'none';
      this.multiple_approve_cmt = 'none';
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

  getsecuritydepositlist() {
    this.authService.getData({}, 'security/SecurityDetails/').then((result) => {
      this.securitydepositlist = result;
      this.securitydepositdetails = this.securitydepositlist.filter(item => item.PAID == 5);
    }, (err) => {
      console.log(err);
    });
  }

  CheckboxClicked(lease_number: any, event: any) {

    console.log(status);
    console.log(lease_number);
    console.log(event.checked);

    if (event.checked) {
      this.lease_number_arr.push(lease_number);
    } else {
      var index = this.lease_number_arr.findIndex(item => item == lease_number);
      if (index > -1) {
        this.lease_number_arr.splice(index, 1);
      }
    }

    console.log(this.lease_number_arr);
  }

  multipleLpoRejectbtn() {

    this.LEASE_NO = null;

    if (this.lease_number_arr.length > 0) {
      this.multiple_reject_cmt = 'block';
    } else {
      this.presentToast('Please select security deposit.');
      return;
    }

  }

  multipleLpoApprovebtn() {

    this.LEASE_NO = null;

    if (this.lease_number_arr.length > 0) {
      this.multiple_approve_cmt = 'block';
    } else {
      this.presentToast('Please select security deposit.');
      return;
    }
  }


  multiple_approve_con() {
    let approvedata = this.ApproveForm.value;
    approvedata.modified_by = this.user.UserInfoId;
    approvedata.usertype = this.ResourseList.TYPE_USER ? this.ResourseList.TYPE_USER : '';
    approvedata.lease_number_arr = this.lease_number_arr;

    if (this.lease_number_arr.length > 0) {

      this.presentLoadingDefault(true);
      this.btnTxt = 'In Progress...'
      this.authService.postData(approvedata, 'security/getApproveMultipleSecurityDeposit').then((result) => {
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

    } else {
      this.presentToast('Please select security deposit.');
    }
  }

  multiple_reject_con() {
    let rejectdata = this.RejectForm.value;
    rejectdata.modified_by = this.user.UserInfoId;
    rejectdata.usertype = this.ResourseList.TYPE_USER ? this.ResourseList.TYPE_USER : '';
    rejectdata.lease_number_arr = this.lease_number_arr;

    if (this.lease_number_arr.length > 0) {

      this.presentLoadingDefault(true);
      this.btnTxt = 'In Progress...'
      this.authService.postData(rejectdata, 'security/getRejectMultipleSecurityDeposit').then((result) => {
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

    }else {
      this.presentToast('Please select security deposit.');
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