import { Component } from '@angular/core';
import { IonicPage, NavController, Platform, NavParams, AlertController,MenuController, ToastController, LoadingController, Modal, ModalController, ModalOptions, ViewController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RestProvider } from '../../providers/rest/rest';
import { CreateTaskPage } from '../createtask/createtask';
import { DashboardPage } from '../dashboard/dashboard';

import { DatePipe } from '@angular/common';
import * as moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-calendarviewedit',
  templateUrl: 'calendarviewedit.html',
})

export class CalendarViewEditPage {
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
  single:any;
  label_type = '';
  comments_type = this.navParams.get('data');
  user: any = localStorage.getItem('userData');
  inputDisabled = true;
  start_of_week:any;
  end_of_week:any;
  
  constructor(public platform: Platform, public navCtrl: NavController, private modal: ModalController,
    public navParams: NavParams, private formBuilder: FormBuilder, public authService: RestProvider,
    public toastCtrl: ToastController, public loadingCtrl: LoadingController, public view: ViewController,
    private datePipe: DatePipe,public menu: MenuController,public alertController: AlertController
    ) {

    this.inputDisabled = true;
    this.user          = this.user ? JSON.parse(this.user) : {};
    this.today         = Date.now();
    let now            = moment().format('DD-MMM-YYYY');
    console.log('now',now);

    let start_week     = moment(now).startOf('week').toDate();
    let end_week       = moment(now).endOf('week').toDate();
    this.start_of_week = moment(start_week).format('DD-MMM-YYYY');
    this.end_of_week   = moment(end_week).format('DD-MMM-YYYY');

    console.log('start_of_week',this.start_of_week,this.end_of_week);

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
    let manager_id = 0;
    return this.formBuilder.group({
      name: ['', Validators.required],
      manager_id: [manager_id,Validators.required]
    });
  }

