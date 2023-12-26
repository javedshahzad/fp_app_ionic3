import { Component } from '@angular/core';
import { IonicPage, NavController, Platform, NavParams, ToastController, LoadingController, AlertController, Modal, ModalController, ModalOptions, ViewController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RestProvider } from '../../providers/rest/rest';
import { CreateTaskPage } from '../createtask/createtask';
import { AngularFireDatabase, } from 'angularfire2/database';

@IonicPage()
@Component({
  selector: 'page-userweeklycomments',
  templateUrl: 'userweeklycomments.html',
})
export class UserweeklycommentsPage {
  today: any;
  CommentsForm: FormGroup;
  show_comment_list = 0;
  show_msg_box = 0;
  taskcommentscount = {
    Result: [] as any,
    Object: [] as any,
    Ideas: [] as any
  } as any;
  type_string: any;
  COMMENTS_ID: any;
  editcomment: any;
  editcomment_filter: any;
  CommentsList: any;
  label_title: any;
  taskweekcomments: any;
  comment_data: any;
  date: any;
  weekly_R: any;
  weekly_I: any;
  weekly_O: any;
  CommentsListdata: any;
  CommentsListdetails: any;
  cmt_startweek: any;
  cmt_endweek: any;
  msg: any = '';
  reporting_user_id = '';
  userdetails: any;
  userdetailsAll: any;
  manager_user_count = 0;
  userarry: any;
  groupmessagesAll = [];
  groupmessages: any;
  label_type: any;

  datalist = this.navParams.get('data');
  user: any = localStorage.getItem('userData');
  constructor(public platform: Platform, public navCtrl: NavController, private modal: ModalController,
    public navParams: NavParams, private formBuilder: FormBuilder, public authService: RestProvider,
    private alertCtrl: AlertController, public toastCtrl: ToastController, public loadingCtrl: LoadingController,
    public view: ViewController, public db: AngularFireDatabase
  ) {
    this.user = this.user ? JSON.parse(this.user) : {};
    this.today = Date.now();

    this.CommentsForm = this.formBuilder.group({
      COMMENTS: ['', Validators.compose([Validators.required])]
    });
  }

  ionViewDidLoad() {
    this.getuser();
    this.show_comment_list = 0;
    this.label_title = 'Weekly';
    this.getpriviousweekList();
    this.cmt_startweek = '';
    this.cmt_endweek = '';
    this.reporting_user_id = this.datalist[1];
    this.manager_user_count = this.datalist[2];
  }

  clearvalues() {
    this.CommentsForm.reset();
    return false;
  }

  presentPrompt() {
    let alert = this.alertCtrl.create({
      title: 'Enter Points',
      inputs: [
        {
          name: 'myrange',
          min: 0,
          type: 'range',
          max: 10,
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Send',
          role: 'send',
          handler: data => {
            console.log('Send clicked', data);
          }
        }

      ]
    });
    alert.present();
  }

  getpriviousweekList() {
    let data = {
      login_user_id: this.user.UserInfoId,
      type_id: 3,
      user_id: this.datalist[1],
      user_name: this.datalist[3]
    }

    this.presentLoadingDefault(true);
    this.authService.postData(data, 'task/getUserRoiSummary').then((result) => {
      if (Object.keys(result).length != 0) {
        this.taskweekcomments = result;
        this.date = result;
        console.log(this.date);

      } else {
        this.show_msg_box = 1;
      }
      this.presentLoadingDefault(false);
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });
  }


