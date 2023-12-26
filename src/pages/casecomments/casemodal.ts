import { Component } from '@angular/core';
import { IonicPage, Platform, NavController, NavParams, ToastController, ModalOptions, Modal, ModalController, LoadingController, ViewController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RestProvider } from '../../providers/rest/rest';
import { StreamingMedia, StreamingVideoOptions,StreamingAudioOptions  } from '@ionic-native/streaming-media';


@IonicPage()
@Component({
  selector: 'page-casemodal',
  templateUrl: 'casemodal.html',
})
export class CaseModalPage {
  casecommentsdetails: any;
  pushnotificationValues: any;
  casecommentsForm: FormGroup
  insertedValues: any;
  casemodaldata: any = this.navParams.get('data');
  Case: any;
  user: any = localStorage.getItem('userData');
  ischecked: boolean = false;
  casecommentsdetailsall: any;

  LpoaudioList:any;
  
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

  insertCaseComments() {
    let resourseData: any = localStorage.getItem('resourseData');
    resourseData = JSON.parse(resourseData);
    let casecommentsData = this.casecommentsForm.value;
    casecommentsData.user_name = this.user.Surname;
    casecommentsData.Ctype = 0;
    casecommentsData.userid = this.user.UserInfoId;
    casecommentsData.user_emp_id = this.user.UserEmployeeId;
    casecommentsData.Case = JSON.stringify(this.Case);
    casecommentsData.ResourseId = resourseData.RESOURCE_ID;
    this.presentLoadingDefault(true);
    this.authService.postData(casecommentsData, 'case_management/CaseCommentsinsert').then((result) => {
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
    let CASE_ID = Data[0].CASE_ID;
    this.Case = Data[0].CASE;
    this.presentLoadingDefault(true);
    this.authService.getData({}, 'case_management/CaseComments/' + CASE_ID).then((result) => {
      this.casecommentsdetailsall = result;
      this.casecommentsdetails = this.casecommentsdetailsall.filter(x=> x.SHOW_ESCALATION == 0);
      this.presentLoadingDefault(false);   
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });
  }

  showEscalation(e): void { 
  	console.log("checked: " + this.ischecked);

    if(this.ischecked){ 
        this.casecommentsdetails = this.casecommentsdetailsall;
    }else{
      this.casecommentsdetails = this.casecommentsdetailsall.filter(x=> x.SHOW_ESCALATION == 0);
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
      comments_id: data.CASH_ID,
      comments_child_id: data.ID,
      module_type: 'CASE',
      comment_created_by: data.CREATED_BY,
      payment_details: JSON.stringify(this.Case)
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
      this.ionViewWillLoad();
    } else if (tabValue == 'Recording') {
      this.getLpoAudioList();
    } 
  }


  getLpoAudioList() {

    const Data = this.navParams.get('data');
    let CASE_ID = Data[0].CASE_ID;

    let client_name = '';
    let unit_no = '';

    let commentsData = {

      user_info_id: this.user.UserInfoId,
      comments_id: CASE_ID,
      comments_child_id: null,
      module_name: 'CASE',
      unit_no: unit_no,
      client_name: client_name
    }

    this.presentLoadingDefault(true);
    this.authService.postData(commentsData, 'task/getRoiAndCommentsAudioListByType').then((result) => {
      this.LpoaudioList = result;
      console.log('Return Cheque Audio List', this.LpoaudioList);
      this.presentLoadingDefault(false);

    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
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
      module_type: 'CASE',
      comment_created_by: data.MODIFIED_BY,
      replied_from_id: reply_id,
      payment_details: JSON.stringify(this.Case)
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