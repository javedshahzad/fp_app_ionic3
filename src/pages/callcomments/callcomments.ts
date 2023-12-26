import { Component } from '@angular/core';
import { IonicPage, Platform, NavController, NavParams, ToastController, ModalOptions, Modal, ModalController, LoadingController, ViewController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RestProvider } from '../../providers/rest/rest';

import { StreamingMedia, StreamingVideoOptions,StreamingAudioOptions  } from '@ionic-native/streaming-media';


@IonicPage()
@Component({
  selector: 'page-callcomment',
  templateUrl: 'callcomments.html',
})

export class callcomments {

  callcommentsdetails: any
  callcommentsForm: FormGroup
  insertedValues: any;
  calldata: any;
  pushnotificationValues: any;
  CALL_LOG_ID: any;
  userlist: any;
  selected: any;
  call_statusdata = this.navParams.get('data');
  resourse: any = JSON.parse(localStorage.getItem('resourseData'));
  user: any = localStorage.getItem('userData');
  callcommentsdetailsall: any;
  ischecked: boolean = false;

  pet: string = "Comments";
  tab_name: any;
  LpoaudioList: any;
  login_user_id: any;
  passwordIcon: string = 'arrow-dropdown';
  audioList: any;
  filePath: string;

  constructor(public platform: Platform, public navCtrl: NavController, 
    public navParams: NavParams, private formBuilder: FormBuilder,
    public authService: RestProvider, public toastCtrl: ToastController,
    public loadingCtrl: LoadingController, public view: ViewController,
    private modal: ModalController,
    private streamingMedia: StreamingMedia
  ) {
    this.user = this.user ? JSON.parse(this.user) : {};
    this.callcommentsForm = this.formBuilder.group({
      COMMENTS: ['', Validators.compose([Validators.required])],
      CALL_LOG_ID: ['', Validators.compose([Validators.required])],
      STATUS: ['', Validators.compose([Validators.required])],
      user: ['', Validators.compose([Validators.required])],
      SMS: [],
      EMAIL: []
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

  ASSIGNED_SITE_MAP() {
    this.authService.getData({}, 'call_management/Userlist').then((result) => {
      this.userlist = result;
      if (this.userlist.length > 0) {
        this.presentLoadingDefault(false);
      } else {
        this.presentLoadingDefault(false);
      }
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });
  }

  insertCallComments(i: any) {

    let CallCommentsData = this.callcommentsForm.value;
    if (CallCommentsData.SMS == true) {
      CallCommentsData.SMS = 1;
    } else {
      CallCommentsData.SMS = 0;
    }
    if (CallCommentsData.EMAIL == true) {
      CallCommentsData.EMAIL = 1;
    } else {
      CallCommentsData.EMAIL = 0;
    }
    CallCommentsData.created_by = this.user.UserInfoId;
    CallCommentsData.modified_by = this.user.UserInfoId;
    CallCommentsData.Userslist = JSON.stringify(this.selected);
    CallCommentsData.Reference_Id = 0;
    CallCommentsData.ReferenceType = 0;
    CallCommentsData.requster_name = this.call_statusdata[0].REQUESTOR_NAME;
    CallCommentsData.send_by = this.user.Surname;
    this.presentLoadingDefault(true);
    this.authService.postData(CallCommentsData, 'call_management/CallCommentsinsert').then((result) => {
      this.presentToast("Comments successfully saved");
      this.insertedValues = result;

      var app_platform: string = '';
      if (this.platform.is('ios')) {
        app_platform = 'ios';
      }

      if (this.platform.is('android')) {
        app_platform = 'android';
      }

      let push_message = {} as any;
      push_message.title = this.user.Surname;
      push_message.content = 'CALL COMMENT';
      push_message.message = this.callcommentsForm.value.COMMENTS;
      push_message.app_platform = app_platform;
      this.authService.postData(push_message, 'pushnotification/pushnotificationsend').then((result) => {
        this.presentLoadingDefault(false);
        this.pushnotificationValues = result;
        this.closeModal();
      }, (err) => {
        this.presentLoadingDefault(false);
        this.presentToast(err);
      });

    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });


  }

  ionViewWillLoad() {
    this.calldata = this.navParams.get('data');
    this.CALL_LOG_ID = this.calldata[0].CALL_LOG_ID;
    this.login_user_id = this.user.UserInfoId;
    this.getallcallcomments();
    this.ASSIGNED_SITE_MAP();

  }

  showEscalation(e): void {
    console.log("checked: " + this.ischecked);

    if (this.ischecked) {
      this.callcommentsdetails = this.callcommentsdetailsall;
    } else {
      this.callcommentsdetails = this.callcommentsdetailsall.filter(x => x.SHOW_ESCALATION == 0);
    }
  }


  getallcallcomments() {
    this.presentLoadingDefault(true);
    this.authService.getData({}, 'call_management/Callcomments/' + this.CALL_LOG_ID).then((result) => {
      this.callcommentsdetailsall = result;
      this.callcommentsdetails = this.callcommentsdetailsall.filter(x => x.SHOW_ESCALATION == 0);
      console.log(this.callcommentsdetails);
      this.presentLoadingDefault(false);

    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });
  }

  resetForm() {
    this.callcommentsForm.reset();
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
    if (this.isOpen = false) {
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
      comments_id: data.CALLLOG_ID,
      comments_child_id: data.CALL_HISTORY_COMMENT_ID,
      module_type: 'CALL',
      comment_created_by: data.MODIFIED_BY,
      requster_name: this.call_statusdata[0].REQUESTOR_NAME
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

        
    let CallCommentsData = this.callcommentsForm.value;    
    CallCommentsData.created_by = this.user.UserInfoId;
    CallCommentsData.modified_by = this.user.UserInfoId;
    //CallCommentsData.Userslist = JSON.stringify(this.selected);
    CallCommentsData.Reference_Id = 0;
    CallCommentsData.ReferenceType = 0;
    CallCommentsData.requster_name = this.call_statusdata[0].REQUESTOR_NAME;
    CallCommentsData.send_by = this.user.Surname;
    CallCommentsData.COMMENTS = 'Recording'

    this.presentLoadingDefault(true);
    this.authService.postData(CallCommentsData, 'call_management/getInsertCallCommentsAudioRecording').then((result) => {
      this.insertedValues = result;
      this.presentLoadingDefault(false);

      const myModalOptions: ModalOptions = {
        enableBackdropDismiss: false
      };
  
      let myModalData = [{
        user_info_id: this.user.UserInfoId,
        comments_id: this.CALL_LOG_ID,
        comments_child_id: result,
        module_type: 'CALL',
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


  
  segmentChanged(event) {
    console.log(event.value);
    let tabValue = event.value;
    this.tab_name = event.value;
    if (tabValue == 'Comments') {
      this.getallcallcomments();
    } else if (tabValue == 'Recording') {
      this.getLpoAudioList();
    }
  }

  getLpoAudioList() {

    let client_name = '';
    let unit_no = '';

    let commentsData = {

      user_info_id: this.user.UserInfoId,
      comments_id: this.CALL_LOG_ID,
      comments_child_id: null,
      module_name: 'CALL',
      unit_no: unit_no,
      client_name: client_name
    }

    this.presentLoadingDefault(true);
    this.authService.postData(commentsData, 'task/getRoiAndCommentsAudioListByType').then((result) => {
      this.LpoaudioList = result;
      console.log('Call Audio List', this.LpoaudioList);
      this.presentLoadingDefault(false);

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
      module_name: 'CALL',
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
    this.getAudioList(data.CALLLOG_ID, data.CALL_HISTORY_COMMENT_ID);
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


  uploadReplyAudio(i: number, data: any, reply_id: any, audio_created_by: any) {

    console.log(i, data);

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let myModalData = [{
      user_info_id: this.user.UserInfoId,
      comments_id: data.CALLLOG_ID,
      comments_child_id: data.CALL_HISTORY_COMMENT_ID,
      module_type: 'CALL',
      comment_created_by: audio_created_by,
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
      module_type: 'CALL',
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