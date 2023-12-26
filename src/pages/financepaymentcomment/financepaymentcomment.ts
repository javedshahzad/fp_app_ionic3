import { Component } from '@angular/core';
import { IonicPage, Platform, NavController, NavParams, ToastController, ModalOptions, Modal, ModalController, LoadingController, ViewController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RestProvider } from '../../providers/rest/rest';
import { CallNumber } from '@ionic-native/call-number';

import { StreamingMedia, StreamingVideoOptions,StreamingAudioOptions  } from '@ionic-native/streaming-media';

@IonicPage()
@Component({
  selector: 'page-financepaymentcomment',
  templateUrl: 'financepaymentcomment.html',
})

export class FinancePaymentCommentPage {

  paymentcommentsdetails: any;
  pushnotificationValues: any;
  paymentcommentsForm: FormGroup
  insertedValues: any;
  payment_req_data = this.navParams.get('data');
  user: any = localStorage.getItem('userData');
  PAYMENT_DETAIL: any;
  COMMENT_TYPE: any;
  userlist: any;

  IS_SMS: any = false;
  IS_EMAIL: any = false;
  selectLabel: any = 'User';
  IS_CHECK: any = false;
  ischecked: boolean = false;
  paymentcommentsdetailsall: any;
  audioList:any;
  passwordIcon: string = 'arrow-dropdown';
  filePath: string;
  LpoaudioList: any;

  pet: string = "Comments";
  tab_name: any;
  login_user_id: any;

