import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,LoadingController,Modal, ModalController, ModalOptions,ViewController } from 'ionic-angular';
import { FormGroup,FormBuilder,Validators } from '@angular/forms';
import { RestProvider } from '../../providers/rest/rest';


@IonicPage()
@Component({
  selector: 'page-allactivecalls',
  templateUrl: 'allactivecalls.html',
})
export class allactivecallspage {
  lpocommentsdetails:any
  lpocommentsForm:FormGroup
    insertedValues: any;
    calldata:any;
    Callallactivevalue:any;
    Callallactivelist:any;
    searchData = {"search_value": ""};
    Callallactive = this.navParams.get('data');
    user : any = localStorage.getItem('userData');
    resourse: any = JSON.parse(localStorage.getItem('resourseData'));

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
    this.Callinspectiondata();
  }

  Callinspectiondata(){
    if(this.Callallactive[0].inspection == 0){
      this.presentLoadingDefault(true);
      let data ={
        Resoursename : this.resourse.EMPNAME,
        TYPE_ID : this.resourse.TYPE_ID
      } 
      this.authService.postData(data,'Call_inspection/AllCallList/').then((result) => {
        this.presentLoadingDefault(false);
        this.Callallactivevalue = result;
        this.Callallactivelist = result;
        if(this.Callallactivevalue.length > 0){
         // this.Closedcalldata();
         /* console.log('List ',this.Callallactivevalue);*/
        }else{
          this.presentLoadingDefault(false);
        }
      }, (err) => {
        this.presentLoadingDefault(false);
        this.presentToast(err);
      });
    }else if(this.Callallactive[0].inspection == 1){
      this.presentLoadingDefault(true);
      this.authService.getData({},'Call_inspection/AllclosedCallList/').then((result) => {
        this.presentLoadingDefault(false);
        this.Callallactivevalue = result;
        this.Callallactivelist = result;
        if(this.Callallactive[0].CALL_LOG_ID != null){
          this.Callallactivevalue = this.Callallactivelist.filter(call => call.CALL_LOG_ID === this.Callallactive[0].CALL_LOG_ID );
        }
        if(this.Callallactivevalue.length > 0){
         // this.Closedcalldata();
         /* console.log('List ',this.Callallactivevalue);*/
        }else{
          this.presentLoadingDefault(false);
        }
      }, (err) => {
        this.presentLoadingDefault(false);
      this.presentToast(err);
      });
    }   
  }

  showBtn =-1;
  isOpen  =false;
  oldBtn  =-1;
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
        this.Callallactivevalue = this.Callallactivelist.filter(call => (call.REQUESTOR_NAME ? call.REQUESTOR_NAME.includes(item):false));
      }else if(!isNaN(call_id)){
        this.Callallactivevalue = this.Callallactivelist.filter(call => call.CALL_LOG_ID === call_id);
      }
    }else{
      this.Callallactivevalue = this.Callallactivelist;
    }
  }

  openModal(CALL_LOG_ID:any,REQUESTOR_NAME:any) {

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };
  
    const myModalData = [{
      CALL_LOG_ID: CALL_LOG_ID,
      REQUESTOR_NAME:REQUESTOR_NAME
    }];
  
    const myModal: Modal = this.modal.create('callcomments', { data: myModalData }, myModalOptions);
  
    myModal.present();
  
    myModal.onDidDismiss((data) => {     
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