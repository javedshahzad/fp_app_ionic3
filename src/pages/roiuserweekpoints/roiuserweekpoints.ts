import { Component } from '@angular/core';
import { IonicPage, NavController, Platform, LoadingController, ToastController, NavParams, ViewController, Modal, ModalController, ModalOptions } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { CreateTaskPage } from '../createtask/createtask';

@IonicPage()
@Component({
  selector: 'page-roiuserweekpoints',
  templateUrl: 'roiuserweekpoints.html',
})
export class RoiUserWeekPointsPage {

  userdetails: any;
  userdetailsAll: any;
  roiReportData: any;
  roiReportDataAll: any;
  myModalData: any;
  users: any;
  header_name = 'ROI Pending Points';
  modaltype = this.navParams.get('data');
  user: any = localStorage.getItem('userData');
  today_date = new Date();
  userarry: any;  
  CommentsListdata: any;
  weekly_R: any;
  weekly_I: any;
  weekly_O: any;
  show_list = -1;

  constructor(public platform: Platform, public navCtrl: NavController, public navParams: NavParams,
    public view: ViewController, public toastCtrl: ToastController, private modal: ModalController,
    public loadingCtrl: LoadingController, public authService: RestProvider
  ) {
    this.user = this.user ? JSON.parse(this.user) : {};
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

  generateReport() {
    let TASK_DATA = {
      user_info_id: this.modaltype[0].user_info_id,
      user_name: ''
    }

    this.presentLoadingDefault(true);
    this.authService.postData(TASK_DATA, 'task/getRoiPendingPointsList').then((result: any) => {
      this.presentLoadingDefault(false);
      this.roiReportData = result;
      this.roiReportDataAll = result;

    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });
  }

  
  showCmtBtn = -1;
  isCmtOpen = false;
  oldCmtBtn = -1;
  showComment(index, user_info_id: any, startweek: any, endweek: any) {

    this.Getcommentdatewise(startweek, endweek, user_info_id);

    if (this.isCmtOpen == false) {
      this.isCmtOpen = true;
      this.oldCmtBtn = index;
      this.showCmtBtn = index;
    } else {
      if (this.oldCmtBtn == index) {
        this.isCmtOpen = false;
        this.showCmtBtn = -1;
        this.oldCmtBtn = -1;
      } else {
        this.showCmtBtn = index;
        this.oldCmtBtn = index;
      }
    }
  }

  
  Getcommentdatewise(startweek, endweek, user_info_id) {
    let data = {
      startweek: startweek,
      endweek: endweek,
      user_id: user_info_id
    }

    this.presentLoadingDefault(true);
    this.authService.postData(data, 'task/Weekcommentsdate').then((result: any) => {
      this.CommentsListdata = result;
      this.weekly_R = result.filter(x => x.TYPE == 'R').length;
      this.weekly_I = result.filter(x => x.TYPE == 'I').length;
      this.weekly_O = result.filter(x => x.TYPE == 'O').length;

      for (var i = 0; i < this.CommentsListdata.length; i++) {
        this.CommentsListdata[i].COMMENTS = this.createTextLinks(this.CommentsListdata[i].COMMENTS);
      }
      this.presentLoadingDefault(false);
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });
  }

  
  createTextLinks(text) {

    return (text || "").replace(
      /([^\S]|^)(((https?\:\/\/)|(www\.))(\S+))/gi,
      function (match, space, url) {
        var hyperlink = url;
        if (!hyperlink.match('^https?:\/\/')) {
          hyperlink = 'http://' + hyperlink;
        }
        return space + ' <a href="' + hyperlink + '">' + url + '</a> ';
      }
    );
  };


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


  markAsRead(item: any) {

    let TASK_DATA = item;
    TASK_DATA.ROI_TYPE = 'I';
    TASK_DATA.CREATED_BY = this.user.UserInfoId;
    TASK_DATA.user_info_id = this.modaltype[0].user_info_id

    this.presentLoadingDefault(true);
    this.authService.postData(TASK_DATA, 'task/readRoiTypeComment').then((result: any) => {
      this.presentLoadingDefault(false);
      console.log('getRoiTypeReport ', result);
      this.roiReportData = result;
      this.roiReportDataAll = result;

    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });
  }


  createRoiTask(i: number, data: any): void {

    console.log(i, data.COMMENTS_CHILD_ID);

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let myModalData = [{
      TASK_ID: -1,
      COMMENTS_ID: data.COMMENTS_CHILD_ID
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
      ROI_COMMENTS_ID: TASK_ID
    }];

    let myModal: Modal = this.modal.create('ChatGroupMessagePage', { data: myModalData }, myModalOptions);

    myModal.present();
    myModal.onDidDismiss((data) => {
    });
    myModal.onWillDismiss((data) => {
    });

  }


  openUserPointsPage(reporting_user_id: any, start_week: any, end_week: any) {

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let myModalData = [{
      reporting_user_id: reporting_user_id,
      start_week: start_week,
      end_week: end_week
    }]

    let myModal: Modal = this.modal.create('UserWeeklyPointsPage', { data: myModalData }, myModalOptions);

    myModal.present();
    myModal.onDidDismiss((data) => {
      this.ionViewDidLoad();
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
