import { Component } from '@angular/core';
import { IonicPage, Platform, NavController, NavParams, ToastController,  ModalOptions, Modal, ModalController, LoadingController, ViewController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RestProvider } from '../../providers/rest/rest';

@IonicPage()
@Component({
  selector: 'page-hotocomment',
  templateUrl: 'hotocomment.html',
})

export class HotoCommentPage {
  hotocommentsdetails: any;
  pushnotificationValues: any;
  hotocommentsForm: FormGroup
  insertedValues: any;
  hotodata = this.navParams.get('data');
  user: any = localStorage.getItem('userData');
  ischecked: boolean = false;
  hotocommentsdetailsall: any;

  constructor(public platform: Platform, public navCtrl: NavController,
    public navParams: NavParams, private formBuilder: FormBuilder,
    public authService: RestProvider, public toastCtrl: ToastController,
    public loadingCtrl: LoadingController, public view: ViewController,
    private modal: ModalController
  ) {
    this.user = this.user ? JSON.parse(this.user) : {};
    this.hotocommentsForm = this.formBuilder.group({
      COMMENTS: ['', Validators.compose([Validators.required])],
      LEASE_NUMBER: ['', Validators.compose([Validators.required])],
      HOTO_ID: ['']
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

  inserthotoComments() {
    let hotocommentsData = this.hotocommentsForm.value;
    hotocommentsData.Ctype = 0;
    hotocommentsData.USERNAME = this.user.Surname;
    hotocommentsData.USER_INFO_ID = this.user.UserInfoId;
    this.presentLoadingDefault(true);
    this.authService.postData(hotocommentsData, 'hoto/Hotocommentsinsert').then((result) => {
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
      push_message.message = this.hotocommentsForm.value.COMMENTS;
      push_message.app_platform = app_platform;

      // this.authService.postData(push_message, 'pushnotification/pushnotificationsend').then((result) => {
      //   this.presentLoadingDefault(false);
      //   this.pushnotificationValues = result;
      // }, (err) => {
      //   this.presentLoadingDefault(false);
      //   this.presentToast(err);
      // });

    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });
  }

  ionViewWillLoad() {
    const Data = this.navParams.get('data');
    let LEASE_NUM = Data[0].LEASE_NUM;
    this.presentLoadingDefault(true);
    this.authService.getData({}, 'hoto/HotoCommentsList/' + LEASE_NUM).then((result) => {
      this.hotocommentsdetailsall = result;
      this.hotocommentsdetails = this.hotocommentsdetailsall.filter(x => x.SHOW_ESCALATION == 0);
      this.presentLoadingDefault(false);

    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });

  }

  showEscalation(e): void {
    console.log("checked: " + this.ischecked);

    if (this.ischecked) {

      this.hotocommentsdetails = this.hotocommentsdetailsall;
    } else {
      this.hotocommentsdetails = this.hotocommentsdetailsall.filter(x => x.SHOW_ESCALATION == 0);
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
      comments_child_id: data.LDC_ID,
      module_type: 'HOTO'
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
    let LEASE_NUM = Data[0].LEASE_NUM;

    let hotocommentsData = this.hotocommentsForm.value;
    hotocommentsData.Ctype = 0;
    hotocommentsData.USERNAME = this.user.Surname;
    hotocommentsData.USER_INFO_ID = this.user.UserInfoId;
    hotocommentsData.COMMENTS = 'Recording';
    console.log(hotocommentsData);

    this.presentLoadingDefault(true);
    this.authService.postData(hotocommentsData, 'hoto/getInsertHotoCommentsWhileAudioRecording').then((result) => {      
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
        module_type: 'HOTO'
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