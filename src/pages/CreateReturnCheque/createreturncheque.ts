import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,LoadingController,ViewController } from 'ionic-angular';
import { FormGroup,FormBuilder,Validators } from '@angular/forms';
import { RestProvider } from '../../providers/rest/rest';
import { SelectSearchableComponent } from 'ionic-select-searchable';


/**
 * Generated class for the ModalPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-createreturncheque',
  templateUrl: 'createreturncheque.html',
})
export class CreateReturnChequePage {
  @ViewChild('myselect')selectComponent:SelectSearchableComponent;
  returnchequereasons: any;
  returnchequeForm:FormGroup;
  return_reasons:any;
  display_add = 'block';
  display_reason = 'none';
  Reason_return:String;
    insertedValues: any;
    chequedata =this.navParams.get('data');
    user : any = localStorage.getItem('userData');
    constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder,
        public authService:RestProvider, public toastCtrl:ToastController,
        public loadingCtrl: LoadingController, public view: ViewController) {
            this.user = this.user ? JSON.parse(this.user) : {};  
            this.returnchequeForm = this.formBuilder.group({
              RETURN_REASON:['', Validators.compose([Validators.required])],
              CASH_RECEIPT_ID: ['', Validators.compose([Validators.required])]
            });
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
  updatechequelist(){
    let chequereturnData = this.returnchequeForm.value;
    chequereturnData.user_name = this.user.Surname;
    this.presentLoadingDefault(true);
    this.authService.postData(chequereturnData,'cheque/ChequeFlagUpdate').then((result) => {
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
    let myTitle = 'Reasons';
    this.presentLoadingDefault(true);
    this.authService.getData({},'cheque/Return_Reasons').then((result) => {
      this.returnchequereasons = result;
      this.return_reasons = result;
      this.presentLoadingDefault(false);
      if(this.returnchequereasons.length > 0){
        this.presentLoadingDefault(false);
        console.log(this.returnchequereasons);
      this.presentToast(`Data found in ${myTitle}`);
      }else{
        this.presentLoadingDefault(false);
        this.presentToast(`No data found in ${myTitle}`);
      }
    }, (err) => {
      this.presentLoadingDefault(false);
    this.presentToast(err);
    });
    
  }
  resetForm(){
    this.navCtrl.setRoot(this.navCtrl.getActive().component);
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position:'middle'
    });
    toast.present();
  }
  closeModal() {
    this.view.dismiss();
  }

  userChanged(event:{component:SelectSearchableComponent,value:any}){
    console.log('event',event);

  }
  open_reason(type:any){
    if(type=="select"){
      this.returnchequereasons = this.return_reasons;
      this.display_add ="block";
      this.display_reason ="none";
    }else{
      this.returnchequereasons = [];
      this.display_add ="none";
      this.display_reason ="block";
    }
  }
  onClose(){
    let toast = this.toastCtrl.create({
      message:'Thank You',
      duration:2000
    })
    toast.present();
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