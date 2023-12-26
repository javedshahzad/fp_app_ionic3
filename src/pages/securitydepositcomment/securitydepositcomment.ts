import { Component } from '@angular/core';
import { IonicPage, NavController, Platform, NavParams, ToastController, LoadingController, ModalOptions, Modal, ModalController, ViewController, PopoverController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RestProvider } from '../../providers/rest/rest';
import { StreamingMedia, StreamingVideoOptions,StreamingAudioOptions  } from '@ionic-native/streaming-media';



@IonicPage()
@Component({
  selector: 'page-securitydepositcomment',
  templateUrl: 'securitydepositcomment.html',
})
export class SecurityDepositCommentPage {
  securitycommentsdetails: any
  securitycommentsForm: FormGroup
  insertedValues: any;
  securitydata = this.navParams.get('data');
  user: any = localStorage.getItem('userData');
  ischecked: boolean = false;
  securitycommentsdetailsall: any;

  LpoaudioList: any;
  pet: string = "Comments";
  tab_name: any;
  login_user_id: any;
  filePath: string;


  constructor(public platform: Platform,public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder,
    public authService: RestProvider, public toastCtrl: ToastController, public popoverCtrl: PopoverController,
    public loadingCtrl: LoadingController, public view: ViewController,
    private modal: ModalController,
    private streamingMedia: StreamingMedia
  ) {
    this.user = this.user ? JSON.parse(this.user) : {};
    this.securitycommentsForm = this.formBuilder.group({
      COMMENTS: ['', Validators.compose([Validators.required])],
      LEASE_NUMBER: ['', Validators.compose([Validators.required])]
    });
  }

  loading = this.loadingCtrl.create();
  presentLoadingDefault(show) {
    if (!this.loading) {
      this.loading = this.loadingCtrl.create();
    }

    if (show) {
      this.loading.present();
    }else {
      this.loading.dismissAll();
      this.loading = null
    }

  };

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

  insertsecurityComments() {
    let securitycommentsData = this.securitycommentsForm.value;
    securitycommentsData.created_by = this.user.UserInfoId;
    this.presentLoadingDefault(true);
    this.authService.postData(securitycommentsData, 'security/Securitycommentsinsert').then((result) => {
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

    this.login_user_id = this.user.UserInfoId;
    const Data = this.navParams.get('data');
    let LEASE_NUM = Data[0].LEASE_NUMBER;
    this.presentLoadingDefault(true);
    this.authService.getData({}, 'security/Security_comments/' + LEASE_NUM).then((result) => {
      this.securitycommentsdetailsall = result;
      this.securitycommentsdetails = this.securitycommentsdetailsall.filter(x => x.SHOW_ESCALATION == 0);
      this.presentLoadingDefault(false);

    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });

  }

  showEscalation(e): void {
    console.log("checked: " + this.ischecked);

    if (this.ischecked) {
      this.securitycommentsdetails = this.securitycommentsdetailsall;
    } else {
      this.securitycommentsdetails = this.securitycommentsdetailsall.filter(x => x.SHOW_ESCALATION == 0);
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
      comments_id: data.LEASE_NUMBER,
      comments_child_id: data.SDC_ID,
      module_type: 'SECURITY DEPOSIT',
      comment_created_by: data.CREATED_BY,
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
      module_type: 'SECURITY DEPOSIT',
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


  uploadAudioNewComment() {

    const Data = this.navParams.get('data');
    let LEASE_NUM = Data[0].LEASE_NUMBER;

    let resourseData: any = localStorage.getItem('resourseData');
    let securitycommentsData = this.securitycommentsForm.value;
    securitycommentsData.created_by = this.user.UserInfoId;
    securitycommentsData.COMMENTS = 'Recording';
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
        comments_id: LEASE_NUM,
        comments_child_id: result,
        module_type: 'SECURITY DEPOSIT',
        comment_created_by: this.user.UserInfoId
      }];

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
    let LEASE_NUM = Data[0].LEASE_NUMBER;

    let client_name = '';
    let unit_no = '';

    let commentsData = {

      user_info_id: this.user.UserInfoId,
      comments_id: LEASE_NUM,
      comments_child_id: null,
      module_name: 'SECURITY DEPOSIT',
      unit_no: unit_no,
      client_name: client_name
    }

    this.presentLoadingDefault(true);
    this.authService.postData(commentsData, 'task/getRoiAndCommentsAudioListByType').then((result) => {
      this.LpoaudioList = result;
      console.log('Sec Dep Audio List', this.LpoaudioList);
      this.presentLoadingDefault(false);

    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });

  }


}