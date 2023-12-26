import { Component } from '@angular/core';
import { IonicPage, Platform, NavController, NavParams, ToastController, ModalOptions, Modal, ModalController, LoadingController, ViewController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RestProvider } from '../../providers/rest/rest';
import { StreamingMedia, StreamingVideoOptions,StreamingAudioOptions  } from '@ionic-native/streaming-media';

@IonicPage()
@Component({
  selector: 'page-chequecomment',
  templateUrl: 'chequecomment.html',
})

export class ChequeCommentPage {

  chequecommentsdetails: any;
  chequecommentsdetailsall: any;
  pushnotificationValues: any;
  chequecommentsForm: FormGroup
  insertedValues: any;
  chequedata = this.navParams.get('data');
  CHEQUE: any;
  user: any = localStorage.getItem('userData');
  ischecked: boolean = false;
  LpoaudioList: any;

  pet: string = "Comments";
  tab_name: any;
  login_user_id: any;
  filePath: string;

  constructor(public platform: Platform, public navCtrl: NavController,
    public navParams: NavParams, private formBuilder: FormBuilder,
    public authService: RestProvider, public toastCtrl: ToastController,
    public loadingCtrl: LoadingController, public view: ViewController,
    private modal: ModalController,
    private streamingMedia: StreamingMedia
  ) {
    this.user = this.user ? JSON.parse(this.user) : {};
    this.chequecommentsForm = this.formBuilder.group({
      COMMENTS: ['', Validators.compose([Validators.required])],
      CASH_RECEIPT_ID: ['', Validators.compose([Validators.required])]
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

  insertchequeComments() {

    let resourseData: any = localStorage.getItem('resourseData');
    let chequecommentsData = this.chequecommentsForm.value;
    chequecommentsData.user_name = this.user.Surname;
    chequecommentsData.Ctype = 0;
    chequecommentsData.userid = this.user.UserInfoId;
    chequecommentsData.user_emp_id = this.user.UserEmployeeId;
    chequecommentsData.CHEQUE = JSON.stringify(this.CHEQUE);
    chequecommentsData.ResourseData = resourseData;
    console.log(chequecommentsData);
    this.presentLoadingDefault(true);
    this.authService.postData(chequecommentsData, 'cheque/chequecommentsinsert').then((result) => {
      this.presentLoadingDefault(false);
      this.presentToast("Comments successfully saved");
      this.insertedValues = result;

    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });

  }

  ionViewWillLoad() {

    this.login_user_id = this.user.UserInfoId;
    const Data = this.navParams.get('data');
    let CASH_RECEIPT_ID = Data[0].ID;
    this.CHEQUE = Data[0].CHEQUE;
    this.presentLoadingDefault(true);
    this.authService.getData({}, 'cheque/cheque_comments/' + CASH_RECEIPT_ID).then((result) => {
      this.chequecommentsdetailsall = result;
      this.chequecommentsdetails = this.chequecommentsdetailsall.filter(x => x.SHOW_ESCALATION == 0);
      console.log(this.chequecommentsdetailsall);
      this.presentLoadingDefault(false);

    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });

  }


  showEscalation(e): void {
    console.log("checked: " + this.ischecked);

    if (this.ischecked) {

      this.chequecommentsdetails = this.chequecommentsdetailsall;
    } else {
      this.chequecommentsdetails = this.chequecommentsdetailsall.filter(x => x.SHOW_ESCALATION == 0);
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



  uploadAudio(i: number, data: any) {

    console.log(i, data);

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let myModalData = [{
      user_info_id: this.user.UserInfoId,
      comments_id: data.CASH_RECEIPT_ID,
      comments_child_id: data.ID,
      module_type: 'CHEQUE',
      comment_created_by: data.CREATED_BY,
      payment_details: JSON.stringify(this.CHEQUE)
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


  uploadRecordingTabReplyAudio(i: number, data: any, reply_id: any) {

    console.log(i, data);

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let myModalData = [{
      user_info_id: this.user.UserInfoId,
      comments_id: data.COMMENTS_ID,
      comments_child_id: data.COMMENTS_CHILD_ID,
      module_type: 'CHEQUE',
      comment_created_by: data.MODIFIED_BY,
      replied_from_id: reply_id,
      payment_details: JSON.stringify(this.CHEQUE)
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
    let CASH_RECEIPT_ID = Data[0].ID;

    let resourseData: any = localStorage.getItem('resourseData');
    let chequecommentsData = this.chequecommentsForm.value;
    chequecommentsData.user_name = this.user.Surname;
    chequecommentsData.Ctype = 0;
    chequecommentsData.userid = this.user.UserInfoId;
    chequecommentsData.user_emp_id = this.user.UserEmployeeId;
    chequecommentsData.CHEQUE = JSON.stringify(this.CHEQUE);
    chequecommentsData.ResourseData = resourseData;
    chequecommentsData.COMMENTS = 'Recording';
    console.log(chequecommentsData);

    this.presentLoadingDefault(true);
    this.authService.postData(chequecommentsData, 'cheque/getInsertChequeCommentsAudioRecording').then((result) => {
      this.insertedValues = result;
      console.log(result);
      this.presentLoadingDefault(false);

      const myModalOptions: ModalOptions = {
        enableBackdropDismiss: false
      };

      let myModalData = [{
        user_info_id: this.user.UserInfoId,
        comments_id: CASH_RECEIPT_ID,
        comments_child_id: result,
        module_type: 'CHEQUE',
        comment_created_by: this.user.UserInfoId,
        payment_details: JSON.stringify(this.CHEQUE)
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

  segmentChanged(event) {
    console.log(event.value);
    let tabValue = event.value;
    this.tab_name = event.value;
    if (tabValue == 'Comments') {
      this.ionViewWillLoad();
    } else if (tabValue == 'Recording') {
      this.getLpoAudioList();
    }
  }


  getLpoAudioList() {

    const Data = this.navParams.get('data');
    let CASH_RECEIPT_ID = Data[0].ID;

    let client_name = '';
    let unit_no = '';

    let commentsData = {

      user_info_id: this.user.UserInfoId,
      comments_id: CASH_RECEIPT_ID,
      comments_child_id: null,
      module_name: 'CHEQUE',
      unit_no: unit_no,
      client_name: client_name
    }

    this.presentLoadingDefault(true);
    this.authService.postData(commentsData, 'task/getRoiAndCommentsAudioListByType').then((result) => {
      this.LpoaudioList = result;
      console.log('Cheque Audio List', this.LpoaudioList);
      this.presentLoadingDefault(false);

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
    } else {
      loading.dismissAll();
      loading = null
    }
  }

}