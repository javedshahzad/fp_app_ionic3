import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, ViewController } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
/**
 * Generated class for the ReceiptPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-paymentrequestcreate',
    templateUrl: 'paymentrequestcreate.html',
})
export class PaymentRequestCreatePage {
    paymentrequestForm: FormGroup
    requestdata = this.navParams.get('data');
    user: any = localStorage.getItem('userData');
    insertedValues: any;
    transactiondata: any;
    display = 'none';
    modaldata: any;
    totalamt = 0;
    filtereddata = [] as any;
    constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder,
        public authService: RestProvider, public toastCtrl: ToastController,
        public loadingCtrl: LoadingController, public view: ViewController) {
        this.user = this.user ? JSON.parse(this.user) : {};
        this.paymentrequestForm = this.formBuilder.group({
            request_trans_id: ['', Validators.compose([Validators.required])],
            title: ['', Validators.compose([Validators.required])],
            description: ['', Validators.compose([Validators.required])],
            amount: ['', Validators.compose([Validators.required])],
            payee: ['', Validators.compose([Validators.required])],
            supplier: ['', Validators.compose([Validators.required])],
            mode_of_payment: ['', Validators.compose([Validators.required])],
            location: ['', Validators.compose([Validators.required])],
            comments: ['', Validators.compose([Validators.required])]
        });

    }
    ionViewDidLoad() {
        this.getTransactionType();
    }

    getTransactionType() {
        this.presentLoadingDefault(true);
        this.authService.getData({}, 'payment/TransactionType').then((result) => {
            this.transactiondata = result;
            this.presentLoadingDefault(false);
            // if (this.transactiondata.length > 0) {
            //     this.presentToast(`Data found in ${myTitle}`);
            // } else {
            //     this.presentToast(`No data found in ${myTitle}`);
            // }
        }, (err) => {
            this.presentLoadingDefault(false);
            this.presentToast(err);
        });
    }

    resetForm() {
        this.paymentrequestForm.reset();
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
    setamount(amount_type: any) {
        if (amount_type != "") {
            let amt = parseInt(amount_type);
            if (amt == 9) {
                this.modaldata = this.transactiondata.filter(item => item.TYPE_ID === amt);
                this.display = 'block';
            } else if (amt == 10) {
                this.modaldata = this.transactiondata.filter(item => item.TYPE_ID === amt);
                this.display = 'block';
            } else if (amt == 11) {
                this.modaldata = this.transactiondata.filter(item => item.TYPE_ID === amt);
                this.display = 'block';
            } else if (amt == 12) {
                this.modaldata = this.transactiondata.filter(item => item.TYPE_ID === amt);
                this.display = 'block';
            } else {
                this.display = 'none';
                for (var i = 0; i < 1; i++) {
                    for (var j = 0; j < this.transactiondata.length; j++) {
                        if (this.transactiondata[j].TYPE_ID == amt) {
                            this.filtereddata.push(this.transactiondata[j]);
                        }
                    }
                }
                this.totalamt=0;
                for (var z = 0; z < this.filtereddata.length; z++) {
                    this.totalamt += this.filtereddata[z].AMOUNT;
                }
                //console.log(this.totalamt);
            }
        }
    }
    add(transact_amt: any, transact_description: any, transact_number: any) {
        if (transact_number != "") {
            for (var k = 0; k < 1; k++) {
                for (var f = 0; f < this.transactiondata.length; f++) {
                    if (this.transactiondata[f].TYPE_ID == parseInt(transact_number)) {
                        let tr_data = this.transactiondata[f];
                        tr_data.DESCRIPTION = transact_description;
                        if(tr_data.TYPE_ID ==9){
                            tr_data.AMOUNT = parseInt(transact_amt);
                        }else{
                            tr_data.AMOUNT = (parseInt(transact_amt)/100)*tr_data.PERCENTAGE;
                        }
                        this.filtereddata.push(tr_data);
                    }
                }
            }
            this.totalamt=0;
            for (var z = 0; z < this.filtereddata.length; z++) {
                this.totalamt += this.filtereddata[z].AMOUNT;
            }
            // console.log(this.filtereddata);
            // console.log(this.totalamt);
        }

    }
    removefiltereddata(type_id: any) {
        this.filtereddata = this.filtereddata.filter(item => item.TYPE_ID != type_id);
        this.totalamt=0;
        for (var h = 0; h < this.filtereddata.length; h++) {
            this.totalamt += this.filtereddata[h].AMOUNT;
        }
    }

    createpaymentrequest(){
        let myTitle = 'Payment Request';
        let createpaymentdata  = this.paymentrequestForm.value;
        createpaymentdata.created_by = this.user.UserInfoId;
        createpaymentdata.transaction_values = this.filtereddata;
       // console.log(createpaymentdata);
        this.presentLoadingDefault(true);
    this.authService.postData(createpaymentdata,'payment/CreatePaymentRequest').then((result) => {
      this.presentLoadingDefault(false);
      this.presentToast(`${myTitle} Created successfully`);
      this.insertedValues = result;
      this.closeModal();
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
