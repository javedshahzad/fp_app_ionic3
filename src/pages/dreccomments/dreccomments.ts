import { Component } from '@angular/core';
import { IonicPage, Platform, NavController, NavParams, ToastController, ModalOptions, Modal, ModalController, LoadingController, ViewController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RestProvider } from '../../providers/rest/rest';

import { StreamingMedia, StreamingVideoOptions,StreamingAudioOptions  } from '@ionic-native/streaming-media';


@IonicPage()
@Component({
  selector: 'page-dreccomments',
  templateUrl: 'dreccomments.html',
})
export class DrecCommentsPage {
  dreccommentsdetails: any
  dreccommentsForm: FormGroup
  insertedValues: any;
  pushnotificationValues: any;
  drecdata = this.navParams.get('data');
  user: any = localStorage.getItem('userData');
  drecData: any;
  ischecked: boolean = false;
  dreccommentsdetailsall: any;
  LpoaudioList: any;
  pet: string = "Comments";
  tab_name: any;
  login_user_id: any;
  filePath: string;

  constructor(public platform: Platform, public navCtrl: NavController, public navParams: NavParams, 
    private formBuilder: FormBuilder,
    public authService: RestProvider, public toastCtrl: ToastController,
    public loadingCtrl: LoadingController, public view: ViewController,
    private modal: ModalController,
    private streamingMedia: StreamingMedia
    ) {
    this.user = this.user ? JSON.parse(this.user) : {};
    this.dreccommentsForm = this.formBuilder.group({
      COMMENTS: ['', Validators.compose([Validators.required])],
      LEASE_NUM: ['', Validators.compose([Validators.required])]
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

  insertdrecComments() {
    let resourseData: any = localStorage.getItem('resourseData');
    resourseData = resourseData ? JSON.parse(resourseData) : 0;
    let dreccommentsData = this.dreccommentsForm.value;
    dreccommentsData.CREATED_BY = this.user.UserInfoId;
    dreccommentsData.MODIFIED_BY = this.user.UserInfoId;
    dreccommentsData.USERNAME = this.user.Surname;
    dreccommentsData.DREC = JSON.stringify(this.drecData);
    dreccommentsData.RESOURCE_ID = resourseData.RESOURCE_ID;
    this.presentLoadingDefault(true);
    this.authService.postData(dreccommentsData, 'drec/Dreccommentsinsert').then((result) => {
      this.presentLoadingDefault(false);
      this.presentToast("Comments successfully saved");
      this.insertedValues = result;
      this.closeModal();

      var app_platform: string = '';
      if (this.platform.is('ios')) {
        app_platform = 'ios';
      }

      if (this.platform.is('android')) {
        app_platform = 'android';
      }

      let push_message = {} as any;
      push_message.title = this.user.Surname
      push_message.message = this.dreccommentsForm.value.COMMENTS;
      push_message.app_platform = app_platform;

    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });
  }

  ionViewWillLoad() {
    
    this.login_user_id = this.user.UserInfoId;
    const Data = this.navParams.get('data');
    //let myTitle = 'Drec Comments';
    console.log(Data);
    let LEASE_NUM = Data[0].LEASE_NUM;
    this.drecData = Data[0].DREC;
    this.presentLoadingDefault(true);
    this.authService.getData({}, 'drec/DrecCommentsList/' + LEASE_NUM).then((result) => {
      this.dreccommentsdetailsall = result;
      this.dreccommentsdetails = this.dreccommentsdetailsall.filter(x => x.SHOW_ESCALATION == 0);
      console.log(this.dreccommentsdetails);
      this.presentLoadingDefault(false);
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });

  }

  showEscalation(e): void {
    console.log("checked: " + this.ischecked);

    if (this.ischecked) {
      this.dreccommentsdetails = this.dreccommentsdetailsall;
    } else {
      this.dreccommentsdetails = this.dreccommentsdetailsall.filter(x => x.SHOW_ESCALATION == 0);
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
      comments_child_id: data.DREC_COMMENTS_ID,
      module_type: 'DREC',
      comment_created_by: data.CREATED_BY,
      payment_details: JSON.stringify(this.drecData)
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
      module_type: 'DREC',
      comment_created_by: data.MODIFIED_BY,
      replied_from_id: reply_id,
      payment_details: JSON.stringify(this.drecData)
    }];


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
    console.log(Data);
    let LEASE_NUM = Data[0].LEASE_NUM;
    let resourseData: any = localStorage.getItem('resourseData');

    let dreccommentsData = this.dreccommentsForm.value;
    dreccommentsData.CREATED_BY = this.user.UserInfoId;
    dreccommentsData.MODIFIED_BY = this.user.UserInfoId;
    dreccommentsData.USERNAME = this.user.Surname;
    dreccommentsData.DREC = JSON.stringify(this.drecData);
    dreccommentsData.RESOURCE_ID = resourseData.RESOURCE_ID;
    dreccommentsData.COMMENTS = 'Recording';
    console.log(dreccommentsData);

    this.presentLoadingDefault(true);
    this.authService.postData(dreccommentsData, 'drec/getInsertDrecCommentsWhileAudioRecording').then((result) => {      
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
        module_type: 'DREC',
        comment_created_by: this.user.UserInfoId,
        payment_details: JSON.stringify(this.drecData)
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
    //let myTitle = 'Drec Comments';
    console.log(Data);
    let LEASE_NUM = Data[0].LEASE_NUM;

    let client_name = '';
    let unit_no = '';

    let commentsData = {

      user_info_id: this.user.UserInfoId,
      comments_id: LEASE_NUM,
      comments_child_id: null,
      module_name: 'DREC',
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