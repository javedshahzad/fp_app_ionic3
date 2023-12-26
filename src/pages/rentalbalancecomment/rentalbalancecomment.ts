import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, ModalOptions, Modal, ModalController, ViewController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RestProvider } from '../../providers/rest/rest';

@IonicPage()
@Component({
  selector: 'page-rentalbalancecomment',
  templateUrl: 'rentalbalancecomment.html',
})
export class RentalBalanceCommentPage {
  rentcommentsdetails: any
  rentcommentsForm: FormGroup
  RENT_DATA: any;
  insertedValues: any;
  rentdata = this.navParams.get('data');
  user: any = localStorage.getItem('userData');
  rdata: any = localStorage.getItem('resourseData');

  constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder,
    public authService: RestProvider, public toastCtrl: ToastController,
    public loadingCtrl: LoadingController, public view: ViewController,
    private modal: ModalController
    ) {
    this.user = this.user ? JSON.parse(this.user) : {};
    this.rentcommentsForm = this.formBuilder.group({
      COMMENTS: ['', Validators.compose([Validators.required])],
      LEASE_NUM: ['',Validators.compose([Validators.required])]
    });
    this.rdata = this.rdata ? JSON.parse(this.rdata) : { TYPE_USER: null };
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

  insertrentComments() {
    let rentcommentsData = this.rentcommentsForm.value;
    rentcommentsData.user_name = this.user.Surname;
    rentcommentsData.created_by = this.user.UserInfoId;
    rentcommentsData.modified_by = this.user.UserInfoId;
    console.log(rentcommentsData);
    this.presentLoadingDefault(true);
    this.authService.postData(rentcommentsData, 'rent/getInsertRentalBalanceComment').then((result) => {
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
    
    //let myTitle = 'Rent Comments';

    const Data       = this.navParams.get('data');
    let LEASE_NUM    = Data[0].LEASE_NUM;
    let push_message = {} as any;
    push_message.LEASE_NUM = LEASE_NUM;

    this.presentLoadingDefault(true);
    this.authService.postData(push_message, 'rent/getRentalBalanceComments').then((result) => {
      this.rentcommentsdetails = result;
      this.presentLoadingDefault(false);
      
    }, (err) => {
      this.presentLoadingDefault(false);
      //   console.log(err);
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
    comments_id: data.REFERENCE_ID,
    comments_child_id: data.COMMENT_ID,
    module_type: 'RENT BALANCE'
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

  const Data       = this.navParams.get('data');
  let LEASE_NUM    = Data[0].LEASE_NUM;

  
  let resourseData: any = localStorage.getItem('resourseData');

  let rentcommentsData = this.rentcommentsForm.value;
    rentcommentsData.modified_by = this.user.UserInfoId;
    rentcommentsData.modified_by = this.user.UserInfoId;
    rentcommentsData.ReferenceType = 'RentBal COMMENT';
    rentcommentsData.ResourseData = resourseData;
    rentcommentsData.COMMENTS = 'Recording';
    rentcommentsData.PAYMENT_REQUEST_ID = LEASE_NUM;

  console.log(rentcommentsData);

  this.presentLoadingDefault(true);
  this.authService.postData(rentcommentsData, 'payment/getInsertFinancePaymentCommentsWhileAudioRecording').then((result) => {      
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
      module_type: 'RENT BALANCE'
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