  constructor(public platform: Platform, public navCtrl: NavController, public navParams: NavParams, 
    private formBuilder: FormBuilder, public authService: RestProvider, public toastCtrl: ToastController, 
    private callNumber: CallNumber, public loadingCtrl: LoadingController, public view: ViewController,
    private modal: ModalController,
    private streamingMedia: StreamingMedia
    ) {
    this.user = this.user ? JSON.parse(this.user) : {};
    this.paymentcommentsForm = this.formBuilder.group({
      COMMENTS: ['', Validators.compose([Validators.required])],
      PAYMENT_REQUEST_ID: ['', Validators.compose([Validators.required])]
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

  insertPaymentComments() {

    let paymentcommentsData = this.paymentcommentsForm.value;
    paymentcommentsData.modified_by = this.user.UserInfoId;
    paymentcommentsData.modified_by = this.user.UserInfoId;
    paymentcommentsData.ReferenceType = 'FinancePayReq COMMENT';
    paymentcommentsData.user_type = this.user.resourseData.TYPE_USER;
    paymentcommentsData.user_name = this.user.Surname;

    if (paymentcommentsData.COMMENTS.trim() != "" && paymentcommentsData.COMMENTS.trim() != null) {
      this.presentLoadingDefault(true);
      this.authService.postData(paymentcommentsData, 'payment/getInsertFinancepaymentcommentsinsert').then((result) => {
        this.presentLoadingDefault(false);
        this.presentToast("Comments successfully saved");
        this.insertedValues = result;
        this.closeModal();
      }, (err) => {
        this.presentLoadingDefault(false);
        this.presentToast(err);
      });
    }else{
      this.presentToast('Please enter comment.');
    }
  }

  ionViewWillLoad() {
    
    this.login_user_id = this.user.UserInfoId;
    this.pet = "Comments";
    const Data = this.navParams.get('data');
    console.log(Data);
    // this.PAYMENT_DETAIL = Data[0].PAYMENT_DETAIL;
    // console.log(this.PAYMENT_DETAIL);

    this.presentLoadingDefault(true);
    this.authService.postData(Data[0], 'payment/getFinancePaymentComments').then((result) => {
      this.paymentcommentsdetailsall = result;
      this.paymentcommentsdetails = this.paymentcommentsdetailsall.filter(x=> x.SHOW_ESCALATION == 0);
      this.presentLoadingDefault(false);
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });

  }
  
  showEscalation(e): void { 
  	console.log("checked: " + this.ischecked);

    if(this.ischecked){ 
        this.paymentcommentsdetails = this.paymentcommentsdetailsall;
    }else{
      this.paymentcommentsdetails = this.paymentcommentsdetailsall.filter(x=> x.SHOW_ESCALATION == 0);
    }
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

  GetUserList() {
    this.authService.postData({ is_active: 1 }, 'account/GetSearchList').then((result) => {
      this.userlist = result;
      if (this.userlist.length > 0) {
        this.presentLoadingDefault(false);
      } else {
        this.presentLoadingDefault(false);
      }
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast("Something went to wrong, please try again later");
    });
  }

  changeToSend(type) {
    this.IS_CHECK = true;
    if (type == 'SMS') {
      this.IS_EMAIL = false;
      this.selectLabel = 'SMS to';
    } else {
      this.IS_SMS = false;
      this.selectLabel = 'Email to';
    }
    if (!this.IS_EMAIL && !this.IS_SMS) {
      this.IS_CHECK = false;
    }
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

  callmobileNumber(mobileno: any) {
    console.log('Call Number', mobileno);
    this.callNumber.callNumber(mobileno, true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.log('Error launching dialer', err));
  }

  uploadAudio(i: number, data: any) {

    console.log(i, data);

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let myModalData = [{
      user_info_id: this.user.UserInfoId,
      comments_id: data.REFERENCE_ID,
      comments_child_id: data.COMMENT_ID,
      module_type: 'FINANCE PAYMENT',
      comment_created_by: data.MODIFIED_BY
    }]


    let modelpage = '';
    modelpage = 'AudioCommentsPage';

    let myModal: Modal = this.modal.create(modelpage, { data: myModalData }, myModalOptions);

    myModal.present();
    myModal.onDidDismiss((data) => {
    });
    myModal.onWillDismiss((data) => {
    });

  } 

  uploadAudioNewComment() {

    const Data = this.navParams.get('data');
    let PAYMENT_REQUEST_ID = Data[0].PAYMENT_REQUEST_ID;

    let resourseData: any = localStorage.getItem('resourseData');
    let paymentcommentsData = this.paymentcommentsForm.value;
    paymentcommentsData.modified_by = this.user.UserInfoId;
    paymentcommentsData.modified_by = this.user.UserInfoId;
    //paymentcommentsData.PAYMENT_DETAIL = JSON.stringify(this.PAYMENT_DETAIL);
    paymentcommentsData.ReferenceType = 'FinancePayReq COMMENT';
    paymentcommentsData.ResourseData = resourseData;
    paymentcommentsData.COMMENTS = 'Recording';
    console.log(paymentcommentsData);

    this.presentLoadingDefault(true);
    this.authService.postData(paymentcommentsData, 'payment/getInsertFinancePaymentCommentsWhileAudioRecording').then((result) => {      
      this.insertedValues = result;
      console.log(result);
      this.presentLoadingDefault(false);

      const myModalOptions: ModalOptions = {
        enableBackdropDismiss: false
      };
  
      let myModalData = [{
        user_info_id: this.user.UserInfoId,
        comments_id: PAYMENT_REQUEST_ID,
        comments_child_id: result,
        module_type: 'FINANCE PAYMENT',
        comment_created_by: this.user.UserInfoId
      }]
    
      let modelpage = '';
      modelpage = 'AudioCommentsPage';
  
      let myModal: Modal = this.modal.create(modelpage, { data: myModalData }, myModalOptions);
  
      myModal.present();
      myModal.onDidDismiss((data) => {
          this.ionViewWillLoad();
      });
      myModal.onWillDismiss((data) => {
      });

    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });

  }

  
  getAudioList(comments_id: any, comments_child_id: any) {

    let client_name = '';
    let unit_no = '';

    let commentsData = {
      user_info_id: this.user.UserInfoId,
      comments_id: comments_id,
      comments_child_id: comments_child_id,
      module_name: 'FINANCE PAYMENT',
      unit_no: unit_no,
      client_name: client_name
    }

    this.presentLoadingDefault(true);
    this.authService.postData(commentsData, 'task/getRoiAndCommentsAudioListByType').then((result) => {
      this.audioList = result;
      this.presentLoadingDefault(false);
      console.log('result', this.audioList);

    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });

  }

  showAddSourceBtn = -1;
  isAddSourceOpen = false;
  oldAddSourceBtn = -1;

  showAddSourceUndoBtn(index: number, data: any) {
    this.passwordIcon = this.passwordIcon === 'arrow-dropdown' ? 'arrow-dropup' : 'arrow-dropdown';
    this.getAudioList(data.REFERENCE_ID, data.COMMENT_ID);
    if (this.isAddSourceOpen == false) {
      this.isAddSourceOpen = true;
      this.oldAddSourceBtn = index;
      this.showAddSourceBtn = index;
    } else {
      if (this.oldAddSourceBtn == index) {
        this.isAddSourceOpen = false;
        this.showAddSourceBtn = -1;
        this.oldAddSourceBtn = -1;
      } else {
        this.showAddSourceBtn = index;
        this.oldAddSourceBtn = index;
      }
    }
  }


  playAudio(file: any, file_path: any, idx: any) {

    let options: StreamingAudioOptions = {
      successCallback: () => { console.log('Video played') },
      errorCallback: (e) => { console.log('Error streaming') },
      initFullscreen: false
    };

    if (this.platform.is('ios')) {
      this.filePath = file_path;
      this.streamingMedia.playAudio(this.filePath, options);
    } else if (this.platform.is('android')) {
      this.filePath = file_path;
      this.streamingMedia.playAudio(this.filePath, options);
    }

  }

  deleteAudio(id: any, comments_id: any, comments_child_id: any) {

    this.presentLoadingDefault(true);
    let task_insert_data = {
      id: id,
      comments_id: comments_id,
      comments_child_id: comments_child_id,
      user_info_id: this.user.UserInfoId
    }

    this.authService.postData(task_insert_data, 'task/getDeleteRoiAudio').then((result) => {
      this.presentLoadingDefault(false);
      this.presentToast("Audio is deleted Successfully.");
      this.ionViewWillLoad();
    }, err => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });

  }


  segmentChanged(event) {
    console.log(event.value);
    let tabValue = event.value;
    this.tab_name = event.value;
    if (tabValue == 'Comments') {
      this.getFinPayCommentDetails();
    } else if (tabValue == 'Recording') {
      this.getLpoAudioList();
    } 
  }


  getFinPayCommentDetails() {    
    const Data = this.navParams.get('data');
    console.log(Data);
    // this.PAYMENT_DETAIL = Data[0].PAYMENT_DETAIL;
    // console.log(this.PAYMENT_DETAIL);

    this.presentLoadingDefault(true);
    this.authService.postData(Data[0], 'payment/getFinancePaymentComments').then((result) => {
      this.paymentcommentsdetailsall = result;
      this.paymentcommentsdetails = this.paymentcommentsdetailsall.filter(x=> x.SHOW_ESCALATION == 0);
      this.presentLoadingDefault(false);
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });

  }

  getLpoAudioList() {

    const Data = this.navParams.get('data');
    let PAYMENT_REQUEST_ID = Data[0].PAYMENT_REQUEST_ID;

    let client_name = '';
    let unit_no = '';

    let commentsData = {

      user_info_id: this.user.UserInfoId,
      comments_id: PAYMENT_REQUEST_ID,
      comments_child_id: null,
      module_name: 'FINANCE PAYMENT',
      unit_no: unit_no,
      client_name: client_name
    }

    this.presentLoadingDefault(true);
    this.authService.postData(commentsData, 'task/getRoiAndCommentsAudioListByType').then((result) => {
      this.LpoaudioList = result;
      console.log('Lpo Audio List', this.LpoaudioList);
      this.presentLoadingDefault(false);

    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });


  }
 
  uploadReplyAudio(i: number, data: any,reply_id:any) {

    console.log(i, data);

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let myModalData = [{
      user_info_id: this.user.UserInfoId,
      comments_id: data.REFERENCE_ID,
      comments_child_id: data.COMMENT_ID,
      module_type: 'FINANCE PAYMENT',
      comment_created_by: data.MODIFIED_BY,
      replied_from_id: reply_id
    }]


    let modelpage = '';
    modelpage = 'AudioCommentsPage';

    let myModal: Modal = this.modal.create(modelpage, { data: myModalData }, myModalOptions);

    myModal.present();
    myModal.onDidDismiss((data) => {
    });
    myModal.onWillDismiss((data) => {
    });

  }

  uploadRecordingTabReplyAudio(i: number, data: any,reply_id:any) {

    console.log(i, data);

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let myModalData = [{
      user_info_id: this.user.UserInfoId,
      comments_id: data.COMMENTS_ID,
      comments_child_id: data.COMMENTS_CHILD_ID,
      module_type: 'FINANCE PAYMENT',
      comment_created_by: data.MODIFIED_BY,
      replied_from_id: reply_id
    }]


    let modelpage = '';
    modelpage = 'AudioCommentsPage';

    let myModal: Modal = this.modal.create(modelpage, { data: myModalData }, myModalOptions);

    myModal.present();
    myModal.onDidDismiss((data) => {
    });
    myModal.onWillDismiss((data) => {
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