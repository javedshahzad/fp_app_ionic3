import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, Modal, ModalController, ModalOptions, ViewController } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';


@IonicPage()
@Component({
  selector: 'page-registeredcalllabels',
  templateUrl: 'registeredcalllabels.html',
})
export class RegisteredCallPage {

  callManagementDetails: any;
  callcommentsForm: FormGroup
  CallinspectionList: any;
  ENTERED_COUNT: any;
  REGISTERED_COUNT: any;
  MANAGER_APPROVAL: any;
  CLIENT_APPROVAL: any;
  NOT_MANAGER_APPROVAL: any;
  Callinspectionoption: any;
  SearchListall: any;
  not_startlist: any;

  searchData = { "search_value": "" };
  user: any = localStorage.getItem('userData');
  resourse: any = JSON.parse(localStorage.getItem('resourseData'));

  constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder,
    public authService: RestProvider, public toastCtrl: ToastController, private modal: ModalController,
    public loadingCtrl: LoadingController, public view: ViewController) {
    this.user = this.user ? JSON.parse(this.user) : {};
    this.callcommentsForm = this.formBuilder.group({
      Comments: ['', Validators.compose([Validators.required])]
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

  ngOnInit() {
    this.Callinspectiondata();
  }

  Callinspectiondata() {
    this.presentLoadingDefault(true);

    let data = {
      Resoursename: this.resourse.EMPNAME,
      TYPE_ID: this.resourse.TYPE_ID
    }

    this.authService.postData(data, 'Call_inspection/CallinspectionList/').then((result) => {
      this.presentLoadingDefault(false);
      this.CallinspectionList = result;
      this.callManagementDetails = result;
      if (this.CallinspectionList.length > 0) {
        this.getength();
        // this.Closedcalldata();
      } else {
        this.presentLoadingDefault(false);
      }
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });
  }

  getength() {
    let REGISTERED = this.CallinspectionList.filter(call => call.TYPE_NAME == 'REGISTERED');
    let ENTERED = this.CallinspectionList.filter(call => call.TYPE_NAME == 'ENTERED');

    if (REGISTERED.length > 0) {
      this.REGISTERED_COUNT = REGISTERED[0].STATUS_COUNT;
    } else {
      this.REGISTERED_COUNT = 0;
    }

    if (ENTERED.length > 0) {
      this.ENTERED_COUNT = ENTERED[0].STATUS_COUNT;
    } else {
      this.ENTERED_COUNT = 0;
    }

  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'middle'
    });
    toast.present();
  }

  goBack() {
    this.view.dismiss();
  }


  resetForm() {
    this.navCtrl.setRoot(this.navCtrl.getActive().component);
  }

  Entered() {
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let mymodaldata = [{
      STATUS_ID: 232,
      TYPE_ID: this.resourse.TYPE_ID,
    }]

    const myModal: Modal = this.modal.create('callconfirmationpage', { data: mymodaldata }, myModalOptions);

    myModal.present();

    myModal.onDidDismiss(() => {
      console.log("I have dismissed.");
    });

    myModal.onWillDismiss(() => {
      console.log("I'm about to dismiss");
    });

  }

  Registered() {
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let mymodaldata = [{
      STATUS_ID: 233,
      TYPE_ID: this.resourse.TYPE_ID,
    }]

    const myModal: Modal = this.modal.create('callconfirmationpage', { data: mymodaldata }, myModalOptions);

    myModal.present();

    myModal.onDidDismiss(() => {
      console.log("I have dismissed.");
    });

    myModal.onWillDismiss(() => {
      console.log("I'm about to dismiss");
    });

  }


  SearchcallManagement() {
    if (this.searchData.search_value) {
      this.presentLoadingDefault(true);
      this.authService.postData(this.searchData, 'Call_inspection/getCallSearchList').then((result) => {
        this.SearchListall = result;
        //console.log(this.SearchListall);
        if (this.SearchListall[0].STATUS_ID == 237) {
          if (this.SearchListall[0].INTERM_STATUS_ID == 246) {
            let data = {
              Resoursename: this.resourse.EMPNAME,
              INTERM_STATUS_ID: 246,
              TYPE_ID: this.resourse.TYPE_ID,

            }
            this.authService.postData(data, 'Call_inspection/getAllCallList/').then((result) => {
              this.presentLoadingDefault(false);
              this.not_startlist = result;
              var item = parseInt(this.searchData.search_value);
              var finallist = [];
              if (isNaN(item)) {
                finallist.push(this.not_startlist.filter(call => call.REQUESTOR_NAME === this.searchData.search_value));
              } else {
                finallist.push(this.not_startlist.filter(call => call.CALL_LOG_ID === item));
              }
              const myModalOptions: ModalOptions = {
                enableBackdropDismiss: false
              };

              let mymodaldata = [{
                inspection: finallist[0]
              }]

              const myModal: Modal = this.modal.create('callestimationpage', { data: mymodaldata }, myModalOptions);

              myModal.present();

              myModal.onDidDismiss(() => {
                console.log("I have dismissed.");
              });

              myModal.onWillDismiss(() => {
                console.log("I'm about to dismiss");
              });

            }, (err) => {
              this.presentLoadingDefault(false);
              this.presentToast(err);
            });
          } else if (this.SearchListall[0].INTERM_STATUS_ID == 247) {
            let data = {
              Resoursename: this.resourse.EMPNAME,
              INTERM_STATUS_ID: 247,
              TYPE_ID: this.resourse.TYPE_ID
            }
            this.authService.postData(data, 'Call_inspection/getAllCallList/').then((result) => {
              this.presentLoadingDefault(false);
              this.not_startlist = result;
              var item = parseInt(this.searchData.search_value);
              var finallist = [];
              if (isNaN(item)) {
                finallist.push(this.not_startlist.filter(call => call.REQUESTOR_NAME === this.searchData.search_value));
              } else {
                finallist.push(this.not_startlist.filter(call => call.CALL_LOG_ID === item));
              }
              const myModalOptions: ModalOptions = {
                enableBackdropDismiss: false
              };

              let mymodaldata = [{
                inspection: finallist[0]
              }]

              const myModal: Modal = this.modal.create('callestimationpage', { data: mymodaldata }, myModalOptions);

              myModal.present();

              myModal.onDidDismiss(() => {
                console.log("I have dismissed.");
              });

              myModal.onWillDismiss(() => {
                console.log("I'm about to dismiss");
              });

            }, (err) => {
              this.presentLoadingDefault(false);
              this.presentToast(err);
            });
          } else if (this.SearchListall[0].INTERM_STATUS_ID == 248) {
            let data = {
              Resoursename: this.resourse.EMPNAME,
              INTERM_STATUS_ID: 248,
              TYPE_ID: this.resourse.TYPE_ID
            }
            this.authService.postData(data, 'Call_inspection/getAllCallList/').then((result) => {
              this.presentLoadingDefault(false);
              this.not_startlist = result;
              var item = parseInt(this.searchData.search_value);
              var finallist = [];
              if (isNaN(item)) {
                finallist.push(this.not_startlist.filter(call => call.REQUESTOR_NAME === this.searchData.search_value));
              } else {
                finallist.push(this.not_startlist.filter(call => call.CALL_LOG_ID === item));
              }
              const myModalOptions: ModalOptions = {
                enableBackdropDismiss: false
              };

              let mymodaldata = [{
                inspection: finallist[0]
              }]

              const myModal: Modal = this.modal.create('callestimationpage', { data: mymodaldata }, myModalOptions);

              myModal.present();

              myModal.onDidDismiss(() => {
                console.log("I have dismissed.");
              });

              myModal.onWillDismiss(() => {
                console.log("I'm about to dismiss");
              });

            }, (err) => {
              this.presentLoadingDefault(false);
              this.presentToast(err);
            });
          } else if (this.SearchListall[0].INTERM_STATUS_ID == 249) {
            let data = {
              Resoursename: this.resourse.EMPNAME,
              INTERM_STATUS_ID: 249,
              TYPE_ID: this.resourse.TYPE_ID,
            }
            this.authService.postData(data, 'Call_inspection/getAllCallList/').then((result) => {
              this.presentLoadingDefault(false);
              this.not_startlist = result;
              var item = parseInt(this.searchData.search_value);
              var finallist = [];
              if (isNaN(item)) {
                finallist.push(this.not_startlist.filter(call => call.REQUESTOR_NAME === this.searchData.search_value));
              } else {
                finallist.push(this.not_startlist.filter(call => call.CALL_LOG_ID === item));
              }
              const myModalOptions: ModalOptions = {
                enableBackdropDismiss: false
              };

              let mymodaldata = [{
                inspection: finallist[0]
              }]

              const myModal: Modal = this.modal.create('callestimationpage', { data: mymodaldata }, myModalOptions);

              myModal.present();

              myModal.onDidDismiss(() => {
                console.log("I have dismissed.");
              });

              myModal.onWillDismiss(() => {
                console.log("I'm about to dismiss");
              });

            }, (err) => {
              this.presentLoadingDefault(false);
              this.presentToast(err);
            });
          }
        } else {
          this.presentLoadingDefault(false);
          this.presentToast("No found data");
        }
      }, (err) => {
        this.presentLoadingDefault(false);
        this.presentToast(err);
      });
    } else if (this.searchData.search_value == '') {
      this.presentLoadingDefault(false);
    } else {
      this.presentLoadingDefault(false);
      this.SearchListall;
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
