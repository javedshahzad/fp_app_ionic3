import { Component } from '@angular/core';
import { IonicPage, NavController, Platform, NavParams, ToastController, LoadingController, Modal, ModalController, ModalOptions, ViewController } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { CreateTaskPage } from '../createtask/createtask';
import { ChatPage } from '../chat/chat';

@IonicPage()
@Component({
  selector: 'page-taskmanagementdetail',
  templateUrl: 'taskmanagementdetail.html',
})
export class TaskManagementDetailPage {
  modaltype = this.navParams.get('data');
  user: any = localStorage.getItem('userData');
  insertedValues: any;
  taskdetails: any;
  tasksearchdetails: any;
  task_list_display = 'block';
  task_search_display = 'none';
  pushnotificationValues: any;
  searchData = { "search_value": "" };
  markasreaddiv = 0;
  showassignedto = 0;
  today: any;
  hierachyList: any;
  show_hierachy = 0;
  expandlist: any;
  expandlistnxt: any;
  hierachytitle: any;
  userdetailsAll: any;
  userarry:any;
  constructor(public platform: Platform, public navCtrl: NavController, public navParams: NavParams,
    public authService: RestProvider, public toastCtrl: ToastController, private modal: ModalController,
    public loadingCtrl: LoadingController, public view: ViewController) {
    this.user = this.user ? JSON.parse(this.user) : {};
    this.today = Date.now();
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

  ionViewWillLoad() {
    console.log(this.modaltype);
    this.userarry = [];
    this.getuser();
    if (this.modaltype[1] == "Activity") {
      this.markasreaddiv = 1;
    } else {
      this.markasreaddiv = 0;
    }

    if (this.modaltype[1] == "ActiveOverdue" || this.modaltype[1] == "ActiveAll") {
      this.showassignedto = 1;
    } else {
      this.showassignedto = 0;
    }

    if (this.modaltype[1] == "Search") {
      this.taskdetails = this.modaltype[0];
      this.tasksearchdetails = this.modaltype[0];
      for (var i = 0; i < this.tasksearchdetails.length; i++) {
        this.tasksearchdetails[i].COMMENTS = this.createTextLinks(this.tasksearchdetails[i].COMMENTS);
      }
      if (Array.isArray(this.modaltype[2])) {
        this.showBtn = 1;
        let expand = this.tasksearchdetails;
        let task_id_arr = this.modaltype[2];
        for (var k = 0; k < task_id_arr.length; k++) {
          for (var j = 0; j < expand.length; j++) {
            if (expand[j].TASK_ID == task_id_arr[k].TASK_ID) {
              this.showBtn = j;
            }
          }
        }
      } else {
        this.showBtn = 1;
        let expand = this.tasksearchdetails;
        for (let i = 0; i < expand.length; i++) {
          if (expand[i].SEQ_TEXT == this.modaltype[2]) {
            this.showBtn = i;
          }
        }
      }

    } else {
      this.gettask(0, 0);
    }
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

  getuser() {
    this.presentLoadingDefault(true);
    this.authService.getData({}, 'task/UserList/').then((result: any) => {
      this.userdetailsAll = result;
      this.presentLoadingDefault(false);
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });
  }


  gettask(index, id) {
    this.presentLoadingDefault(true);
    let params = {} as any;
    params.UserInfoId = this.user.UserInfoId;
    params.label_type = this.modaltype[1];
    params.label_user_id = this.modaltype[0];

    this.authService.postData(params, 'task/TaskManagementList').then((result) => {
      this.taskdetails = result;
      this.tasksearchdetails = result;
      for (var j = 0; j < this.tasksearchdetails.length; j++) {
        this.tasksearchdetails[j].COMMENTS = this.createTextLinks(this.tasksearchdetails[j].COMMENTS);
      }

      this.presentLoadingDefault(false);

      if (index == 1) {
        let expand = this.tasksearchdetails;
        for (var i = 0; i < expand.length; i++) {
          if (expand[i].TASK_ID == id) {
            this.showBtn = i;
          }
        }
      }

    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });
  }

  resetForm() {
    this.navCtrl.setRoot(this.navCtrl.getActive().component);
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
    if (this.show_hierachy == 1) {
      this.show_hierachy = 0;
    } else if (this.show_hierachy == 0) {
      this.view.dismiss();
    }
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

  openModalTaskUpload(TASK_ID: any) {
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let myModalData = [{
      TASK_ID: TASK_ID,
      task_data_val: this.tasksearchdetails.filter(item => item.TASK_ID === TASK_ID)
    }];

    let myModal: Modal = this.modal.create('TaskFileUploadsPage', { data: myModalData }, myModalOptions);

    myModal.present();
    myModal.onDidDismiss((data) => {
    });
    myModal.onWillDismiss((data) => {
    });
  }

  openModalTaskReminder(TASK_ID: any) {

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let myModalData = [{
      TASK_ID: TASK_ID,
      task_data_val: this.tasksearchdetails.filter(item => item.TASK_ID === TASK_ID)
    }];

    let myModal: Modal = this.modal.create('TaskReminderPage', { data: myModalData }, myModalOptions);

    myModal.present();
    myModal.onDidDismiss((data) => {
    });
    myModal.onWillDismiss((data) => {
    });
  }

  openModal(TASK_ID: any, index: any) {
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let myModalData = [{
      TASK_ID: TASK_ID,
      task_data_val: this.tasksearchdetails.filter(item => item.TASK_ID === TASK_ID)
    }];

    let myModal: Modal = this.modal.create('TaskCommentPage', { data: myModalData }, myModalOptions);

    myModal.present();
    myModal.onDidDismiss((data) => {
      if (this.modaltype[1] == "Search") {
        this.getsearchlist();
        let expand = this.tasksearchdetails;
        for (var i = 0; i < expand.length; i++) {
          if (expand[i].TASK_ID == TASK_ID) {
            this.showBtn = i;
          }
        }
      } else {
        this.gettask(1, TASK_ID);
      }
    });

    myModal.onWillDismiss((data) => {
    });
  }

  openModalUpdateTask(TASK_ID: any, index: any) {
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let myModalData = [{
      TASK_ID: TASK_ID,
      task_data_val: this.tasksearchdetails.filter(item => item.TASK_ID === TASK_ID)
    }];

    let myModal: Modal = this.modal.create('UpdateTaskPage', { data: myModalData }, myModalOptions);

    myModal.present();

    myModal.onDidDismiss((data) => {
      this.showBtn = index;
      if (this.modaltype[1] == "Search") {
        this.getsearchlist();
      } else {
        this.gettask(0, 0);
      }
    });

    myModal.onWillDismiss((data) => {
    });

  }


  update_task(TASK_ID: any, type: any) {
    let task = this.tasksearchdetails.filter(item => item.TASK_ID === TASK_ID);
    if (type == "start") {
      task[0].NEXT_STATUS = 3;
      task[0].task_comments = "In Progress";
      task[0].current_value = 'Status is updated to In Progress.';
      task[0].prev_value = 'Previous status is ' + task[0].STATUS_NAME;

    } else if (type == "complete") {
      task[0].NEXT_STATUS = 4;
      task[0].task_comments = "completed";
      task[0].current_value = 'Status is updated to Completed.';
      task[0].prev_value = 'Previous status is ' + task[0].STATUS_NAME;

    } else if (type == "close") {
      task[0].NEXT_STATUS = 6;
      task[0].task_comments = "closed";
      task[0].current_value = 'Status is updated to closed.';
      task[0].prev_value = 'Previous status is ' + task[0].STATUS_NAME;

    } else if (type == "reopen") {
      task[0].NEXT_STATUS = 3;
      task[0].task_comments = "In Progress";
      task[0].current_value = 'Status is updated to In Progress.';
      task[0].prev_value = 'Previous status is ' + task[0].STATUS_NAME;
      
    }else if (type == "pause") {

      task[0].NEXT_STATUS = 8;
      task[0].task_comments = "Pause";
      task[0].current_value = 'Status is updated to Pause.';
      task[0].prev_value = 'Previous status is ' + task[0].STATUS_NAME;

    }

    task[0].modified_by = this.user.UserInfoId;
    this.presentLoadingDefault(true);
    this.authService.postData(task[0], 'task/UpdateTask').then((result) => {
      this.presentLoadingDefault(false);
      this.presentToast("Data successfully Updated");
      this.insertedValues = result;

      var app_platform: string = '';
      if (this.platform.is('ios')) {
        app_platform = 'ios';
      }

      if (this.platform.is('android')) {
        app_platform = 'android';
      }

      let push_message = {} as any;
      push_message.title = this.user.Surname
      push_message.message = 'Task No: ' + task[0].SEQ_TEXT + '\nTitle: ' + task[0].TITLE + "\n Comments: " + 'Status Changed from ' + task[0].STATUS_NAME + ' to ' + task[0].task_comments;
      push_message.app_platform = app_platform;
      push_message.task_assignee_id = task[0].ASSIGNED_USER_INFO_ID;
      push_message.task_created_by = task[0].CREATED_BY;
      push_message.new_task = null;
      push_message.loggedin_user_id = this.user.UserInfoId;
      push_message.task_id = TASK_ID;
      push_message.trans_type = 'TMS';

      this.authService.postData(push_message, 'pushnotification/pushnotificationsend').then((result) => {
        this.presentLoadingDefault(false);
        this.pushnotificationValues = result;
      }, (err) => {
        this.presentLoadingDefault(false);
        this.presentToast(err);
      });

      this.ionViewWillLoad();
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });
  }

  delete_task(TASK_ID: any) {

    let task = this.tasksearchdetails.filter(item => item.TASK_ID === TASK_ID);

    let TASK_DATA = {
      task_id: TASK_ID,
      modified_by: this.user.UserInfoId,
      current_value: 'The task is deleted.',
      prev_value: task[0].STATUS_NAME,
      ASSIGNED_USER_INFO_ID: task[0].ASSIGNED_USER_INFO_ID,
      CREATED_BY: task[0].CREATED_BY
    }
    this.presentLoadingDefault(true);
    this.authService.postData(TASK_DATA, 'task/DeleteTask').then((result) => {
      this.presentLoadingDefault(false);
      this.presentToast("Task Deleted Successfully");
      this.insertedValues = result;

      var app_platform: string = '';
      if (this.platform.is('ios')) {
        app_platform = 'ios';
      }

      if (this.platform.is('android')) {
        app_platform = 'android';
      }

      let push_message = {} as any;
      push_message.title = this.user.Surname
      push_message.message = 'Task No: ' + task[0].SEQ_TEXT + "\n" + 'Title: ' + task[0].TITLE + "\n Comments: The task is deleted";
      push_message.app_platform = app_platform;
      push_message.task_assignee_id = task[0].ASSIGNED_USER_INFO_ID;
      push_message.task_created_by = task[0].CREATED_BY;
      push_message.new_task = null;
      push_message.loggedin_user_id = this.user.UserInfoId;
      push_message.task_id = TASK_ID;
      push_message.trans_type = 'TMS';

      this.authService.postData(push_message, 'pushnotification/pushnotificationsend').then((result) => {
        this.presentLoadingDefault(false);
        this.pushnotificationValues = result;
      }, (err) => {
        this.presentLoadingDefault(false);
        this.presentToast(err);
      });

      this.ionViewWillLoad();

    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });
  }


  markasread(TASK_ID: any) {

    let TASK_DATA = {
      task_id: TASK_ID,
      user_info_id: this.user.UserInfoId,
      modified_by: this.user.UserInfoId
    }
    this.presentLoadingDefault(true);
    this.authService.postData(TASK_DATA, 'task/MarkAsReadTask').then((result) => {
      this.presentLoadingDefault(false);
      this.insertedValues = result;
      this.ionViewWillLoad();
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });
  }

  markasreadall() {

    var taskdata = [];
    for (var i = 0; i < this.tasksearchdetails.length; i++) {
      taskdata.push(this.tasksearchdetails[i].TASK_ID);
    }

    let TASK_DATA = {
      task_id: taskdata,
      user_info_id: this.user.UserInfoId,
      modified_by: this.user.UserInfoId
    }
    this.presentLoadingDefault(true);
    this.authService.postData(TASK_DATA, 'task/MarkAsReadallTask').then((result) => {
      this.presentLoadingDefault(false);
      this.insertedValues = result;
      this.ionViewWillLoad();
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });
  }


  UpdateimportantTask(TASK_ID: any, update_val: any) {
    let task = this.tasksearchdetails.filter(item => item.TASK_ID === TASK_ID);

    let TASK_DATA = {
      task_id: TASK_ID,
      UserInfoId: this.user.UserInfoId,
      modified_by: this.user.UserInfoId,
      update_value: update_val,
      ASSIGNED_USER_INFO_ID: task[0].ASSIGNED_USER_INFO_ID,
      CREATED_BY: task[0].CREATED_BY
    }
    this.authService.postData(TASK_DATA, 'task/updatetask_to_important').then((result) => {
      this.presentLoadingDefault(false);
      this.presentToast("Task Updated Successfully");
      this.ionViewWillLoad();
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });
  }

  UpdatethubmsTask(TASK_ID: any, update_val: any, ASSIGNED_USER_INFO_ID: any, CREATED_BY: any) {

    let task = this.tasksearchdetails.filter(item => item.TASK_ID === TASK_ID);

    let TASK_DATA = {
      task_id: TASK_ID,
      UserInfoId: this.user.UserInfoId,
      modified_by: this.user.UserInfoId,
      update_value: update_val,
      current_value: 'Good Job...',
      prev_value: task[0].STATUS_NAME,
      ASSIGNED_USER_INFO_ID: task[0].ASSIGNED_USER_INFO_ID,
      CREATED_BY: task[0].CREATED_BY
    }

    this.authService.postData(TASK_DATA, 'task/updatetask_to_thumbs').then((result) => {
      this.presentLoadingDefault(false);
      this.presentToast("Task Updated Successfully");

      var app_platform: string = '';
      if (this.platform.is('ios')) {
        app_platform = 'ios';
      }

      if (this.platform.is('android')) {
        app_platform = 'android';
      }

      let push_message = {} as any;
      push_message.title = this.user.Surname
      push_message.message = 'Task No: ' + task[0].SEQ_TEXT + "\n" + 'Title: ' + task[0].TITLE + "\n Comments: Good Job..";
      push_message.app_platform = app_platform;
      push_message.task_assignee_id = ASSIGNED_USER_INFO_ID;
      push_message.task_created_by = CREATED_BY;
      push_message.new_task = null;
      push_message.loggedin_user_id = this.user.UserInfoId;
      push_message.task_id = TASK_ID;
      push_message.trans_type = 'TMS';

      this.authService.postData(push_message, 'pushnotification/pushnotificationsend').then((result) => {
        this.presentLoadingDefault(false);
        this.pushnotificationValues = result;
      }, (err) => {
        this.presentLoadingDefault(false);
        this.presentToast(err);
      });
      this.ionViewWillLoad();

    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });


  }

  pintotask(TASK_ID: any, TASK_TO_PIN: any, type: any) {
  
    let TASK_DATA = {
      task_id: TASK_ID,
      UserInfoId: this.user.UserInfoId,
      modified_by: this.user.UserInfoId,
      task_pin_no: TASK_TO_PIN
    }
    this.authService.postData(TASK_DATA, 'task/updatetasktopin').then((result) => {
      this.presentLoadingDefault(false);
      if (type == 'Pin') {
        this.presentToast("Task pin is updated.");
      } else {
        this.presentToast("Task unpin is updated.");
      }
      this.ionViewWillLoad();

    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });

  }


  openModalRemoveTask(TASK_ID: any) {
    let task = this.tasksearchdetails.filter(item => item.TASK_ID === TASK_ID);

    let TASK_DATA = {
      task_id: TASK_ID,
      user_info_id: this.user.UserInfoId,
      current_value: this.user.Surname + ' is removed from this task no ' + task[0].SEQ_TEXT + '-' + task[0].TITLE,
      prev_value: task[0].STATUS_NAME,
      ASSIGNED_USER_INFO_ID: task[0].ASSIGNED_USER_INFO_ID,
      CREATED_BY: task[0].CREATED_BY
    }
    this.presentLoadingDefault(true);
    this.authService.postData(TASK_DATA, 'task/UserAccessDelete').then((result) => {
      this.presentLoadingDefault(false);
      var app_platform: string = '';
      if (this.platform.is('ios')) {
        app_platform = 'ios';
      }

      if (this.platform.is('android')) {
        app_platform = 'android';
      }

      let push_message = {} as any;
      push_message.title = this.user.Surname
      push_message.message = 'Task No: ' + task[0].SEQ_TEXT + "\n" + 'Title: ' + task[0].TITLE + "\n Comments: " + this.user.Surname + ' is removed from this task.';
      push_message.app_platform = app_platform;
      push_message.task_assignee_id = task[0].ASSIGNED_USER_INFO_ID;
      push_message.task_created_by = task[0].CREATED_BY;
      push_message.new_task = null;
      push_message.loggedin_user_id = this.user.UserInfoId;
      push_message.task_id = TASK_ID;
      push_message.trans_type = 'TMS';

      this.authService.postData(push_message, 'pushnotification/pushnotificationsend').then((result) => {
        this.presentLoadingDefault(false);
        this.pushnotificationValues = result;
      }, (err) => {
        this.presentLoadingDefault(false);
        this.presentToast(err);
      });
      this.ionViewWillLoad();

    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });
  }

  getsearchlist() {
    if (Array.isArray(this.modaltype[2])) {
      let data = {
        task_id: JSON.stringify(this.modaltype[2]),
        UserInfoId: this.user.UserInfoId
      }
      this.presentLoadingDefault(true);
      this.authService.postData(data, 'task/searchtasklist').then((result: any) => {
        this.presentLoadingDefault(false);
        this.tasksearchdetails = result;
        this.taskdetails = result;
      }, (err) => {
        this.presentLoadingDefault(false);
        this.presentToast(err);
      });
    } else {
      let data = {
        SearchData: this.modaltype[2],
        UserInfoId: this.user.UserInfoId
      }
      this.presentLoadingDefault(true);
      this.authService.postData(data, 'task/TaskManagementSearch').then((result) => {
        this.tasksearchdetails = result;
        this.taskdetails = result;
        this.presentLoadingDefault(false);
      }, (err) => {
        this.presentLoadingDefault(false);
        this.presentToast(err);
      });
    }
  }

  SearchTaskDetail() {

    let search_value = this.searchData.search_value;
    if (search_value != '') {
      this.tasksearchdetails = this.tasksearchdetails.filter(item => (item.SEQ_TEXT ? item.SEQ_TEXT.includes(search_value) : '') || (item.ASSIGNED_TO ? item.ASSIGNED_TO.includes(search_value) : '') || (item.TITLE ? item.TITLE.includes(search_value) : ''));

      console.log('Search...', this.tasksearchdetails);
    } else {
      this.tasksearchdetails = this.taskdetails;
      console.log('No Search...', this.tasksearchdetails);
    }
  }

  subtaskcreate(TASK_ID: any, TITLE: any) {

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };
    let myModalData = [{
      TASK_ID: TASK_ID,
      TITLE: TITLE
    }]
    let myModal: Modal = this.modal.create(CreateTaskPage, { data: myModalData }, myModalOptions);
    myModal.present();
    myModal.onDidDismiss((data) => {
      if (this.modaltype[1] == "Search") {
        this.getsearchlist();
      } else {
        this.gettask(0, 0);
      }
    });
    myModal.onWillDismiss((data) => {
    });
  }

  openhierachy(TASK_ID: any, TITLE: any) {
    this.hierachytitle = {};
    this.hierachytitle.TITLE = TITLE;
    this.hierachytitle.SEQ_TEXT = TASK_ID;
    var split_val = TASK_ID.split(".");
    this.presentLoadingDefault(true);
    this.authService.getData({}, 'task/TaskManagementhierachy/' + split_val[0]).then((result) => {
      this.show_hierachy = 1;
      this.hierachyList = result;
      this.presentLoadingDefault(false);
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });
  }

  showBtn = -1;
  isOpen = false;
  oldBtn = -1;

  showUndoBtn(index) {
    if (this.isOpen = false) {
      this.isOpen = true;
      this.oldBtn = index;
      this.showBtn = index;
    } else {
      if (this.oldBtn == index) {
        this.isOpen = false;
        this.showBtn = -1;
        this.oldBtn = -1;
      } else {
        this.showBtn = index;
        this.oldBtn = index;
      }
    }
  }

  taskgroupchat(TASK_ID: any, TITLE: any, ASSIGNED_USER_INFO_ID:any) {
    
    this.userarry = [];
    let task_data_val= this.tasksearchdetails.filter(item => item.TASK_ID === TASK_ID);
 
    let login_user_details = this.userdetailsAll.find(x=> x.USER_INFO_ID == task_data_val[0].CREATED_BY);
    this.userarry.push(login_user_details);
    let assigned_user_details = this.userdetailsAll.find(x=> x.USER_INFO_ID == ASSIGNED_USER_INFO_ID);
    this.userarry.push(assigned_user_details); 
    
    var referal_user = task_data_val[0].REFERAL_USERINFOID;
 
    if(referal_user != null){
      let referal = referal_user.split(','); 
      if(referal.length > 0){

        for(let i=0; i < referal.length; i++){
          let referal_user_details = this.userdetailsAll.find(x=> x.USER_INFO_ID == referal[i]);
          this.userarry.push(referal_user_details);
        }  
      }
    }

    let myModalData = [{    
      USER_INFO_ID: ASSIGNED_USER_INFO_ID,  
      TASK_ID: TASK_ID,
      TRANS_TYPE: 'TASK_CHAT',
      GROUP_NAME: TASK_ID+'-'+TITLE,
      GROUP_USER: this.userarry,
      TYPE: 'TASK_CHAT',
      SEQ_TEXT: task_data_val[0].SEQ_TEXT
    }];

    this.navCtrl.push(ChatPage, {data: myModalData}, { animate: false });

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