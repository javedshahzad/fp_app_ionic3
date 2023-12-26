import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, Modal, ModalController, ModalOptions, ViewController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RestProvider } from '../../providers/rest/rest';
import Swal from 'sweetalert2'
import { CallmanagementPage } from '../callmanagement/callmanagement';


@IonicPage()
@Component({
  selector: 'page-callconfrmation',
  templateUrl: 'callconfrmation.html',
})
export class callconfirmationpage {
  lpocommentsdetails: any
  lpocommentsForm: FormGroup
  insertedValues: any;
  calldata: any
  departmentdata: any;
  userinfodata: any;
  Callprocurementvalue: any;
  searchData = { "search_value": "" };
  Callprocurement = this.navParams.get('data');
  user: any = localStorage.getItem('userData');
  resourse: any = JSON.parse(localStorage.getItem('resourseData'));
  constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder,
    public authService: RestProvider, public toastCtrl: ToastController, private modal: ModalController,
    public loadingCtrl: LoadingController, public view: ViewController) {
    this.user = this.user ? JSON.parse(this.user) : {};
    this.lpocommentsForm = this.formBuilder.group({
      COMMENTS: ['', Validators.compose([Validators.required])],
      LPO_ID: ['', Validators.compose([Validators.required])],
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


  ionViewWillLoad() {
    this.getregisterdata();
  }
  getregisterdata() {
    this.presentLoadingDefault(true);

    let Data = this.navParams.get('data');
    console.log(Data);
    
    let arr_data = {
      Resoursename: this.resourse.EMPNAME,
      STATUS_ID: Data[0].STATUS_ID,
      INTERM_STATUS_ID: Data[0].STATUS_ID,
      TYPE_ID: this.resourse.TYPE_ID
    }

    this.authService.postData(arr_data, 'Call_inspection/AllCallList').then((result) => {
      this.presentLoadingDefault(false);
      this.Callprocurementvalue = result;
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });
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
  
  openModalinspection(CALL_LOG_ID: any, STATUS_NAME: any, STATUS_ID: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to Confirmated Data!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, confirm!',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        Swal.fire(
          'Updated',
          'Your data is Confirmated.',
          'success'
        )
        let CallInspectionData = this.lpocommentsForm.value;
        CallInspectionData.CALL_LOG_ID = CALL_LOG_ID;
        CallInspectionData.STATUS_NAME = STATUS_NAME;
        CallInspectionData.STATUS_ID = STATUS_ID;
        CallInspectionData.modified_by = this.user.UserInfoId;
        this.presentLoadingDefault(true);
        this.authService.postData(CallInspectionData, 'Call_inspection/CALLLOG_CONFRIM').then((result) => {
          this.navCtrl.setRoot(CallmanagementPage);
          this.presentLoadingDefault(false);
          this.presentToast("Updated successfully");
          // console.log('List ',this.insertedValues);
        }, (err) => {
          this.presentLoadingDefault(false);
          this.presentToast(err);
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Your data is not Confirmated)',
          'error'
        )
      }
    });
  }


  openModal(CALL_LOG_ID: any, STATUS_NAME: any, REQUESTOR_NAME: any) {

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    const myModalData = [{
      CALL_LOG_ID: CALL_LOG_ID,
      STATUS_NAME: STATUS_NAME,
      REQUESTOR_NAME: REQUESTOR_NAME
    }];

    const myModal: Modal = this.modal.create('callcomments', { data: myModalData }, myModalOptions);

    myModal.present();

    myModal.onDidDismiss((data) => {     
    });

  }

  openupdateinspection(item = [] as any) {

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    const myModalData = [{
      confirmationdetails: item
    }];
    const myModal: Modal = this.modal.create('confirmationdetails', { data: myModalData }, myModalOptions);

    myModal.present();

    myModal.onDidDismiss((data) => {
      /* console.log("I have dismissed.");
       console.log(data); */
    });

    myModal.onWillDismiss((data) => {
      /* console.log("I'm about to dismiss");
       console.log(data); */
    });

  }


  SearchcallManagement() {

    let call_id = parseInt(this.searchData.search_value);
    let item = this.searchData.search_value;
    if (item != '') {
      if (isNaN(call_id)) {
        this.Callprocurementvalue = this.Callprocurement[0].inspection.filter(call => (call.REQUESTOR_NAME ? call.REQUESTOR_NAME.includes(item) : false));
      } else if (!isNaN(call_id)) {
        this.Callprocurementvalue = this.Callprocurement[0].inspection.filter(call => call.CALL_LOG_ID === call_id);
      }
    } else {
      this.Callprocurementvalue = this.Callprocurement[0].inspection;
    }
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