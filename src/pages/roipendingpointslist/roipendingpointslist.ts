import { Component } from '@angular/core';
import { IonicPage, NavController, Platform, NavParams, ToastController, LoadingController, Modal, ModalController, ModalOptions, ViewController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RestProvider } from '../../providers/rest/rest';
import { CreateTaskPage } from '../createtask/createtask';

import { DatePipe } from '@angular/common';

@IonicPage()
@Component({
  selector: 'page-roipendingpointslist',
  templateUrl: 'roipendingpointslist.html',
})

export class RoiPendingPoints {
  today: any;
  taskcommentsForm: FormGroup;
  taskcommentseditForm: FormGroup;
  taskUploadsForm: FormGroup;
  form: FormGroup;
  taskcomments: any;
  show_comment_list: any;
  CommentsList: any;
  taskweekcomments: any;
  comment_data: any;
  date: any;
  label_title: any;
  editcomment: any;
  COMMENTS_ID: any;
  file_name: any;
  size: any;
  imageURI: any;
  downloadUrl: any;
  taskuploadsdetails: any;
  read_more_value: any;
  type_string: any;
  taskcommentscount = {
    Result: [] as any,
    Object: [] as any,
    Ideas: [] as any
  } as any;
  removefeild = [] as any;
  weekly_R: any;
  weekly_I: any;
  weekly_O: any;
  show_list = -1;
  CommentsList_filter: any;
  CommentsListdata: any;
  showplaceholder: any;
  show_comment_attachment = 1;
  single: any;
  label_type = '';
  roiReportData: any;
  roiReportDataAll: any;
  userdetails: any;
  userdetailsAll: any;

  reporting_user_id = '';
  cmt_startweek: any;
  cmt_endweek: any;

  modaltype = this.navParams.get('data');
  comments_type = this.navParams.get('data');
  user: any = localStorage.getItem('userData');
  constructor(public platform: Platform, public navCtrl: NavController, private modal: ModalController,
    public navParams: NavParams, private formBuilder: FormBuilder, public authService: RestProvider,
    public toastCtrl: ToastController, public loadingCtrl: LoadingController, public view: ViewController,
    private datePipe: DatePipe
  ) {


    this.user = this.user ? JSON.parse(this.user) : {};
    this.today = Date.now();

    this.taskcommentsForm = this.formBuilder.group({
      COMMENTS: ['', Validators.compose([Validators.required])]
    });

    this.taskcommentseditForm = this.formBuilder.group({
      comments: this.formBuilder.array([]),
      COMMENTS_ID: []
    });

    this.taskUploadsForm = this.formBuilder.group({
      COMMENTS_ID: ['', Validators.compose([Validators.required])],
    });

    this.form = this.formBuilder.group({
      comments: this.formBuilder.array([
        this.initTechnologyFields()
      ])
    });
  }

  initTechnologyFields(): FormGroup {
    return this.formBuilder.group({
      name: ['', Validators.required]
    });
  }

  initTechnologyeditFields(): FormGroup {
    return this.formBuilder.group({
      name: ['', Validators.required],
      child_id: ['', Validators.required],
      orgmodifiedon: ['', Validators.required]
    });
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

  addNewInputField(): void {
    const control: any = this.form.controls.comments;
    control.push(this.initTechnologyFields());
  }

  removeInputField(i: number): void {
    const control: any = this.form.controls.comments;
    control.removeAt(i);
  }

  removeeditField(i: number, data: any): void {
    const control: any = this.taskcommentseditForm.controls.comments;
    control.removeAt(i);
    this.removefeild.push(data.value);
  }

  addNeweditField(): void {
    const control: any = this.taskcommentseditForm.controls.comments;
    control.push(this.initTechnologyeditFields());
  }

  ionViewDidLoad() {
    this.show_comment_list = 0;

    this.cmt_startweek = '';
    this.cmt_endweek = '';
    this.getuser();
    this.generateReport();
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

  closeModal() {
    if (this.show_comment_list == 2) {
      const control: any = this.taskcommentseditForm.controls.comments;
      for (let i = control.length - 1; i >= 0; i--) {
        control.removeAt(i)
      }
      this.show_comment_list = -1;
    } else if (this.show_comment_list == 3) {
      this.show_comment_list = 1;
    } else if (this.show_comment_list == 4) {
      this.show_comment_list = 1;
    } else if (this.show_comment_list == 1) {
      this.show_comment_list = -1;
    } else if (this.show_comment_list == 5) {
      this.isCmtOpen = false;
      this.showCmtBtn = -1;
      this.oldCmtBtn = -1;
      this.show_comment_list = 0;
    } else {
      this.view.dismiss();
    }
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
      this.show_comment_list = 0;
      console.log(this.roiReportData);
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });
  }