  initTechnologyeditFields(): FormGroup {
    let manager_id = 0;
    return this.formBuilder.group({
      name: ['', Validators.required],
      child_id: ['', Validators.required],
      orgmodifiedon: ['', Validators.required],      
      manager_id: [manager_id,Validators.required]
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

  addNewInputFieldBefore(): void {
    var control :any = [];
    control = this.form.controls.comments;
    console.log(control);
    control.insert(0,this.initTechnologyFields());
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


  addNeweditFieldBefore(): void {
    var control :any = [];
    control = this.taskcommentseditForm.controls.comments;
    //control.push(this.initTechnologyeditFields());
    control.insert(0,this.initTechnologyeditFields());
  }

  ionViewDidLoad() {
    
    console.log('ionViewDidLoad CalendarViewEdit');
    console.log(this.comments_type[0]);  
    this.label_title = 'Week ROI';
    this.show_comment_list = -1;
    this.gettypecount(this.comments_type[0].selectedDate);
       
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

  presentToastForPointComment(comments:any) {
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


  getpriviousweekList() {
    
    let data = {
      login_user_id: this.user.UserInfoId,
      type_id: 2,
      user_id: this.user.UserInfoId,
      user_name: this.user.Surname
    }  

    this.presentLoadingDefault(true);
    this.authService.postData(data, 'task/getUserRoiSummary').then((result) => {
      this.taskweekcomments = result;
      this.date = result; 
      console.log(this.date);
      this.presentLoadingDefault(false);
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });

  }

  gettypecount(selectedDate: any) {

    let data = {
      user_id: this.user.UserInfoId,
      selectedDate: selectedDate 
    }
    this.presentLoadingDefault(true);
    this.authService.postData(data, 'task/getDetailsCalendarViewRoi').then((result) => {
      this.taskcommentscount = result; 
      console.log(this.taskcommentscount);     
      this.presentLoadingDefault(false);
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });

  }

  openModal(type_string: any) {
    this.type_string = type_string;
    
    if (this.type_string == "R") {
      this.showplaceholder = 'Result';
      this.label_type = 'Result';
    } else if (this.type_string == "O") {
      this.showplaceholder = 'Objectives';
      this.label_type = 'Objectives';
    } else if (this.type_string == "I") {
      this.showplaceholder = 'Ideas';
      this.label_type = 'Ideas';
    }

    if (this.taskcommentscount.Result.length > 0 && this.type_string == "R") {

      this.editcomments(this.taskcommentscount.Result[0]);

    } else if (this.taskcommentscount.Object.length > 0 && this.type_string == "O") {
            
      // if(this.comments_type[0] == "Next"){
      //   console.log(this.taskcommentscount.Object[0]);
      //   this.editcomments(this.taskcommentscount.Object[0]);
      // }else{
      //   console.log(this.taskcommentscount.Object);
      //   this.editcomments1(this.taskcommentscount.Object);
      // }

      this.editcomments(this.taskcommentscount.Object[0]);
 
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
    console.log('this.editcomment',this.editcomment);
    if (this.editcomment.length > 0) {
        for (var i = 0; i < this.editcomment.length; i++) {

          let date_val = '';
          let cmt_val  = this.editcomment[i].COMMENTS;
          let manager_id = 0;

          if ( this.editcomment[i].MANAGER_ID != null){
             manager_id = this.editcomment[i].MANAGER_ID;
             date_val = this.editcomment[i].MANAGER_NAME+',modified on '+ this.datePipe.transform(this.editcomment[i].MODIFIED_ON, 'dd-MMM-yyyy hh:mm a');
          }else{
             manager_id = 0;
             date_val = 'Last modified on '+ this.datePipe.transform(this.editcomment[i].MODIFIED_ON, 'dd-MMM-yyyy hh:mm a');
          }
          const control: any = this.taskcommentseditForm.controls.comments;
          control.push(this.formBuilder.group({
            COMMENTS_ID: [this.editcomment[i].COMMENTS_ID, Validators.required],
            name: [cmt_val, Validators.required],
            child_id: [this.editcomment[i].COMMENTS_CHILD_ID, Validators.required],
            file_count: [this.editcomment[i].FILE_COUNT, Validators.required],
            orgmodifiedon:[date_val, Validators.required],
            task_id: [this.editcomment[i].TASK_ID, Validators.required],
            pre_week_object: [this.editcomment[i].PRE_WEEK_OBJECT, Validators.required],
            comment_type: [this.editcomment[i].COMMENT_TYPE, Validators.required],
            manager_id: [manager_id,Validators.required]
          }));
        }
         
      } else {        
        this.presentToast(`No data found `);
      }
   
  }

  editcomments(item) {
    this.COMMENTS_ID = item.COMMENTS_ID;
    this.presentLoadingDefault(true);

    let params = {} as any;
    params.COMMENTS_ID  = item.COMMENTS_ID;
    params.selected_date = this.comments_type[0].selectedDate;

    this.authService.postData(params, 'task/getCalendarViewEditDetails').then((result) => {
    this.editcomment = result;
    this.show_comment_list = 2;
    this.show_comment_attachment = 0;
    this.presentLoadingDefault(false);
    console.log('this.editcomment',this.editcomment);
    if (this.editcomment.length > 0) {
        for (var i = 0; i < this.editcomment.length; i++) {
          let manager_id = 0;
          let date_val = '';

          if ( this.editcomment[i].MANAGER_ID != null){
            manager_id = this.editcomment[i].MANAGER_ID;
            date_val = this.editcomment[i].MANAGER_NAME+',modified on '+ this.datePipe.transform(this.editcomment[i].MODIFIED_ON, 'dd-MMM-yyyy hh:mm a');
          }else{
            manager_id = 0;
            date_val = 'Last modified on '+ this.datePipe.transform(this.editcomment[i].MODIFIED_ON, 'dd-MMM-yyyy hh:mm a');
          }

         
          const control: any = this.taskcommentseditForm.controls.comments;
          control.push(this.formBuilder.group({
            COMMENTS_ID: [this.editcomment[i].COMMENTS_ID, Validators.required],
            name: [this.editcomment[i].COMMENTS, Validators.required],
            child_id: [this.editcomment[i].COMMENTS_CHILD_ID, Validators.required],
            file_count: [this.editcomment[i].FILE_COUNT, Validators.required],
            orgmodifiedon:[date_val, Validators.required],
            task_id: [this.editcomment[i].TASK_ID, Validators.required],
            pre_week_object: [this.editcomment[i].PRE_WEEK_OBJECT, Validators.required],
            comment_type: [this.editcomment[i].COMMENT_TYPE, Validators.required],
            manager_id: [manager_id,Validators.required]
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
  
  inserttaskComments() {
    let COMMENTS_txt = this.form.value.comments;
    COMMENTS_txt = COMMENTS_txt.filter((x)=>  x.name!='null' && x.name != null && x.name.trim() !='');
    let commentsData = {
      created_by: this.user.UserInfoId,
      modified_by: this.user.UserInfoId,
      insert_type: this.comments_type[0],
      COMMENTS: JSON.stringify(COMMENTS_txt),
      comments_type: this.type_string
    }

    if(COMMENTS_txt.length >0){
        this.presentLoadingDefault(true);
        this.authService.postData(commentsData, 'task/dailycommentsinsert').then((result) => {
            this.presentLoadingDefault(false);
            this.show_comment_list = -1;
            this.show_comment_attachment = 1;
            this.gettypecount(this.comments_type[0].selectedDate);
        }, (err) => {
            this.presentLoadingDefault(false);
            this.presentToast(err);
        });
    }else{
        this.presentToast("Please enter the comments");
    }
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

  openWeeklyAttachment(i: number, data: any,file_count:any) {

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

    COMMENTS_txt = COMMENTS_txt.filter((x)=>  x.name!='null' && x.name != null && x.name.trim() !='')
    commentsData.COMMENTS = JSON.stringify(COMMENTS_txt);
    commentsData.modified_by = this.user.UserInfoId;
    commentsData.removefeild = JSON.stringify(this.removefeild);
    commentsData.insert_type = this.comments_type[0];

    if(COMMENTS_txt.length > 0 || this.removefeild.length > 0) {
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
    }else{
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
  showComment(index, startweek: any, endweek: any) {

    //this.Getcommentdatewisedata(startweek, endweek);
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
      user_id: this.user.UserInfoId
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
      console.log(this.CommentsListdata);
      this.presentLoadingDefault(false);
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });
  }

  editcommentslist(item) {
    this.COMMENTS_ID = item.COMMENTS_ID;
    this.presentLoadingDefault(true);
    this.CommentsList =[];
    this.authService.getData({}, 'task/getcommentsList_by_id/' + item.COMMENTS_ID).then((result) => {
      this.CommentsList = result;
      this.presentLoadingDefault(false);
      if (this.CommentsList.length ==0) {
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

    if(this.editcomment.length > 0)
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

  createtask_to_open(COMMENTS_CHILD_ID: any,COMMENTS:any) {
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

    console.log(i,data.value);
    
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

  openModalROIReminder(index,itemROI:any){

    console.log(itemROI);
    
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };
    console.log(itemROI);
    let myModalData = {
      data: itemROI
    };

    let myModal: Modal = this.modal.create('RoiReminderPage', myModalData, myModalOptions);

    myModal.present();
    myModal.onDidDismiss((data) => {
    });
    myModal.onWillDismiss((data) => {
    });
  }

  moveToResult(i: number, data: any): void {
    console.log(i,data.value.child_id ,data);

    
    let params = {
      user_info_id: this.user.UserInfoId,
      comments_child_id: data.value.child_id 
    }

    this.presentLoadingDefault(true);
    this.authService.postData(params, 'task/getMoveObjectiveToResult').then((result) => {
      console.log('result',result);
      this.presentLoadingDefault(false);
      this.menu.enable(true);
      this.navCtrl.push(DashboardPage, {});
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });

  }

  movetoobjective(i: number, data: any): void {
  
    let params = {
      user_info_id: this.user.UserInfoId,
      comments_child_id: data.value.child_id 
    }

    this.presentLoadingDefault(true);
    this.authService.postData(params, 'task/getMoveResultToObjective').then((result) => {
      console.log('result',result);
      this.presentLoadingDefault(false);      
      this.menu.enable(true);
      this.navCtrl.push(DashboardPage, {});
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });

  }

  
  tasklistv1(i: number, data: any) {
    console.log('data',data);
    let TASK_ID = data.value.task_id;
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
