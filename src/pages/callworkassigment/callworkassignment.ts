import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,LoadingController,Modal, ModalController, ModalOptions,ViewController } from 'ionic-angular';
import { FormGroup,FormBuilder,Validators } from '@angular/forms';
import { RestProvider } from '../../providers/rest/rest';


@IonicPage()
@Component({
  selector: 'page-callworkassignment',
  templateUrl: 'callworkassignment.html',
})
export class callworkassignmentpage {
  lpocommentsdetails:any
  lpocommentsForm:FormGroup
    insertedValues: any;
    calldata:any;
    Lpomanament:any;
    Callworkassignmentvalue:any;
    searchData = {"search_value": ""};
    Callworkassignment = this.navParams.get('data');
    user : any = localStorage.getItem('userData');
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

  ngOnInit() {
    this.Callworkassignmentvalue = this.Callworkassignment[0].inspection;
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

  openModalinspection(CALL_LOG_ID:any,STATUS_ID:any){
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let mymodaldata =[{
     CALL_LOG_ID:CALL_LOG_ID,
     STATUS_ID:STATUS_ID,
     Inspectiondata : this.Callworkassignment[0].inspection.filter(call => call.CALL_LOG_ID === CALL_LOG_ID)
    }]

    const myModal: Modal = this.modal.create('callworkassignmentdetails', {data :mymodaldata},  myModalOptions);

    myModal.present();

    myModal.onDidDismiss(() => {
      console.log("I have dismissed.");
    });

    myModal.onWillDismiss(() => {
      console.log("I'm about to dismiss");
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
Confirmationwork(CALL_LOG_ID:any,STATUS_ID:any){
  let commentsForm = this.lpocommentsForm.value;
  commentsForm.CALL_LOG_ID = CALL_LOG_ID;
  commentsForm.STATUS_ID = STATUS_ID
  this.authService.postData(commentsForm,'Call_inspection/statusupdateworkcompleted').then((result) => {
    this.presentLoadingDefault(false);
    this.presentToast("Updated successfully");
  }, (err) => {
    this.presentLoadingDefault(false);
    this.presentToast(err);
  });
}

  SearchcallManagement(){
    let call_id = parseInt(this.searchData.search_value);
    let item =this.searchData.search_value;
    if(item !=''){
      if(isNaN(call_id)){
        this.Callworkassignmentvalue = this.Callworkassignment[0].inspection.filter(call => (call.REQUESTOR_NAME ? call.REQUESTOR_NAME.includes(item):false));
      }else if(!isNaN(call_id)){
        this.Callworkassignmentvalue = this.Callworkassignment[0].inspection.filter(call => call.CALL_LOG_ID === call_id);
      }
    }else{
      this.Callworkassignmentvalue = this.Callworkassignment[0].inspection;
    }
  }
  openModalLpo(CALL_LOG_ID){
    let data ={
      CALL_LOG_ID:CALL_LOG_ID,
     }
      this.presentLoadingDefault(true);
      this.authService.postData(data,'Lpo/Get_lpoList_by_Call_log').then((result:any) => {
        console.log(result);
        this.Lpomanament = result;
        if(result.length > 0){
          if(this.Lpomanament[0].STATUS_ID === 1 && this.Lpomanament[0].NEXT_APPROVAL_TYPE === 1){
            const myModalOptions: ModalOptions = {
              enableBackdropDismiss: false
            };
        
            let mymodaldata =[{
              Lpomanament :this.Lpomanament.filter(call => call.STATUS_ID === 1 && call.NEXT_APPROVAL_TYPE === 1),
              type : 'Manager'
            }]
        
            const myModal: Modal = this.modal.create('lpooption', {data :mymodaldata},  myModalOptions);
        
            myModal.present();
        
            myModal.onDidDismiss(() => {
              console.log("I have dismissed.");
            });
        
            myModal.onWillDismiss(() => {
              console.log("I'm about to dismiss");
            });
          }else if(this.Lpomanament[0].STATUS_ID === 1 && (this.Lpomanament[0].NEXT_APPROVAL_TYPE === 9 || this.Lpomanament[0].NEXT_APPROVAL_TYPE === 13)){
            const myModalOptions: ModalOptions = {
              enableBackdropDismiss: false
            };
        
            let mymodaldata =[{
              Lpomanament :this.Lpomanament.filter(call => call.STATUS_ID === 1 && (call.NEXT_APPROVAL_TYPE === 9 || call.NEXT_APPROVAL_TYPE === 13)),
              type : 'Finance-MGR'
            }]
        
            const myModal: Modal = this.modal.create('lpooption', {data :mymodaldata},  myModalOptions);
        
            myModal.present();
        
            myModal.onDidDismiss(() => {
              console.log("I have dismissed.");
            });
        
            myModal.onWillDismiss(() => {
              console.log("I'm about to dismiss");
            });
          }else if(this.Lpomanament[0].STATUS_ID === 1 && this.Lpomanament[0].NEXT_APPROVAL_TYPE === 23){
            const myModalOptions: ModalOptions = {
              enableBackdropDismiss: false
            };
        
            let mymodaldata =[{
              Lpomanament :this.Lpomanament.filter(call => call.STATUS_ID === 1 && call.NEXT_APPROVAL_TYPE === 23),
              type : 'General Manager'
            }]
        
            const myModal: Modal = this.modal.create('lpooption', {data :mymodaldata},  myModalOptions);
        
            myModal.present();
        
            myModal.onDidDismiss(() => {
              console.log("I have dismissed.");
            });
        
            myModal.onWillDismiss(() => {
              console.log("I'm about to dismiss");
            });
        
          }else if(this.Lpomanament[0].STATUS_ID === 3){
            const myModalOptions: ModalOptions = {
              enableBackdropDismiss: false
            };
        
            let mymodaldata =[{
              Lpomanament :this.Lpomanament.filter(call => call.STATUS_ID === 3),
              type : 'COO'
            }]
        
            const myModal: Modal = this.modal.create('lpooption', {data :mymodaldata},  myModalOptions);
        
            myModal.present();
        
            myModal.onDidDismiss(() => {
              console.log("I have dismissed.");
            });
        
            myModal.onWillDismiss(() => {
              console.log("I'm about to dismiss");
            });
          }else if(this.Lpomanament[0].STATUS_ID === 4){
            const myModalOptions: ModalOptions = {
              enableBackdropDismiss: false
            };
        
            let mymodaldata =[{
              Lpomanament :this.Lpomanament.filter(call => call.STATUS_ID === 4),
              type : 'CEO'
            }]
        
            const myModal: Modal = this.modal.create('lpooption', {data :mymodaldata},  myModalOptions);
        
            myModal.present();
        
            myModal.onDidDismiss(() => {
              console.log("I have dismissed.");
            });
        
            myModal.onWillDismiss(() => {
              console.log("I'm about to dismiss");
            });
          }else if(this.Lpomanament[0].STATUS_ID === 0 && this.Lpomanament[0].IS_REJECTED != 0){
            const myModalOptions: ModalOptions = {
              enableBackdropDismiss: false
            };
        
            let mymodaldata =[{
              Lpomanament :this.Lpomanament.filter(call => call.STATUS_ID === 0 && call.IS_REJECTED != 0),
              type : 'Rejected'
            }]
        
            const myModal: Modal = this.modal.create('lpooption', {data :mymodaldata},  myModalOptions);
        
            myModal.present();
        
            myModal.onDidDismiss(() => {
              console.log("I have dismissed.");
            });
        
            myModal.onWillDismiss(() => {
              console.log("I'm about to dismiss");
            });
          }else if(this.Lpomanament[0].STATUS_ID === 5){
            const myModalOptions: ModalOptions = {
              enableBackdropDismiss: false
            };
        
            let mymodaldata =[{
              Lpomanament :this.Lpomanament.filter(call => call.STATUS_ID === 5),
              type : 'CEO_App'
            }]
        
            const myModal: Modal = this.modal.create('lpooption', {data :mymodaldata},  myModalOptions);
        
            myModal.present();
        
            myModal.onDidDismiss(() => {
              console.log("I have dismissed.");
            });
        
            myModal.onWillDismiss(() => {
              console.log("I'm about to dismiss");
            });
        }
        }else{
          this.presentToast("No Lpo data found");
        }
        this.presentLoadingDefault(false);
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