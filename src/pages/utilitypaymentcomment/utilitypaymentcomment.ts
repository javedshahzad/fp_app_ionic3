import { Component } from '@angular/core';
import { IonicPage, Platform, NavController, NavParams, ToastController, ModalOptions, Modal, ModalController, LoadingController, ViewController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RestProvider } from '../../providers/rest/rest';
import { CallNumber } from '@ionic-native/call-number';

@IonicPage()
@Component({
  selector: 'page-utilitypaymentcomment',
  templateUrl: 'utilitypaymentcomment.html',
})

export class UtilityPaymentCommentPage {

  paymentcommentsdetails: any;
  pushnotificationValues: any;
  paymentcommentsForm: FormGroup
  insertedValues: any;
  payment_req_data = this.navParams.get('data');
  user: any = localStorage.getItem('userData');
  userlist: any;

  constructor(public platform: Platform, public navCtrl: NavController, public navParams: NavParams, 
    private formBuilder: FormBuilder, public authService: RestProvider, public toastCtrl: ToastController, 
    private callNumber: CallNumber, public loadingCtrl: LoadingController, public view: ViewController,
    private modal: ModalController
    ) {
    this.user = this.user ? JSON.parse(this.user) : {};
    this.paymentcommentsForm = this.formBuilder.group({
      COMMENTS: ['', Validators.compose([Validators.required])]
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

    const Data = this.navParams.get('data');

    let paymentcommentsData = this.paymentcommentsForm.value;
    paymentcommentsData.CREATED_BY = this.user.UserInfoId;
    paymentcommentsData.MODIFIED_BY = this.user.UserInfoId;
    paymentcommentsData.groupid = Data[0].groupid;
    paymentcommentsData.user_name = this.user.Surname;

    let _valid = true;

    if (_valid) {
      this.presentLoadingDefault(true);
      this.authService.postData(paymentcommentsData, 'utility/getUtilityCommentsInsert').then((result) => {
        this.presentLoadingDefault(false);
        this.presentToast("Comments successfully saved");
        this.insertedValues = result;
        this.closeModal();
      }, (err) => {
        this.presentLoadingDefault(false);
        this.presentToast(err);
      });
    }
  }

  ionViewWillLoad() {

    const Data = this.navParams.get('data');
    this.presentLoadingDefault(true);
    this.authService.postData(Data[0], 'utility/getUtilityPaymentComments').then((result) => {
      this.paymentcommentsdetails = result;
      this.presentLoadingDefault(false);
      console.log(this.paymentcommentsdetails);

    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });

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
      comments_id: data.GROUP_ID,
      comments_child_id: data.UTILITY_COMMENTS_ID,
      module_type: 'UTILITY'
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

    let paymentcommentsData = this.paymentcommentsForm.value;
    paymentcommentsData.CREATED_BY = this.user.UserInfoId;
    paymentcommentsData.MODIFIED_BY = this.user.UserInfoId;
    paymentcommentsData.groupid = Data[0].groupid;
    paymentcommentsData.user_name = this.user.Surname;
    paymentcommentsData.COMMENTS = 'Recording';
    console.log(paymentcommentsData);

    this.presentLoadingDefault(true);
    this.authService.postData(paymentcommentsData, 'utility/getInsertUtilityCommentsWhileAudioRecording').then((result) => {
      this.insertedValues = result;
      console.log(result);
      this.presentLoadingDefault(false);

      const myModalOptions: ModalOptions = {
        enableBackdropDismiss: false
      };

      let myModalData = [{
        user_info_id: this.user.UserInfoId,
        comments_id: Data[0].groupid,
        comments_child_id: result,
        module_type: 'UTILITY'
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