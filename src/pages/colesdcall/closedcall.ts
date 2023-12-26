import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,LoadingController,Modal, ModalController, ModalOptions,ViewController } from 'ionic-angular';
import { FormGroup,FormBuilder,Validators } from '@angular/forms';
import { RestProvider } from '../../providers/rest/rest';

@IonicPage()
@Component({
  selector: 'page-closedcall',
  templateUrl: 'closedcall.html',
})
export class closedcallpage {
  lpocommentsdetails:any
  lpocommentsForm:FormGroup
    insertedValues: any;
    calldata:any;
    CallinspectionList:any;
    callbillingdetails:any;
    Callclosednvalue:any;
    Callclosedcall = this.navParams.get('data');
    user : any = localStorage.getItem('userData');
    searchData = {"search_value": ""};
    constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder,
        public authService:RestProvider, public toastCtrl:ToastController,private modal: ModalController,
        public loadingCtrl: LoadingController, public view: ViewController) {
            this.user = this.user ? JSON.parse(this.user) : {};  
            this.lpocommentsForm = this.formBuilder.group({
                COMMENTS: ['', Validators.compose([Validators.required])],
                LPO_ID: ['', Validators.compose([Validators.required])],
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

  ionViewWillLoad() {
    this.Callclosednvalue = this.Callclosedcall[0].inspection;
  }

  openModalinspection(CALL_LOG_ID:any){
   
  let myTitle="Call Billing Details";
  this.authService.getData({},'Call_inspection/Callbillingdetails/'+CALL_LOG_ID+'').then((result) => {
    this.presentLoadingDefault(false);
    this.callbillingdetails = result;
    if(this.callbillingdetails.length>0){
        const myModalOptions: ModalOptions = {
          enableBackdropDismiss: false
        };
        const myModalData = [{
          CALL_BILLING_DETAILS: this.callbillingdetails,
          }];

        const myModal: Modal = this.modal.create('callbillingdetails', { data: myModalData }, myModalOptions);
    
        myModal.present();
    
        myModal.onDidDismiss((data) => {
          console.log("I have dismissed.");
          console.log(data);
        });
    
        myModal.onWillDismiss((data) => {
          console.log("I'm about to dismiss");
          console.log(data);
        });     
      this.presentLoadingDefault(false);
    }else{
      this.presentToast(`No data found in ${myTitle}`);
    }
  }, (err) => {
    this.presentLoadingDefault(false);
    this.presentToast(err);
  });
}


openModal(CALL_LOG_ID:any,STATUS_NAME:any,REQUESTOR_NAME) {

  const myModalOptions: ModalOptions = {
    enableBackdropDismiss: false
  };

  const myModalData = [{
    CALL_LOG_ID: CALL_LOG_ID,
    STATUS_NAME:STATUS_NAME,
    REQUESTOR_NAME : REQUESTOR_NAME
  }];

  const myModal: Modal = this.modal.create('callcomments', { data: myModalData }, myModalOptions);

  myModal.present();

  myModal.onDidDismiss((data) => {
    console.log("I have dismissed.");
    console.log(data);
  });

}

  showBtn=-1;
  isOpen=false;
  oldBtn=-1;
showUndoBtn(index){
  if(this.isOpen=false){
    this.isOpen=true;
    this.oldBtn=index;
    this.showBtn=index;
  }else {
    if(this.oldBtn == index){
      this.isOpen=false;    
      this.showBtn=-1;
      this.oldBtn=-1;
    } else {
      this.showBtn=index;
      this.oldBtn=index;
    }
  }
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

  SearchcallManagement(){
    let call_id = parseInt(this.searchData.search_value);
    let item =this.searchData.search_value;
    if(item !=''){
      if(isNaN(call_id)){
        this.Callclosednvalue = this.Callclosedcall[0].inspection.filter(call => (call.REQUESTOR_NAME ? call.REQUESTOR_NAME.includes(item):false));
      }else if(!isNaN(call_id)){
        this.Callclosednvalue = this.Callclosedcall[0].inspection.filter(call => call.CALL_LOG_ID === call_id);
      }
    }else{
      this.Callclosednvalue = this.Callclosedcall[0].inspection;
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