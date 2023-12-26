import { Component} from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,LoadingController, ViewController } from 'ionic-angular';
import { DashboardPage } from '../dashboard/dashboard';
import { RestProvider } from '../../providers/rest/rest';
import { FormGroup,FormBuilder,Validators } from '@angular/forms';
// import * as moment from 'moment'


/**
 * Generated class for the DashboardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-createholdcheque',
  templateUrl: 'createholdcheque.html',
})
export class CreateHoldChequePage {
  userdetails:any;
  insertedValues:any;
  chequeholddetailsall= {} as any;
  createholdchequeForm:FormGroup;
  holddata = this.navParams.get('data');
     user :any =  localStorage.getItem('userData');
      constructor(public navCtrl: NavController, public navParams: NavParams,private formBuilder: FormBuilder,
          public authService:RestProvider, public toastCtrl:ToastController,
          public loadingCtrl: LoadingController, public view: ViewController) {
              this.user = this.user ? JSON.parse(this.user) : {};  
              this.createholdchequeForm = this.formBuilder.group({
                hold_date: ['', Validators.compose([Validators.required])],
                Reason:['', Validators.compose([Validators.required])],
                oracle_no:['',Validators.compose([Validators.required])],
                hold_by:['',Validators.compose([Validators.required])],
                cash_receipt_id:['',Validators.compose([Validators.required])]
            });
              
      }

      presentToast(msg) {
        let toast = this.toastCtrl.create({
          message: msg,
          duration: 2000,
          position:'middle'
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

      goBack(){
        this.navCtrl.setRoot(DashboardPage);
      }
  
  ionViewDidLoad() {
    console.log(this.navParams.get('data'));
    this.getholdcheque();
  }

  getholdcheque(){
    const Data = this.navParams.get('data');
    let myTitle = 'Cheque Hold List';
        this.presentLoadingDefault(true);
        this.authService.postData(Data[0],'cheque/getChequeHold').then((result) => {
          this.chequeholddetailsall = result;
          this.chequeholddetailsall = result;
          this.presentLoadingDefault(false);
          if(this.chequeholddetailsall.length > 0){
            this.presentLoadingDefault(false);
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

  insertholdcheque(){
    let chequeholdData = this.createholdchequeForm.value;
    if(this.holddata[0].type=='Update'){
      chequeholdData.is_approved =1;
      chequeholdData.approved_by = this.user.UserInfoId;
      chequeholdData.CHQDT = this.holddata[0].maxdate;
    }else{
      chequeholdData.is_approved =0;
      chequeholdData.approved_by = 0;
      chequeholdData.hold_by = this.user.UserInfoId;
      chequeholdData.CHQDT = this.holddata[0].maxdate;
    }
    chequeholdData.created_by = this.user.UserInfoId;
    this.presentLoadingDefault(true);
    this.authService.postData(chequeholdData,'cheque/ChequeHoldInsert').then((result) => {
      this.presentLoadingDefault(false);
      this.presentToast("Cheque Hold successfully saved");
      this.insertedValues = result;
      this.closeModal();
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });
  }

  resetform(){
    this.createholdchequeForm.reset();
    return false;
  }
  closeModal(){
      this.view.dismiss();
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
