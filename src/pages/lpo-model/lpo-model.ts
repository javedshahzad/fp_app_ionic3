import { Component } from '@angular/core';
import { IonicPage, NavController, Platform, NavParams, AlertController, MenuController, ToastController, LoadingController, Modal, ModalController, ModalOptions, ViewController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RestProvider } from '../../providers/rest/rest';
import { StreamingMedia, StreamingVideoOptions,StreamingAudioOptions  } from '@ionic-native/streaming-media';

@IonicPage()
@Component({
  selector: 'page-lpo-model',
  templateUrl: 'lpo-model.html',
})

export class Lpomodelcomments {

  
  lpocommentsdetails: any;
  lpocommentsForm: FormGroup;
  insertedValues: any;
  calldata: any;
  pushnotificationValues: any;
  lpodata = this.navParams.get('data');
  user: any = localStorage.getItem('userData');
  userlist: any;
  IS_SMS: any = false;
  IS_EMAIL: any = false;
  selectLabel: any = 'User';
  IS_CHECK: any = false;
  ischecked: boolean = false;
  lpocommentsdetailsall: any;
  audioList: any;
  passwordIcon: string = 'arrow-dropdown';
  filePath: string;
  lpo_no:any;

  pet: string = "Comments";
  tab_name: any;
  LpoaudioList: any;
  login_user_id: any;
  
  constructor(public platform: Platform, public navCtrl: NavController, public navParams: NavParams,
    private formBuilder: FormBuilder, private modal: ModalController,
    public authService: RestProvider, public toastCtrl: ToastController,
    public loadingCtrl: LoadingController, public view: ViewController,
    private streamingMedia: StreamingMedia
  ) {
    this.user = this.user ? JSON.parse(this.user) : {};
    this.lpocommentsForm = this.formBuilder.group({
      COMMENTS: ['', Validators.compose([Validators.required])],
      LPO_ID: ['', Validators.compose([Validators.required])],
      USER: [''],
      IS_SMS: [''],
      IS_EMAIL: ['']
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

  insertlpoComments(i: any) {

    let LpoCommentsData: any = this.lpocommentsForm.value;
    LpoCommentsData.created_by = this.user.UserInfoId;
    LpoCommentsData.modified_by = this.user.UserInfoId;
    LpoCommentsData.ReferenceType = 'LPO COMMENT';
    LpoCommentsData.user_type = this.user.resourseData.TYPE_USER;
    LpoCommentsData.user_name = this.user.Surname;
    
    let _valid = true;

    if (_valid) {
      LpoCommentsData.USER = JSON.stringify(LpoCommentsData.USER);
      this.presentLoadingDefault(true);
      this.authService.postData(LpoCommentsData, 'Lpo/LpoCommentsinsert').then((result) => {
        this.presentToast("Comments successfully saved");
        this.insertedValues = result;
        this.presentLoadingDefault(false);
        this.ionViewWillLoad();
      }, (err) => {
        this.presentLoadingDefault(false);
        this.presentToast(err);
      });
    }

  }

  ionViewWillLoad() {
    
    this.pet = "Comments";
    this.calldata = this.navParams.get('data');
    console.log(this.user.resourseData.TYPE_USER);
    console.log(this.calldata);
    this.lpo_no = this.calldata[0].LPO_ID;
    this.login_user_id = this.user.UserInfoId;
    this.getlpodetails();
    //this.getLpoAudioList();
    this.GetUserList();
  }

  showEscalation(e): void {
    console.log("checked: " + this.ischecked);

    if (this.ischecked) {
      this.lpocommentsdetails = this.lpocommentsdetailsall;
    } else {
      this.lpocommentsdetails = this.lpocommentsdetailsall.filter(x => x.SHOW_ESCALATION == 0);
    }
  }


  getlpodetails() {
    var LPO_ID = 0;
    if (this.calldata[0].LABEL_ID != null) {
      LPO_ID = this.calldata[0].LABEL_ID;
    } else if (this.calldata[0].LPO_ID != null) {
      LPO_ID = this.calldata[0].LPO_ID;
    }

    this.presentLoadingDefault(true);
    this.authService.getData({}, 'Lpo/getlpoCommentsDAL/' + LPO_ID).then((result: any) => {

      this.lpocommentsdetailsall = result.filter(lpo => lpo.COMMENTS != null && lpo.USER_SURNAME != null);
      this.lpocommentsdetails = this.lpocommentsdetailsall.filter(x => x.SHOW_ESCALATION == 0);
      console.log(this.lpocommentsdetails);
      this.presentLoadingDefault(false);

    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });

  }

  GetUserList() {
    this.authService.postData({ is_active: 1 }, 'account/GetSearchList').then((result) => {
      this.userlist = result;
      this.presentLoadingDefault(false);

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

  resetForm() {
    this.lpocommentsForm.reset();
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

  uploadAudio(i: number, data: any) {

    console.log(i, data);

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let myModalData = [{
      user_info_id: this.user.UserInfoId,
      comments_id: data.REFERENCE_ID,
      comments_child_id: data.COMMENT_ID,
      module_type: 'LPO',
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

    let lpoid = this.calldata[0].LPO_ID;

    let LpoCommentsData: any = this.lpocommentsForm.value;
    LpoCommentsData.created_by = this.user.UserInfoId;
    LpoCommentsData.modified_by = this.user.UserInfoId;
    LpoCommentsData.ReferenceType = 'LPO COMMENT';
    LpoCommentsData.COMMENTS = 'Recording'

    LpoCommentsData.USER = JSON.stringify(LpoCommentsData.USER);
    this.presentLoadingDefault(true);
    console.log(LpoCommentsData);

    this.authService.postData(LpoCommentsData, 'Lpo/LpoCommentsinsert').then((result) => {
      this.insertedValues = result;
      this.presentLoadingDefault(false);

      const myModalOptions: ModalOptions = {
        enableBackdropDismiss: false
      };

      let myModalData = [{
        user_info_id: this.user.UserInfoId,
        comments_id: lpoid,
        comments_child_id: result,
        module_type: 'LPO',
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
      module_name: 'LPO',
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
      //this.audio = this.media.create(this.filePath);
      this.streamingMedia.playAudio(this.filePath, options);
    } else if (this.platform.is('android')) {
      this.filePath = file_path;
      //this.audio = this.media.create(this.filePath);
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

  uploadReplyAudio(i: number, data: any,reply_id:any) {

    console.log(i, data);

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let myModalData = [{
      user_info_id: this.user.UserInfoId,
      comments_id: data.REFERENCE_ID,
      comments_child_id: data.COMMENT_ID,
      module_type: 'LPO',
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
      module_type: 'LPO',
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


  segmentChanged(event) {
    console.log(event.value);
    let tabValue = event.value;
    this.tab_name = event.value;
    if (tabValue == 'Comments') {
      this.getlpodetails();
    } else if (tabValue == 'Recording') {
      this.getLpoAudioList();
    } 
  }


  getLpoAudioList() {

    let client_name = '';
    let unit_no = '';

    let commentsData = {

      user_info_id: this.user.UserInfoId,
      comments_id: this.calldata[0].LPO_ID,
      comments_child_id: null,
      module_name: 'LPO',
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