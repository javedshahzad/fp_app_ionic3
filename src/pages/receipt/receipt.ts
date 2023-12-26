import { Component } from '@angular/core';
import { NavController, NavParams,ToastController,LoadingController,ViewController } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { FormGroup,FormBuilder,Validators } from '@angular/forms';
import { SearchPage } from '../search/search';

@Component({
  selector: 'page-receipt',
  templateUrl: 'receipt.html',
})
export class ReceiptPage {
receiptForm:FormGroup
user : any = localStorage.getItem('userData');
  buildingList: any;
  insertedValues: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder,
              public authService:RestProvider, public toastCtrl:ToastController,
              public loadingCtrl: LoadingController, public view: ViewController) { 
      this.user = this.user ? JSON.parse(this.user) : {};  
        this.receiptForm = this.formBuilder.group({
          isSecChq:[],
          cash_chq: [],
          buidling: ['', Validators.compose([Validators.required])],
          amount: ['', Validators.compose([Validators.required])],
          receivedfrom: ['', Validators.compose([Validators.required])],
          remarks: ['', Validators.compose([Validators.required])],
          chqno: ['', Validators.compose([Validators.required,Validators.minLength(6), Validators.maxLength(10)])],
          chequedate: ['', Validators.compose([Validators.required])],
          unitno: ['', Validators.compose([Validators.required])],
          mobile_number: ['', Validators.compose([Validators.required,Validators.minLength(9), Validators.maxLength(10)])],
          email: ['', Validators.compose([Validators.required, Validators.email])]
        });
  }
  ionViewDidLoad() {
    this.presentLoadingDefault(true);
    this.authService.getData({}, 'receipts/getBuildingListDetails').then((result) => {
      this.presentLoadingDefault(false);
      this.buildingList = result;
      if (this.buildingList.length > 0) {
       // console.log('List ', this.buildingList);        
      } else {
        this.presentToast("No data found.");
      }
    }, (err) => {
      this.presentToast(err);
    });
  }

  getValidation(){

  }
 inValidCashChq:boolean = false;
  validReceiptData(){
    let receiptData = this.receiptForm.value;
    if(receiptData.isSecChq){
      receiptData.cash_chq = 0;
     // console.log(this.receiptForm.value);
       this.insertReceiptData(receiptData)
    }else{
      if( receiptData.cash_chq){
       this.insertReceiptData(receiptData)       
      //  console.log(this.receiptForm.value);
      }
      else{
        this.inValidCashChq =true
        this.presentToast("Please select Cheque or Cash");
      }
    }
    // this.authService.postData(this.receiptData,'receipts/getInsertReceiptDetails').then((result) => {
    //   this.insertedValues = result;
    //   debugger;     
    //   console.log('List ',this.insertedValues);
    // }, (err) => {
    //   this.presentToast(err);
    // });
  }
  insertReceiptData(receiptData){    
    receiptData.status= "1"; 
    receiptData.created_on= "";
    receiptData.created_by= this.user.USER_INFO_ID, 
    this.presentLoadingDefault(true);
    this.authService.postData(receiptData,'receipts/getInsertReceiptDetails').then((result) => {
      this.presentLoadingDefault(false);
      this.presentToast("Receipt successfully saved");
      this.insertedValues = result;
     this.resetForm()  ;
     // console.log('List ',this.insertedValues);
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });
  }
  resetForm(){
    this.receiptForm.reset();
    this.navCtrl.push(SearchPage, {}, {animate: false});
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
    if(!this.loading){
      this.loading = this.loadingCtrl.create(); 
    }  
    if(show){
      this.loading.present();
    }
    else{
      this.loading.dismissAll();
      this.loading =null
    }
  };

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