  gettypecount(type: any) {

    let data = {
      user_id: this.user.UserInfoId,
      comments_type: type
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

  openModal(type_string: any) {
    this.type_string = type_string;
    this.label_type = this.comments_type[0];
    if (this.type_string == "R") {
      this.label_title = this.comments_type[0] + ' ' + 'Week Result';
      this.showplaceholder = 'Result';
    } else if (this.type_string == "O") {
      this.label_title = this.comments_type[0] + ' ' + 'Week Objective';
      this.showplaceholder = 'Objectives';
    } else if (this.type_string == "I") {
      this.label_title = this.comments_type[0] + ' ' + 'Week Ideas';
      this.showplaceholder = 'Ideas';
    }

    if (this.taskcommentscount.Result.length > 0 && this.type_string == "R") {

      this.editcomments(this.taskcommentscount.Result[0]);

    } else if (this.taskcommentscount.Object.length > 0 && this.type_string == "O") {

      if (this.comments_type[0] == "Next") {
        console.log(this.taskcommentscount.Object[0]);
        this.editcomments(this.taskcommentscount.Object[0]);
      } else {
        console.log(this.taskcommentscount.Object);
        this.editcomments1(this.taskcommentscount.Object);
      }

    } else if (this.taskcommentscount.Ideas.length > 0 && this.type_string == "I") {
      this.editcomments(this.taskcommentscount.Ideas[0]);
    } else {

      this.form.controls.comments.reset();
      this.getCommentsList();
      this.show_comment_list = 1;
      this.show_comment_attachment = 0;
    }
  }

  editcomments1(item) {
    this.COMMENTS_ID = item.COMMENTS_ID;
    this.editcomment = item;
    this.show_comment_list = 2;
    this.show_comment_attachment = 0;
    console.log('this.editcomment', this.editcomment);
    if (this.editcomment.length > 0) {
      for (var i = 0; i < this.editcomment.length; i++) {

        let date_val = 'Last modified on ' + this.datePipe.transform(this.editcomment[i].MODIFIED_ON, 'dd-MMM-yyyy hh:mm a');
        let cmt_val = this.editcomment[i].COMMENTS;

        const control: any = this.taskcommentseditForm.controls.comments;
        control.push(this.formBuilder.group({
          COMMENTS_ID: [this.editcomment[i].COMMENTS_ID, Validators.required],
          name: [cmt_val, Validators.required],
          child_id: [this.editcomment[i].COMMENTS_CHILD_ID, Validators.required],
          file_count: [this.editcomment[i].FILE_COUNT, Validators.required],
          orgmodifiedon: [date_val, Validators.required],
          task_id: [this.editcomment[i].TASK_ID, Validators.required],
          pre_week_object: [this.editcomment[i].PRE_WEEK_OBJECT, Validators.required],
          comment_type: [this.editcomment[i].COMMENT_TYPE, Validators.required]
        }));
      }

    } else {
      this.presentToast(`No data found `);
    }

  }

  editcomments(item) {
    this.COMMENTS_ID = item.COMMENTS_ID;
    this.presentLoadingDefault(true);
    this.authService.getData({}, 'task/getcommentsListbyid/' + item.COMMENTS_ID).then((result) => {
      this.editcomment = result;
      this.show_comment_list = 2;
      this.show_comment_attachment = 0;
      this.presentLoadingDefault(false);
      console.log('this.editcomment', this.editcomment);
      if (this.editcomment.length > 0) {
        for (var i = 0; i < this.editcomment.length; i++) {
          let date_val = 'Last modified on ' + this.datePipe.transform(this.editcomment[i].MODIFIED_ON, 'dd-MMM-yyyy hh:mm a');
          const control: any = this.taskcommentseditForm.controls.comments;
          control.push(this.formBuilder.group({
            COMMENTS_ID: [this.editcomment[i].COMMENTS_ID, Validators.required],
            name: [this.editcomment[i].COMMENTS, Validators.required],
            child_id: [this.editcomment[i].COMMENTS_CHILD_ID, Validators.required],
            file_count: [this.editcomment[i].FILE_COUNT, Validators.required],
            orgmodifiedon: [date_val, Validators.required],
            task_id: [this.editcomment[i].TASK_ID, Validators.required],
            pre_week_object: [this.editcomment[i].PRE_WEEK_OBJECT, Validators.required],
            comment_type: [this.editcomment[i].COMMENT_TYPE, Validators.required]
          }));
        }

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

  getCommentsList() {
    let data = {
      comments_type: this.comments_type[0],
      modal_type: this.type_string,
      user_id: this.user.UserInfoId,
    }
    this.presentLoadingDefault(true);
    this.authService.postData(data, 'task/dailycommentsListv1').then((result) => {
      this.taskcomments = result;
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


  showCallMgntCmtBtn = -1;
  isCallMgntCmtOpen = false;
  oldCallMgntCmtBtn = -1;
  showcallCommentUndoBtn(index, item: any) {

    this.editcommentslist(item);

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


  Expandmode(type: any) {
    if (this.show_list != -1) {
      this.show_list = -1;
    } else {
      if (type == 'R') {
        this.show_list = 0;
      } else if (type == 'I') {
        this.show_list = 2;
      } else if (type == 'O') {
        this.show_list = 1;
      }
    }
    this.CommentsList_filter = this.CommentsList.filter(x => x.TYPE == type);
  }


  deletecomments(item) {
    let data = {
      COMMENTS_ID: item.COMMENTS_ID,
      modified_by: this.user.UserInfoId,
    }
    this.presentLoadingDefault(true);
    this.authService.postData(data, 'task/dailycommentsdelete').then((result) => {
      this.presentLoadingDefault(false);
      this.show_comment_list = 1;
      this.getCommentsList();
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });
  }

  attachcomments(item) {
    this.show_comment_list = 3;
    this.COMMENTS_ID = item.COMMENTS_ID;
    this.Getfilelist(item.COMMENTS_ID);
  }

  openWeeklyAttachment(i: number, data: any, file_count: any) {

    //  console.log(file_count);
    // console.log(data.value.file_count);

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let myModalData = [{
      comment_child_id: data.value.child_id
    }];

    let myModal: Modal = this.modal.create('WeeklyCmtFileUploadsPage', { data: myModalData }, myModalOptions);

    myModal.present();
    myModal.onDidDismiss((data) => {
    });
    myModal.onWillDismiss((data) => {
    });

  }

  onSelectFile(event) {
    let file = event.target.files[0];
    this.file_name = file.name;
    this.size = file.size;
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = (e) => {
      this.imageURI = reader.result;
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
  }

  edittaskComments() {

    let COMMENTS_txt = this.taskcommentseditForm.value.comments;
    let commentsData = this.taskcommentseditForm.value;

    COMMENTS_txt = COMMENTS_txt.filter((x) => x.name != 'null' && x.name != null && x.name.trim() != '')
    commentsData.COMMENTS = JSON.stringify(COMMENTS_txt);
    commentsData.modified_by = this.user.UserInfoId;
    commentsData.removefeild = JSON.stringify(this.removefeild);
    commentsData.insert_type = this.comments_type[0];

    if (COMMENTS_txt.length > 0 || this.removefeild.length > 0) {
      this.presentLoadingDefault(true);
      this.authService.postData(commentsData, 'task/dailycommentsupdate').then((result) => {
        this.presentLoadingDefault(false);
        this.removefeild = [];
        const control: any = this.taskcommentseditForm.controls.comments;
        for (let i = control.length - 1; i >= 0; i--) {
          control.removeAt(i)
        }

        this.show_comment_list = -1;
        this.ionViewDidLoad();
        //  this.getCommentsList();

      }, (err) => {
        this.presentLoadingDefault(false);
        this.presentToast(err);
      });
    } else {
      this.presentToast("Please enter the comments");
    }

  }

  insertTaskFileUpload() {
    let taskuploadsData = this.taskUploadsForm.value;
    taskuploadsData.created_by = this.user.UserInfoId;
    taskuploadsData.modified_by = this.user.UserInfoId;
    taskuploadsData.imageURI_data = this.imageURI;
    taskuploadsData.name = this.file_name;
    taskuploadsData.size_data = this.size;
    this.presentLoadingDefault(true);
    this.authService.postData(taskuploadsData, 'task/dailycommentsInsertFile').then((result) => {
      this.presentLoadingDefault(false);
      this.presentToast("File upload is successfully saved");
      this.show_comment_list = 1;
      this.getCommentsList();
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });
  }

  Getfilelist(COMMENTS_ID) {
    this.presentLoadingDefault(true);
    this.authService.getData({}, 'task/weeklyUploadedFileList/' + COMMENTS_ID).then((result) => {
      this.taskuploadsdetails = result;
      this.presentLoadingDefault(false);
      if (this.taskuploadsdetails.length > 0) {
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

  bytesToSize(bytes) {
    return (bytes / 1048576).toFixed(3) + " MB";
  }

  openmodelcomments(item: any) {
    this.presentLoadingDefault(true);
    this.authService.getData({}, 'task/getcommentsList_by_id/' + item.COMMENTS_ID).then((result) => {
      this.read_more_value = result;
      this.show_comment_list = 4
      this.presentLoadingDefault(false);
      if (this.read_more_value.length > 0) {
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

  showCmtBtn = -1;
  isCmtOpen = false;
  oldCmtBtn = -1;
  showComment(index, user_info_id: any, startweek: any, endweek: any, label_type:any) {

    this.cmt_startweek     = startweek;
    this.cmt_endweek       = endweek;
    this.reporting_user_id = user_info_id;
    this.label_type        = label_type;

    this.Getcommentdatewise(user_info_id, startweek, endweek);

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

  Getcommentdatewise(user_info_id, startweek, endweek) {
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

  editcommentslist(item) {
    this.COMMENTS_ID = item.COMMENTS_ID;
    this.presentLoadingDefault(true);
    this.CommentsList = [];
    this.authService.getData({}, 'task/getcommentsList_by_id/' + item.COMMENTS_ID).then((result) => {
      this.CommentsList = result;
      this.presentLoadingDefault(false);
      if (this.CommentsList.length == 0) {
        this.presentToast(`No data found `);
      }
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });
  }

  openModaldate(type_string: any) {
    this.showCallMgntCmtBtn = -1;
    this.editcomment = [];
    if (this.CommentsListdata.length > 0 && type_string == "R") {
      this.editcomment = this.CommentsListdata.filter(x => x.TYPE == "R");
    } else if (this.CommentsListdata.length > 0 && type_string == "O") {
      this.editcomment = this.CommentsListdata.filter(x => x.TYPE == "O");
    } else if (this.CommentsListdata.length > 0 && type_string == "I") {
      this.editcomment = this.CommentsListdata.filter(x => x.TYPE == "I");
    }

    if (this.editcomment.length > 0)
      this.show_comment_list = 5;
    else
      this.presentToast(`No data found `);
  }

  gettaskcount(TASK_ID) {
    if (TASK_ID == null) {
      return 0;
    } else {
      let count = TASK_ID.split(",");
      return count.length;
    }
  }

  gettaskcountv1(i: number, data: any) {

    if (data.value.task_id == null) {
      return 0;
    } else {
      let count = data.value.task_id.split(",");
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

  createtask_to_open(COMMENTS_CHILD_ID: any, COMMENTS: any) {
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


  createRoiTask(i: number, data: any): void {

    console.log(i, data.value);

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let myModalData = [{
      TASK_ID: -1,
      COMMENTS_ID: data.value.child_id,
      TASK_TITLE: data.value.name
    }];

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
      this.Getcommentdatewise(this.reporting_user_id, this.cmt_startweek,  this.cmt_endweek);
    });
    myModal.onWillDismiss((data) => {
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
