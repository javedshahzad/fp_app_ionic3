import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,LoadingController,Modal, ModalController, ModalOptions,ViewController } from 'ionic-angular';
import { FormGroup } from '@angular/forms';
import { RestProvider } from '../../providers/rest/rest';
import Swal from 'sweetalert2'
import { inspectionoption } from '../inspectionoption/inspectionoption';

@IonicPage()
@Component({
  selector: 'page-callinspection',
  templateUrl: 'callinspection.html',
})
export class Callinspectionpage {

    insertedValues: any;
    createcallForm:FormGroup;
    calldata:any;
    CallinspectionList:any;
    callinspectiondetails:any;
    CallInspectionData = {} as any;
    Callinspectionvalue:any;
    confirmation:any;
    Lpomanament:any;
    Callinspection = this.navParams.get('data');
    searchData = {"search_value": ""};
    user : any = localStorage.getItem('userData');
    constructor(public navCtrl: NavController, public navParams: NavParams,
        public authService:RestProvider, public toastCtrl:ToastController,private modal: ModalController,
        public loadingCtrl: LoadingController, public view: ViewController) {
            this.user = this.user ? JSON.parse(this.user) : {};  
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
    this.Callinspectionvalue = this.Callinspection[0].inspection;
   /* console.log(this.Callinspectionvalue);*/
  }
  confirmupdate(CALL_LOG_ID:any,STATUS_NAME:any,CALL_INSPECTION_ID:any,REASION1:any,STATUS_ID:any){
      Swal.fire({
        title: 'Are you sure?',
        text: 'You will not be able to Confirmated Data!',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, confirm!',
        cancelButtonText: 'No'
      }).then((result) => {
        if (result.value) {
          Swal.fire(
            'Updated',
            'Your data is Confirmated.',
            'success'
          )
          this.CallInspectionData.CALL_LOG_ID = CALL_LOG_ID;
          this.CallInspectionData.STATUS_NAME = STATUS_NAME;
          this.CallInspectionData.STATUS_ID = STATUS_ID;
          this.CallInspectionData.CALL_INSPECTION_ID = CALL_INSPECTION_ID;
          this.CallInspectionData.ReOpen = 0;
          this.CallInspectionData.modified_by = this.user.UserInfoId;
          this.CallInspectionData.Canceled = 1;
          this.CallInspectionData.closed = 1;
         /* console.log(this.CallInspectionData);*/
          this.presentLoadingDefault(true);
          this.authService.postData(this.CallInspectionData,'Call_inspection/CallLog_Status_Change').then((result) => {
            this.navCtrl.setRoot(inspectionoption);
            this.presentLoadingDefault(false);
           /* console.log(result);*/
            this.presentToast("Updated successfully");
           // console.log('List ',this.insertedValues);
          }, (err) => {
            this.presentLoadingDefault(false);
            this.presentToast(err);
          });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire(
            'Cancelled',
            'Your data is not Confirmated)',
            'error'
          )
        }
      });
   
  }

  openModal(CALL_LOG_ID:any,STATUS_NAME:any,REQUESTOR_NAME:any) {

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    const myModalData = [{
      CALL_LOG_ID: CALL_LOG_ID,
      STATUS_NAME:STATUS_NAME,
      REQUESTOR_NAME: REQUESTOR_NAME
    }];

    const myModal: Modal = this.modal.create('callcomments', { data: myModalData }, myModalOptions);

    myModal.present();

    myModal.onDidDismiss((data) => {     
    });
  }

  updateinspection(CALL_INSPECTION_ID:any,CALL_LOG_ID:any,STATUS_ID:any){
    this.presentLoadingDefault(true);
    let data ={
    CALL_INSPECTION_ID : CALL_INSPECTION_ID,
    CALL_NO : CALL_LOG_ID,
    STATUS_ID:STATUS_ID,
    modified_by :this.user.UserInfoId,
    created_by :this.user.UserInfoId};
    this.authService.postData(data,'Call_inspection/Callinspection_inprocess').then((result) => {
      this.openModalinspection(CALL_INSPECTION_ID,CALL_LOG_ID,STATUS_ID)
      this.callinspectiondetails = result;
     this.resetForm();
     // console.log('List ',this.insertedValues);
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });
  }
  
  openModalinspection(CALL_INSPECTION_ID:any,CALL_LOG_ID:any,STATUS_ID:any){
    this.presentLoadingDefault(true);
    let data ={
      CALL_INSPECTION_ID : CALL_INSPECTION_ID,
      CALL_NO : CALL_LOG_ID,
      STATUS_ID : STATUS_ID,
      modified_by :this.user.UserInfoId,
      created_by :this.user.UserInfoId};
          
      let Inspectiondata = this.Callinspection[0].inspection.filter(call => call.CALL_INSPECTION_ID === CALL_INSPECTION_ID)

    let myTitle="Call Inspection Details";
    this.authService.postData(data,'Call_inspection/Callinspectiondetails').then((result) => {
      this.presentLoadingDefault(false);
      this.callinspectiondetails = result;
      if(this.callinspectiondetails.length>0){
          const myModalOptions: ModalOptions = {
            enableBackdropDismiss: false
          };
          const myModalData = [{
            CALL_INSPECTION_DETAILS: this.callinspectiondetails,
            Inspection: Inspectiondata
            }];

          const myModal: Modal = this.modal.create('callinspectiondetails', { data: myModalData }, myModalOptions);
      
          myModal.present();
      
          myModal.onDidDismiss((data) => {
            /* console.log("I have dismissed.");
            console.log(data); */
          });
      
          myModal.onWillDismiss((data) => {
           /* console.log("I'm about to dismiss");
            console.log(data); */
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
        this.Callinspectionvalue = this.Callinspection[0].inspection.filter(call => (call.REQUESTOR_NAME ? call.REQUESTOR_NAME.includes(item):false));
      }else if(!isNaN(call_id)){
        this.Callinspectionvalue = this.Callinspection[0].inspection.filter(call => call.CALL_LOG_ID === call_id);
      }
    }else{
      this.Callinspectionvalue = this.Callinspection[0].inspection;
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