import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, Modal, ModalController, ModalOptions, ViewController } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

   
@IonicPage()
@Component({
  selector: 'page-securitydepositdetail',
  templateUrl: 'securitydepositdetail.html',
})
export class SecurityDepositDetailPage {
  
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
  searchData = { "search_value": "" };
  securitydepositlistall:any;
  ImageList: any;
  insertedValues:any;

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

  ionViewDidLoad() {
    let Data = this.navParams.get('data');
    console.log(Data);

    if(Data[0].type == 'Escalation to CEO/COO'){
      this.showescalateddays = 1;
    }

    this.getsecuritydepositlist();
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
      this.securitydepositlistall = result;
      if(Data[0].type == 'Pending COO/CEO Approval'){
        this.securitydepositdetails = this.securitydepositlist.filter(item => item.PAID == 5 && item.SECURITY_DEPOSIT_REF_ID != 0 && item.IS_HOLD == 0 && item.CASE_COUNT_1 == item.CASE_SETTLED_COUNT);       
      }else if (Data[0].type == 'Escalation to CEO/COO'){
        this.securitydepositdetails = this.securitydepositlist.filter(item => item.ESC_COUNT > 0 && item.IS_HOLD == 0);       
      }else if(Data[0].type  == 'SD Not initiated'){
        this.securitydepositdetails = this.securitydepositlist.filter(item => item.SECURITY_DEPOSIT_REF_ID == 0); 
      }else if (Data[0].type   == "Pending Maint FM Confirmation"){
        this.securitydepositdetails = this.securitydepositlist.filter(item => item.IS_REJECTED == 0 && item.PAID == 0 && item.SECURITY_DEPOSIT_REF_ID != 0 && item.IS_HOLD == 0 && item.CASE_COUNT_1 == item.CASE_SETTLED_COUNT);
      } else if (Data[0].type   == "Pending Leasing Verification"){
        this.securitydepositdetails = this.securitydepositlist.filter(item => item.PAID == 1 && item.SECURITY_DEPOSIT_REF_ID != 0 && item.IS_HOLD == 0 && item.CASE_COUNT_1 == item.CASE_SETTLED_COUNT);
      } else if (Data[0].type   == "Pending Client Approval"){
        this.securitydepositdetails = this.securitydepositlist.filter(item => item.PAID == 2 && item.SECURITY_DEPOSIT_REF_ID != 0 && item.IS_HOLD == 0 && item.CASE_COUNT_1 == item.CASE_SETTLED_COUNT);
      } else if (Data[0].type   == "Pending Invoice Creation"){
        this.securitydepositdetails = this.securitydepositlist.filter(item => item.PAID == 3 && item.SECURITY_DEPOSIT_REF_ID != 0 && item.IS_HOLD == 0 && item.CASE_COUNT_1 == item.CASE_SETTLED_COUNT);
      } else if (Data[0].type   == "Pending Finance Verification"){
        this.securitydepositdetails = this.securitydepositlist.filter(item => item.PAID == 4 && item.SECURITY_DEPOSIT_REF_ID != 0 && item.IS_HOLD == 0 && item.CASE_COUNT_1 == item.CASE_SETTLED_COUNT);
      } else if (Data[0].type   == "Under chq Preparation"){
        this.securitydepositdetails = this.securitydepositlist.filter(item => item.PAID == 6 && item.SECURITY_DEPOSIT_REF_ID != 0 && item.IS_HOLD == 0 && item.CASE_COUNT_1 == item.CASE_SETTLED_COUNT);
      } else if (Data[0].type   == "Director Signature"){
        this.securitydepositdetails = this.securitydepositlist.filter(item => item.PAID == 7 && item.SECURITY_DEPOSIT_REF_ID != 0 && item.IS_HOLD == 0 && item.CASE_COUNT_1 == item.CASE_SETTLED_COUNT);
      } else if (Data[0].type   == "Amount Release to Client"){
        this.securitydepositdetails = this.securitydepositlist.filter(item => item.PAID == 8 && item.SECURITY_DEPOSIT_REF_ID != 0 && item.IS_HOLD == 0 && item.CASE_COUNT_1 == item.CASE_SETTLED_COUNT);
      } else if (Data[0].type   == "Sec Depo Guarantee Che Released"){
        this.securitydepositdetails = this.securitydepositlist.filter(item => item.PAID == 10 && item.SECURITY_DEPOSIT_REF_ID != 0 && item.IS_HOLD == 0 && item.CASE_COUNT_1 == item.CASE_SETTLED_COUNT);
      } else if (Data[0].type   == "Amt Handover to Client"){
        this.securitydepositdetails = this.securitydepositlist.filter(item => item.PAID == 9 && item.SECURITY_DEPOSIT_REF_ID != 0 && item.IS_HOLD == 0 && item.CASE_COUNT_1 == item.CASE_SETTLED_COUNT);
      } else if (Data[0].type   == "Guarantee Cheque"){
        this.securitydepositdetails = this.securitydepositlist.filter(item => item.CHEQUE_ID > 0 && item.SECURITY_DEPOSIT_REF_ID != 0 && item.IS_HOLD == 0 && item.CASE_COUNT_1 == item.CASE_SETTLED_COUNT);
      } else if (Data[0].type   == "FM Confirmation Quatation Uploaded"){
        this.securitydepositdetails = this.securitydepositlist.filter(item => item.FM_COUNT > 0 );
      } else if (Data[0].type   == "Client Approval Quatation Sent"){
        this.securitydepositdetails = this.securitydepositlist.filter(item => item.IS_CLIENT_QUOTE_SENT > 0 );
      }  
              
      if (Data[0].SearchData != '' && Data[0].SearchData != undefined) {
        this.searchData.search_value = Data[0].SearchData;
        this.SearchrtcaseDetail();
      }
      
      this.presentLoadingDefault(false);
    }, (err) => {
        console.log(err);
    });
  }

  SearchrtcaseDetail() {
    let case_val = this.searchData.search_value;

    if (case_val != '') {
      let filterData = this.securitydepositlistall.filter(item => this.filter(item));
      this.securitydepositdetails = filterData;
      
    } else {
      this.securitydepositdetails = this.securitydepositlistall
    }
    console.log(this.securitydepositdetails);
  }

  filter(item) {
    let _val = this.searchData.search_value;
    let _case_val = item['LEASE_NUMBER'] ? item['LEASE_NUMBER'].toString() : '';
    let _lease_val = item['PROPERTY_NAME'] ? item['PROPERTY_NAME'].toString() : '';
    let _cno_val = item['UNITNO'] ? item['UNITNO'].toString() : '';
    let _build_val = item['BUILD_CODE'] ? item['BUILD_CODE'].toString() : '';
    return (_case_val.includes(_val) || _lease_val.includes(_val) || _cno_val.includes(_val) || _build_val.includes(_val));
  }

  Getallimagelist(LEASE_NUMBER: any, count: any) {
    if (count > 0) {
      this.presentLoadingDefault(true);
      this.authService.getData({}, 'security/GetSecurityattachList/' + LEASE_NUMBER + '').then((result) => {
        this.presentLoadingDefault(false);
        this.ImageList = result;
        const myModalOptions: ModalOptions = {
          enableBackdropDismiss: false
        };
        const myModalData = [{
          ImageList: this.ImageList,
          page_name: 'Security Deposit'
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

  uploadAudioForApprove() {

    let securitycommentsData = {
        LEASE_NUMBER: this.LEASE_NO,
        created_by: this.user.UserInfoId,
        COMMENTS: 'Security Deposit Approve Recording'
      };

    console.log(securitycommentsData);

    this.presentLoadingDefault(true);
    this.authService.postData(securitycommentsData, 'security/getInsertSecDepCommentsWhileAudioRecording').then((result) => {
      this.insertedValues = result;
      console.log(result);
      this.presentLoadingDefault(false);

      const myModalOptions: ModalOptions = {
        enableBackdropDismiss: false
      };

      let myModalData = [{
        user_info_id: this.user.UserInfoId,
        comments_id: this.LEASE_NO,
        comments_child_id: result,
        module_type: 'SECURITY DEPOSIT',
        comment_created_by: this.user.UserInfoId
      }];

      let modelpage = '';
      modelpage = 'AudioCommentsPage';

      let myModal: Modal = this.modal.create(modelpage, { data: myModalData }, myModalOptions);

      myModal.present();
      myModal.onDidDismiss((data) => {        
      });

      myModal.onWillDismiss((data) => {
      });


    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
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