import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, ViewController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RestProvider } from '../../providers/rest/rest';


@IonicPage()
@Component({
    selector: 'page-financecomment',
    templateUrl: 'financecomments.html',
})
export class FinanceCommentPage {
    financecommentsdetails: any
    financecommentsForm: FormGroup
    insertedValues: any;
    financedata = this.navParams.get('data');
    user: any = localStorage.getItem('userData');
    constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder,
        public authService: RestProvider, public toastCtrl: ToastController,
        public loadingCtrl: LoadingController, public view: ViewController) {
        this.user = this.user ? JSON.parse(this.user) : {};
        this.financecommentsForm = this.formBuilder.group({
            COMMENTS: ['', Validators.compose([Validators.required])],
            PAYREQ_ID: ['', Validators.compose([Validators.required])]
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
    insertchequeComments() {
        let financecommentsData = this.financecommentsForm.value;
        financecommentsData.USERNAME = this.user.Surname;
        financecommentsData.userid = this.user.UserInfoId;
        financecommentsData.CREATED_BY = this.user.UserInfoId;
        financecommentsData.MODIFIED_BY = this.user.UserInfoId;
        financecommentsData.user_type = this.user.resourseData.TYPE_USER;
        financecommentsData.user_name = this.user.Surname;

        this.presentLoadingDefault(true);
        this.authService.postData(financecommentsData, 'finance/financecommentsinsert').then((result) => {
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
        const Data = this.navParams.get('data');
        let myTitle = 'Finance Comments';
        let PAYREQ_ID = Data[0].PAYREQ_ID;
        this.presentLoadingDefault(true);
        this.authService.getData({}, 'finance/FinanceCommentsList/' + PAYREQ_ID).then((result) => {
            this.financecommentsdetails = result;
            this.presentLoadingDefault(false);
            if (this.financecommentsdetails.length > 0) {
                this.presentLoadingDefault(false);
                //this.presentToast(`Data found in ${myTitle}`);
            } else {
                this.presentLoadingDefault(false);
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
        } else {
            loading.dismissAll();
            loading = null
        }
    }

}