import { Component } from '@angular/core';
import { IonicPage, Platform, NavController, NavParams, ToastController, LoadingController, ViewController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RestProvider } from '../../providers/rest/rest';


@IonicPage()
@Component({
    selector: 'page-callmanagementcomment',
    templateUrl: 'callmanagementcomment.html',
})

export class CallManagementCommentPage {
    callmanagementcommentsdetails: any;
    pushnotificationValues: any;
    callmanagementcommentsForm: FormGroup
    insertedValues: any;
    callmanagementdata = this.navParams.get('data');
    user: any = localStorage.getItem('userData');
    constructor(public platform: Platform,public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder,
        public authService: RestProvider, public toastCtrl: ToastController,
        public loadingCtrl: LoadingController, public view: ViewController) {
        this.user = this.user ? JSON.parse(this.user) : {};
        this.callmanagementcommentsForm = this.formBuilder.group({
            COMMENTS: ['', Validators.compose([Validators.required])],
            CALL_LOG_ID: ['', Validators.compose([Validators.required])],
            STATUS_NAME: ['', Validators.compose([Validators.required])]
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

    insertcallmanagementComments() {
        let callcommentsData = this.callmanagementcommentsForm.value;
        callcommentsData.user_name = this.user.Surname;
        callcommentsData.Ctype = 0;
        callcommentsData.userid = this.user.UserInfoId;
        callcommentsData.user_emp_id = this.user.UserEmployeeId;
        this.presentLoadingDefault(true);
        this.authService.postData(callcommentsData, 'call_management/CallCommentsinsert').then((result) => {
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
            push_message.message = this.callmanagementcommentsForm.value.COMMENTS;
            push_message.app_platform = app_platform;

            this.authService.postData(push_message, 'pushnotification/pushnotificationsend').then((result) => {
                this.presentLoadingDefault(false);
                this.pushnotificationValues = result;
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
    //    console.log(this.callmanagementdata);
        const Data = this.navParams.get('data');
        let myTitle = 'Call Management Comments';
        let CALL_LOG_ID = Data[0].CALL_LOG_ID;
        this.presentLoadingDefault(true);
        this.authService.getData({}, 'call_management/CallManagementcomments/' + CALL_LOG_ID).then((result) => {
            this.callmanagementcommentsdetails = result;
            this.presentLoadingDefault(false);
            if (this.callmanagementcommentsdetails.length == 0) {
                this.presentToast(`No data found in ${myTitle}`);
            }
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
