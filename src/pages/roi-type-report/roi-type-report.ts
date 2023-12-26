import { Component } from '@angular/core';
import { IonicPage, NavController, Platform, LoadingController, ToastController, NavParams, ViewController,Modal, ModalController, ModalOptions } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { CreateTaskPage } from '../createtask/createtask';

@IonicPage()
@Component({
  selector: 'page-roi-type-report',
  templateUrl: 'roi-type-report.html',
})
export class RoiTypeReportPage {

  userdetails:any;
  userdetailsAll:any;
  roiReportData:any;
  roiReportDataAll:any;
  myModalData: any;
  users: any;
  header_name = ''; 
  modaltype   = this.navParams.get('data');
  user: any   = localStorage.getItem('userData');  
  today_date  = new Date();
  userarry: any;
  loginuser = 0;

  constructor(public platform: Platform, public navCtrl: NavController, public navParams: NavParams,
    public view: ViewController, public toastCtrl: ToastController,private modal: ModalController,
    public loadingCtrl: LoadingController, public authService: RestProvider
  ) {      
    this.user = this.user ? JSON.parse(this.user) : {};
    if(this.modaltype != undefined)  {
      if(this.modaltype[0].ReportType =='R'){
        this.header_name = "Results";
      }else if(this.modaltype[0].ReportType =='O'){
        this.header_name = "Objectives";
      }else if(this.modaltype[0].ReportType =='I'){
        this.header_name = "Ideas";
      }
    }

    if(this.modaltype[0].user_info_id == this.user.UserInfoId){
      this.loginuser = 1;
    }else{
      this.loginuser = 0;
    }
  }


  ionViewDidLoad() {  
    this.getuser();  
    this.generateReport();
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'middle'
    });
    toast.present();
  }

  closeModal() {
    this.view.dismiss();
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
      this.loading.dismiss();
      this.loading = null
    }
  };
  
  generateReport(){    
    let TASK_DATA = {
      user_info_id: this.modaltype[0].user_info_id,
      roi_type:this.modaltype[0].ReportType
    }

    this.presentLoadingDefault(true);
    this.authService.postData(TASK_DATA, 'task/getRoiTypeReport').then((result:any) => {
      this.presentLoadingDefault(false);      
      //console.log('getRoiTypeReport ',result);
      this.roiReportData =  result;
      this.roiReportDataAll =  result;
      
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });
  }

  
  
  openUserChat(ASSIGNED_USER_INFO_ID: any, ASSIGNED_TO: any) {

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let myModalData = [{
      user_details: this.userdetailsAll.filter(x => x.USER_INFO_ID == ASSIGNED_USER_INFO_ID),
      msg_to_user_id: ASSIGNED_USER_INFO_ID,
      TRANS_TYPE: 'CHAT'
    }]

    let myModal: Modal = this.modal.create('ChatMessagePage', { data: myModalData }, myModalOptions);

    myModal.present();
    myModal.onDidDismiss((data) => {
    });
    myModal.onWillDismiss((data) => {
    });
  }

  
  getuser() {
    this.presentLoadingDefault(true);
    this.authService.getData({}, 'task/UserList/').then((result: any) => {
      this.userdetails = result.filter(x => x.USER_INFO_ID != this.user.UserInfoId);
      this.userdetailsAll = result;
      this.presentLoadingDefault(false);
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });
  }

  markAsRead(item:any){

    let TASK_DATA          = item;
    TASK_DATA.ROI_TYPE     = this.modaltype[0].ReportType;
    TASK_DATA.CREATED_BY   = this.user.UserInfoId;
    TASK_DATA.user_info_id = this.modaltype[0].user_info_id

    this.presentLoadingDefault(true);
    this.authService.postData(TASK_DATA, 'task/readRoiTypeComment').then((result:any) => {
      this.presentLoadingDefault(false);      
      console.log('getRoiTypeReport ',result);
      this.roiReportData =  result;
      this.roiReportDataAll =  result;
      
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });
  }

  createRoiTask(i: number, data: any): void {

    console.log(i,data.COMMENTS_CHILD_ID);
    
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let myModalData = [{
      TASK_ID: -1,
      COMMENTS_ID: data.COMMENTS_CHILD_ID,
      TASK_TITLE: data.COMMENTS
    }]
    let myModal: Modal = this.modal.create(CreateTaskPage, { data: myModalData }, myModalOptions);
    myModal.present();
    myModal.onDidDismiss((data) => {
    });
    myModal.onWillDismiss((data) => {
    });
  }

  
  taskgroupchat(TASK_ID: any, TITLE: any, ASSIGNED_USER_INFO_ID: any) {

    this.userarry = [];

    let login_user_details = this.userdetailsAll.find(x => x.USER_INFO_ID == this.user.UserInfoId);
    this.userarry.push(login_user_details);
    let assigned_user_details = this.userdetailsAll.find(x => x.USER_INFO_ID == ASSIGNED_USER_INFO_ID);
    this.userarry.push(assigned_user_details);

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let myModalData = [{
      USER_INFO_ID: ASSIGNED_USER_INFO_ID,
      TASK_ID: TASK_ID,
      TRANS_TYPE: 'ROI_GROUP_CHAT',
      GROUP_NAME: TITLE,
      GROUP_USER: this.userarry,
      TYPE: 'ROI_GROUP_CHAT',
      SEQ_TEXT: '',
      ROI_COMMENTS_ID:TASK_ID
    }];
  
    let myModal: Modal = this.modal.create('ChatGroupMessagePage', { data: myModalData }, myModalOptions);

    myModal.present();
    myModal.onDidDismiss((data) => {
    });
    myModal.onWillDismiss((data) => {
    });

  }

  getItems(searchbar) {

    var q = searchbar.value;
    if (q.trim() == '') {
      this.roiReportData = this.roiReportDataAll;
      return;
    }

    this.roiReportData = this.roiReportDataAll.filter((v) => {
      if (v.COMMENTS.toLowerCase().indexOf(q.toLowerCase()) > -1) {
        return true;
      }
      return false;
    })
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
