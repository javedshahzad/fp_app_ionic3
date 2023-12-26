import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, ViewController } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';


@IonicPage()
@Component({
    selector: 'page-paymentrequestbill',
    templateUrl: 'paymentrequestbill.html',
})
export class PaymentRequestBillPage {
    paymentrequestbillForm: FormGroup
    requestdata = this.navParams.get('data');
    user: any = localStorage.getItem('userData');
    insertedValues: any;
    amount_val = 0;
    paymentbilldetailsall: any;
    constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder,
        public authService: RestProvider, public toastCtrl: ToastController,
        public loadingCtrl: LoadingController, public view: ViewController) {
        this.user = this.user ? JSON.parse(this.user) : {};
        this.paymentrequestbillForm = this.formBuilder.group({
            payment_request_id: ['', Validators.compose([Validators.required])],
            description: ['', Validators.compose([Validators.required])],
            amount: ['', Validators.compose([Validators.required])],
            mode_of_submission: ['', Validators.compose([Validators.required])],
            comments: ['', Validators.compose([Validators.required])]
        });

    }
    ionViewDidLoad() {
        //console.log(this.requestdata);
        this.getbill();
    }


    resetForm() {
        this.paymentrequestbillForm.reset();
    }

    presentToast(msg) {
        let toast = this.toastCtrl.create({
            message: msg,
            duration: 3000,
            position: 'middle'
        });
        toast.present();
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

    closeModal() {
        this.view.dismiss();
    }


    createpaymentrequestbill() {
        let createpaymentbilldata = this.paymentrequestbillForm.value;
        createpaymentbilldata.CREATED_BY = this.user.UserInfoId;
        createpaymentbilldata.PAYMENT_REQ_DATA = this.requestdata[0].PAYMENT_REQUEST_ID[0];
        createpaymentbilldata.old_amount = this.amount_val;
        createpaymentbilldata.STATUS = 2;
        //console.log(createpaymentbilldata);
        this.presentLoadingDefault(true);
        this.authService.postData(createpaymentbilldata, 'payment/CreatePaymentRequestBill').then((result) => {
            this.presentLoadingDefault(false);
            this.presentToast("Payment Request Created successfully");
            this.insertedValues = result;
            this.closeModal();
        }, (err) => {
            this.presentLoadingDefault(false);
            this.presentToast(err);
        });
    };

    getbill() {
        let myTitle = "Payment Request Bill";
        let payment_req_id = this.requestdata[0].PAYMENT_REQUEST_ID[0].PAYMENT_REQUEST_ID;
        this.presentLoadingDefault(true);
        this.authService.getData({}, 'payment/PaymentRequestBill/' + payment_req_id).then((result) => {
            this.paymentbilldetailsall = result;
            this.presentLoadingDefault(false);
            if (this.paymentbilldetailsall.length > 0) {
                let initialValue = 0;
                this.amount_val = this.paymentbilldetailsall.reduce(function (total, currentValue) {
                    return total + currentValue.AMOUNT;
                }, initialValue);
                //console.log(this.amount_val);
                //console.log(this.paymentbilldetailsall);
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