  closeModal() {
    if (this.show_comment_list == 2) {
      this.show_comment_list = 0;
    } else if (this.show_comment_list == 3) {
      this.show_comment_list = 0;
    } else if (this.show_comment_list == 4) {
      this.show_comment_list = 0;
    } else if (this.show_comment_list == 1) {
      this.show_comment_list = 0;

    } else {
      this.view.dismiss();
      this.cmt_startweek = '';
      this.cmt_endweek = '';
    }
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

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'middle'
    });
    toast.present();
  }

  gettypecount() {
    let data = {
      user_id: this.datalist[1],
      gettype: 3
    }
    this.presentLoadingDefault(true);
    this.authService.postData(data, 'task/dailycommentscount').then((result) => {
      this.taskcommentscount = result;
      this.presentLoadingDefault(false);
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });
  }


  showCmtBtn = -1;
  isCmtOpen = false;
  oldCmtBtn = -1;
  showComment(index, startweek: any, endweek: any, label_type: any) {

    this.cmt_startweek = startweek;
    this.cmt_endweek = endweek;
    this.label_type = label_type;

    this.Getcommentdatewise(startweek, endweek);

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

  Getcommentdatewise(startweek, endweek) {
    let data = {
      startweek: startweek,
      endweek: endweek,
      user_id: this.datalist[1],
    }

    this.presentLoadingDefault(true);
    this.authService.postData(data, 'task/getUserRoiByWeek').then((result: any) => {
      this.CommentsListdata = result;
      this.weekly_R = result.filter(x => x.TYPE == 'R').length;
      this.weekly_I = result.filter(x => x.TYPE == 'I').length;
      this.weekly_O = result.filter(x => x.TYPE == 'O').length;

      for (var i = 0; i < this.CommentsListdata.length; i++) {
        this.CommentsListdata[i].COMMENTS = this.createTextLinks(this.CommentsListdata[i].COMMENTS);
      }
      console.log('getUserRoiByWeek', this.CommentsListdata);
      this.presentLoadingDefault(false);
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });
  }

  GetcommentDetails(type: any) {
    let data = {
      startweek: this.cmt_startweek,
      endweek: this.cmt_endweek,
      type: type,
      user_id: this.datalist[1] ? this.datalist[1] : 0
    }
    this.msg = "loading...";
    this.editcomment = [];
    this.authService.postData(data, 'task/Weeklycommentstaskdetails').then((result: any) => {
      this.CommentsListdetails = result;
      console.log('CommentsListdetails', this.CommentsListdetails);

      this.db.list('/group_chat_messages').snapshotChanges().subscribe(ServerItem => {
        this.groupmessagesAll = [];
        ServerItem.forEach(a => {
          let item: any = a.payload.val();
          item.key = a.payload.key;
          this.groupmessagesAll.push(item);
        });


        for (var i = 0; i < this.CommentsListdetails.length; i++) {
          this.groupmessages = this.groupmessagesAll.filter(x => x.roi_comment_id == this.CommentsListdetails[i].COMMENTS_CHILD_ID);
          this.CommentsListdetails[i].CHAT_COUNT = this.groupmessages.length;
          this.CommentsListdetails[i].COMMENTS = this.createTextLinks(this.CommentsListdetails[i].COMMENTS);

        }

        this.msg = "";
        this.editcomment = this.CommentsListdetails.filter(x => x.TYPE == type);
        console.log('editcomment', this.editcomment);

        if (this.editcomment.length == 0) {
          this.msg = "No data found";
          this.presentToast(this.msg);
        }

      });

    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });
  }

  openModal(type_string: any) {
    this.show_comment_list = 1
    this.type_string = type_string;
    if (this.CommentsListdata.length > 0 && this.type_string == "R") {
      this.GetcommentDetails(this.type_string);
    } else if (this.CommentsListdata.length > 0 && this.type_string == "O") {
      this.GetcommentDetails(this.type_string);
    } else if (this.CommentsListdata.length > 0 && this.type_string == "I") {
      this.GetcommentDetails(this.type_string);
    }
  }

  getuser() {
    this.authService.getData({}, 'task/UserList/').then((result: any) => {
      this.userdetails = result.filter(x => x.USER_INFO_ID != this.user.UserInfoId);
      this.userdetailsAll = result;
    }, (err) => {
      this.presentToast(err);
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


  showCallMgntCmtBtn = -1;
  isCallMgntCmtOpen = false;
  oldCallMgntCmtBtn = -1;
  showcallCommentUndoBtn(index, item: any) {

    this.editcomments(item);

    if (this.isCallMgntCmtOpen == false) {
      this.isCallMgntCmtOpen = true;
      this.oldCallMgntCmtBtn = index;
      this.showCallMgntCmtBtn = index;
    } else {
      if (this.oldCallMgntCmtBtn == index) {
        this.isCallMgntCmtOpen = false;
        this.showCallMgntCmtBtn = -1;
        this.oldCallMgntCmtBtn = -1;
      } else {
        this.showCallMgntCmtBtn = index;
        this.oldCallMgntCmtBtn = index;
      }
    }
  }

  editcomments(item) {
    this.COMMENTS_ID = item.COMMENTS_ID;
    this.presentLoadingDefault(true);
    this.authService.getData({}, 'task/getcommentsList_by_id/' + item.COMMENTS_ID).then((result) => {
      this.CommentsList = result;
      this.presentLoadingDefault(false);
      if (this.CommentsList.length > 0) {
        this.presentLoadingDefault(false);
      } else {
        this.presentLoadingDefault(false);
        this.presentToast(`No data found `);
      }
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

  insertCommentsForm() {

    var app_platform: string = '';

    if (this.platform.is('ios')) {
      app_platform = 'ios';
    }

    if (this.platform.is('android')) {
      app_platform = 'android';
    }

    let push_message = {} as any;
    push_message.title = this.user.Surname;
    push_message.content = 'Weekly Updates - chat';
    push_message.message = this.CommentsForm.value.COMMENTS;
    push_message.app_platform = app_platform;
    push_message.user_info_id = this.datalist[1];

    this.authService.postData(push_message, 'pushnotification/pushnotificationsendWeekly').then((result) => {
      this.presentLoadingDefault(false);
      this.clearvalues();
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });

  }

  createtask(COMMENTS_CHILD_ID: any, COMMENTS: any) {
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };
    let myModalData = [{
      TASK_ID: -1,
      COMMENTS_ID: COMMENTS_CHILD_ID,
      TASK_TITLE: COMMENTS
    }]
    let myModal: Modal = this.modal.create(CreateTaskPage, { data: myModalData }, myModalOptions);
    myModal.present();
    myModal.onDidDismiss((data) => {
      this.isCmtOpen = false;
      this.showCmtBtn = -1;
      this.oldCmtBtn = -1;
    });
    myModal.onWillDismiss((data) => {
    });
  }

  gettaskcount(TASK_ID) {
    if (TASK_ID == null) {
      return 0;
    } else {
      let count = TASK_ID.split(",");
      return count.length;
    }
  }

  tasklist(TASK_ID) {
    if (TASK_ID != null) {
      var task_id_arr = TASK_ID.split(",");
      let data = {
        task_id: JSON.stringify(TASK_ID.split(",")),
        UserInfoId: this.user.UserInfoId
      }
      this.presentLoadingDefault(true);
      this.authService.postData(data, 'task/searchtasklist').then((result: any) => {
        this.presentLoadingDefault(false);

        const myModalOptions: ModalOptions = {
          enableBackdropDismiss: false
        };
        let myModalData = [
          result,
          'Search',
          task_id_arr
        ]
        let myModal: Modal = this.modal.create('TaskManagementDetailPage', { data: myModalData }, myModalOptions);
        myModal.present();
        myModal.onDidDismiss((data) => {
          this.isCmtOpen = false;
          this.showCmtBtn = -1;
          this.oldCmtBtn = -1;
        });
        myModal.onWillDismiss((data) => {
        });

      }, (err) => {
        this.presentLoadingDefault(false);
        this.presentToast(err);
      });
    }
  }

  createNewObjective() {

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };


    let myModalData = [{
      reporting_user_id: this.reporting_user_id,
      start_date: this.cmt_startweek,
      end_date: this.cmt_endweek,
      label_type: this.label_type
    }];

    let myModal: Modal = this.modal.create('CreateRoiObjectivePage', { data: myModalData }, myModalOptions);

    myModal.present();
    myModal.onDidDismiss((data) => {
      this.Getcommentdatewise(this.cmt_startweek, this.cmt_endweek);
    });
    myModal.onWillDismiss((data) => {
    });
  }


  presentToastForPointComment(comments: any) {
    let message = comments;
    let toast = this.toastCtrl.create({
      message: message,
      duration: 10000,
      position: 'middle',
      showCloseButton: true,
      closeButtonText: "Close"
    });

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
