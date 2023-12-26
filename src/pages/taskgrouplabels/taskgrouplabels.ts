import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, Modal, ModalController, ModalOptions, ViewController } from 'ionic-angular';
import { DashboardPage } from '../dashboard/dashboard';
import { RestProvider } from '../../providers/rest/rest';
import { CreateTaskPage } from '../createtask/createtask';
import { ChatPage } from '../chat/chat';

@IonicPage()
@Component({
  selector: 'page-taskgrouplabels',
  templateUrl: 'taskgrouplabels.html',
})
export class TaskGroupLabelPage {
  userdetails: any;
  taskdetails = {
    taskgrouplistcount:[] as any
  } as any;
  taskdetailsall: any;
  taskdetailsearchall = {} as any;
  myModalData: any;
  tasknotication: any;
  insertedValues: any;
  task_List = 'block';
  task_show = 'none';
  searchData = { "search_value": "" };
  TYPE: any;
  USER_ID:any;
  USER_NAME: any;
  today: any;
  
  public profileImg:string;
  modaltype = this.navParams.get('data');
  user: any = localStorage.getItem('userData');
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public authService: RestProvider, public toastCtrl: ToastController, private modal: ModalController,
    public loadingCtrl: LoadingController, public view: ViewController) {
    this.user = this.user ? JSON.parse(this.user) : {};
    this.today = Date.now();

  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000,
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

  goBack() {
    this.navCtrl.setRoot(DashboardPage);
  }

  createtask() {
    //this.navCtrl.push(CreateTaskPage, {}, { animate: false });

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };
    let myModalData = []
    let myModal: Modal = this.modal.create(CreateTaskPage, {}, myModalOptions);
    myModal.present();
    myModal.onDidDismiss((data) => {    
    });
    myModal.onWillDismiss((data) => {
    });

  }


  ionViewDidLoad() {
    console.log(this.modaltype[0]);
    this.gettask();
  }
  
  gettask() {    
    this.presentLoadingDefault(true);
    let params = {} as any;
    params.UserInfoId = this.user.UserInfoId;
    params.label_type = this.modaltype[0];

    this.authService.postData(params, 'task/TaskGroupList').then((result) => {
      this.taskdetails = result;
      this.taskdetailsearchall = result;
      console.log('task group -->',this.taskdetails); 
      this.presentLoadingDefault(false);    

    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });

  }
 
  openTaskModal(type: any,created_by:any) {


    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    if (type == "Active") {

      this.myModalData = [created_by,
      this.TYPE = type
      ]
        

    } else if (type == "Overdue") {

      this.myModalData = [created_by,
      this.TYPE = type
      ]

    } else if (type == "Referal") {

      this.myModalData = [created_by,
      this.TYPE = type
      ]
 

    }else if (type == "Completed") {

      this.myModalData = [created_by,
      this.TYPE = type
      ]
   

    }else if (type == "Personal") {

      this.myModalData = [created_by,
      this.TYPE = type
      ]
   

    } else {

      this.myModalData = [created_by,
      this.TYPE = type
      ]

    }

    let myModal: Modal = this.modal.create('TaskManagementDetailPage', { data: this.myModalData }, myModalOptions);
    myModal.present();
    myModal.onDidDismiss((data) => {
      this.gettask();
    });
    myModal.onWillDismiss((data) => {
    });

  }

  closeModal() {
    this.view.dismiss();
  }

  openUserChat(ASSIGNED_USER_INFO_ID:any, ASSIGNED_TO:any){
    console.log(ASSIGNED_USER_INFO_ID, ASSIGNED_TO);
   
    let myModalData = [{
      USER_INFO_ID: ASSIGNED_USER_INFO_ID,
      TRANS_TYPE: 'CHAT'
    }];
    this.navCtrl.push(ChatPage, {data: myModalData}, { animate: false });    
  };


  
  getImage(row_no, item: any) {

    let objFile = this.taskdetails.taskgrouplistcount.find(o => o.PROFILE_IMG_ID === row_no);
    let bytes = objFile.FILE_CONTENT.data;
    let file_name = objFile.FILE_NAME;
    let nameSplit = file_name.split('.');
    let extn = nameSplit[nameSplit.length - 1];

    if (extn == "jpg" || extn == "jpeg" || extn == "png") {
      if (objFile.MYPROFILECOUNT > 0) {
        return `data:image/${extn};base64,${this.encode(bytes)}`;
      } else {
        return `./assets/imgs/no-found-photo.png`
      }
    }
  }

  encode(input) {
    var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var output = "";
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    var i = 0;

    while (i < input.length) {
      chr1 = input[i++];
      chr2 = i < input.length ? input[i++] : Number.NaN; // Not sure if the index 
      chr3 = i < input.length ? input[i++] : Number.NaN; // checks are needed here

      enc1 = chr1 >> 2;
      enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
      enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
      enc4 = chr3 & 63;

      if (isNaN(chr2)) {
        enc3 = enc4 = 64;
      } else if (isNaN(chr3)) {
        enc4 = 64;
      }
      output += keyStr.charAt(enc1) + keyStr.charAt(enc2) +
        keyStr.charAt(enc3) + keyStr.charAt(enc4);
    }
    return output;
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
