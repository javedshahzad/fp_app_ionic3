import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,LoadingController, Modal, ModalOptions, ModalController, ViewController } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { FormGroup,FormBuilder,Validators } from '@angular/forms';
// import Swal from 'sweetalert2'


@IonicPage()
@Component({
  selector: 'page-lpoiteminlist',
  templateUrl: 'lpoiteminlist.html',
})

export class lpoItemInList {
  callManagementDetails : any;
  RejectForm:FormGroup;
  ApproveForm:FormGroup;
  CallinspectionList:any;
  WORK_NOT_STARTED:any;
  WORK_IN_PROGRESS:any;
  PARTIALLY_ASSIGNED:any;
  Lpomanament_data:any;
  ResourseList:any;
  type:any;
  ImageList:any;
  reject_cmt='none';
  approve_cmt ='none';
  iSmaterial ='none';
  imagelistdata:any;
  downloadUrl:any;
  lpoItemInListSearch:any;
  lpoItemInList:any;

  LPOno:any;
  callcomplientsdetails:any;
  rejectbtn_approvebtn_show = 'none';
  WORK_WAITING_FOR_CLIENT_APPROVAL:any;
  searchData = {"search_value": ""};
  searchLpoList:any;
  LpoItemsList:any;
  searchLpoItemsList:any;
  title_btn:any='Close';
  title_page:any='LPO Item In List'
  btnTxt:any='Save'
  Lpomanament = this.navParams.get('data');
  user : any = localStorage.getItem('userData');
  resourse: any = JSON.parse(localStorage.getItem('resourseData'));
  showitemin = 0;
  showiteminall = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
              private formBuilder: FormBuilder, public authService:RestProvider, 
              public toastCtrl:ToastController, public loadingCtrl: LoadingController, 
              public view: ViewController, private modal: ModalController,
  ) {
        this.user = this.user ? JSON.parse(this.user) : {};  
        this.RejectForm = this.formBuilder.group({
            LPOno: ['', Validators.compose([Validators.required])],
            comments: ['', Validators.compose([Validators.required])]
        });
        this.ApproveForm = this.formBuilder.group({
          LPOno: ['', Validators.compose([Validators.required])],
          comments: ['', Validators.compose([Validators.required])]
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

  onCloseHand(mode){
    if(mode == 'reject'){
      this.reject_cmt='none'; 
    }else if(mode == 'approve'){
      this.approve_cmt='none'; 
    }else if(mode == 'material'){
      this.iSmaterial='none'; 
    }
  }

  ngOnInit() {   
   //console.log('lpooption',this.Lpomanament);
   let Lpomanament = this.navParams.get('data');

   if(Lpomanament[0].type == 'Iteminall'){
      this.showiteminall = 1;
   }else{
      this.showitemin = 1;
   }

   this.getLpoItemInList(Lpomanament[0].product_id);   

  }

  
  getLpoItemInList(product_id:any) {
    
    let Lpomanament = this.navParams.get('data');
    let params = {} as any;
    params.user_info_id = this.user.UserInfoId;
    params.product_id   = product_id;

    this.authService.postData(params, 'Lpo/getLpoItemInListAll').then((result) => {
      this.lpoItemInList = result;      
      this.lpoItemInListSearch = result;

      if(Lpomanament[0].type == 'Iteminall'){
        this.lpoItemInList  = this.lpoItemInListSearch.filter(x => x.ROWNUMBER == 1);
      }
      console.log(this.lpoItemInList);
    }, (err) => {
      console.log(err);
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

  goBack(){
    this.view.dismiss();
  }
  
  resetForm(){
    this.navCtrl.setRoot(this.navCtrl.getActive().component);
  }

  closeModal() {
    if(this.title_btn == 'Close'){
      this.view.dismiss();
    }else{
      //this.setPageTitle(this.type);
      this.title_btn = 'Close';
    }
  }


  
  itemListbtn(LPO_ID:any){
    this.LPOno = LPO_ID;
    this.presentLoadingDefault(true);
    this.authService.getData({},'Lpo/GetLpoItemsList/'+LPO_ID).then((result) => {
      this.presentLoadingDefault(false);
      this.LpoItemsList = result;
      if(this.LpoItemsList.length > 0){
        this.title_btn = 'Back';
        this.title_page ='LPO '+LPO_ID+' Material Item List';
        this.searchLpoItemsList = result;
      }else{
        this.presentToast('Material item not found this LPO ' +LPO_ID);
      }
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });
  }


  SearchManagement(){
    
  }


  showBtn=-1;
  isOpen=false;
  oldBtn=-1;

  showUndoBtn(index,LPO_ID:any){
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

  upload(LPO_ID: any, count: any) {
    if (count > 0) {
      this.presentLoadingDefault(true);
      this.authService.getData({}, 'Lpo/Getallcommantattach/' + LPO_ID + '').then((result) => {
        this.presentLoadingDefault(false);
        this.ImageList = result;
        const myModalOptions: ModalOptions = {
          enableBackdropDismiss: false
        };
        const myModalData = [{
          LPO_ID: LPO_ID,
          ImageList: this.ImageList
        }];
        const myModal: Modal = this.modal.create('lpoattachement', { data: myModalData }, myModalOptions);
        myModal.present();
        myModal.onDidDismiss((data) => {          
        });
        myModal.onWillDismiss((data) => {          
        });
      }, (err) => {
        this.presentLoadingDefault(false);
        this.presentToast(err);
      });
    } else {
      this.presentToast('No Attachment Found');
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
