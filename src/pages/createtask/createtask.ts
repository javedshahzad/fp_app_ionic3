import { Component, ViewChild } from '@angular/core';
import { NavController, Platform, NavParams, ToastController, LoadingController, ViewController } from 'ionic-angular';
import { DashboardPage } from '../dashboard/dashboard';
import { RestProvider } from '../../providers/rest/rest';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SelectSearchableComponent } from 'ionic-select-searchable';
import { CalendarModalOptions } from "ion2-calendar";
// import * as moment from 'moment'

@Component({
  selector: 'page-createtask',
  templateUrl: 'createtask.html'
})
export class CreateTaskPage {
  @ViewChild('myselect') selectComponent: SelectSearchableComponent;

  duedate = 'none';
  assign = 'none';
  titlestyle = 'block';
  userdetails: any;
  user_access_list: any;
  useraccess: any;
  insertedValues: any;
  pushnotificationValues: any;
  createtaskForm: FormGroup;
  userarry = [] as any;
  showuseraccess = "block";
  firstParam: any;
  secondParam: any;
  customDayShortNames: any;
  selected_userid: any;
  file_name = [] as any;
  size = [] as any;
  imageURI = [] as any;
  user_create_by: any;
  localDate: any;
  DueDate_change: any;
  parant_or_not:any;
  online_offline = 'white';

  options: CalendarModalOptions = {
    title: 'BASIC',
  };
  calendarshow = 0;

  taskmodal = this.navParams.get('data');
  user: any = localStorage.getItem('userData');
  constructor(public platform: Platform, public navCtrl: NavController, public navParams: NavParams,
    private formBuilder: FormBuilder, public authService: RestProvider,
    public toastCtrl: ToastController, public loadingCtrl: LoadingController,
    public view: ViewController
  ) {
    this.customDayShortNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    this.useraccess = [
      { id: 1, control_name: 'Full Control', control_value: 'F' },
      { id: 2, control_name: 'View Only', control_value: 'V' }
    ];

    this.user = this.user ? JSON.parse(this.user) : {};
    

    if(this.taskmodal != undefined ){

      this.createtaskForm = this.formBuilder.group({
        title: [this.taskmodal[0].TASK_TITLE, Validators.compose([Validators.required])],
        due_date: ['', Validators.compose([Validators.required])],
        created_by: [],
        assigned_user: ['', Validators.compose([Validators.required])],
        add_user_access: ['', Validators.compose([Validators.required])],
        user_access: ['', Validators.compose([Validators.required])]
      });

    }else{

      this.createtaskForm = this.formBuilder.group({
        title: ['', Validators.compose([Validators.required])],
        due_date: ['', Validators.compose([Validators.required])],
        created_by: [],
        assigned_user: ['', Validators.compose([Validators.required])],
        add_user_access: ['', Validators.compose([Validators.required])],
        user_access: ['', Validators.compose([Validators.required])]
      });

    }

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

  ionViewDidLoad() {
    this.userarry = [];
    var today = new Date();
    var dayname = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var monthname = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var date = dayname[today.getDay()] + '  ' + today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
    this.localDate = date;
    this.DueDate_change = today.getDate() + '-' + monthname[(today.getMonth())] + '-' + today.getFullYear();
    console.log('firstParam', this.taskmodal);

    this.getuser();
  }

  opencalendar() {
    if (this.calendarshow == 1) {
      this.calendarshow = 0;
    } else {
      this.calendarshow = 1;
    }
  }

  onChange(event) {
    var today = new Date(event._d);
    var dayname = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var monthname = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var date = dayname[today.getDay()] + '  ' + today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
    this.localDate = date;
    this.DueDate_change = today.getDate() + '-' + monthname[(today.getMonth())] + '-' + today.getFullYear();
    if (this.calendarshow == 1) {
      this.calendarshow = 0;
    } else {
      this.calendarshow = 1;
    }
  }
 

  getuser() {
      this.presentLoadingDefault(true);
      this.authService.getData({}, 'task/UserList/').then((result: any) => {
      
          this.userdetails      = result;  
          this.user_access_list = result;
          this.user_create_by   = result.filter(item => item.USER_INFO_ID == 6 || item.USER_INFO_ID == 1181);

          if(this.taskmodal != undefined){      
              console.log('firstParam --',this.taskmodal[0].assign_user_id);
              this.selected_userid = this.taskmodal[0].assign_user_id;     
          }else{
              this.selected_userid = '';
          }

          if(this.taskmodal != undefined){ 
              if(this.taskmodal[0].TASK_ID == 0){             
                  this.parant_or_not = 0;
              }else if(this.taskmodal[0].TASK_ID == -1){                  
                this.parant_or_not = 0;
              }else{                  
                  this.parant_or_not = 1;
              }
          }

          this.presentLoadingDefault(false);
      
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });
  }

  clearvalues() {
    this.createtaskForm.reset();
    return false;
  }

  nextduedate() {
    this.duedate = 'block';
    this.titlestyle = 'none';
  }
  titleshow() {
    this.titlestyle = 'block';
    this.duedate = 'none';
  }
  usershow() {
    this.assign = 'block';
    this.duedate = 'none';
  }
  dueshow() {
    this.assign = 'none';
    this.duedate = 'block';
  }

  closeModal() {
    this.view.dismiss();
  }

  userAssignedTo(event: { component: SelectSearchableComponent, value: any }) {
    console.log('event', event);
    let checkdata = this.userdetails.filter(x=>x.USER_INFO_ID == event.value);
    if(checkdata[0].STATUS == 0){
      this.online_offline = '#e36c6c';
    }else{
      this.online_offline = '#75f475';
    }

  }


  addUserAccess(event: { component: SelectSearchableComponent, value: any }) {
    console.log(event.value);
    let arr = []
    for (var i = 0; i < event.value.length; i++) {
      var userDetailsFilter = this.userdetails.find(item => item.USER_INFO_ID == event.value[i]);
      userDetailsFilter.USER_ACCESS = this.createtaskForm.value.user_access;
      arr.push(userDetailsFilter)
    }
    this.userarry = arr;
  }


  changeAccessControl(event: { component: SelectSearchableComponent, value: any }, USER_INFO_ID: any) {  
    for (var i in this.userarry) {
      if (this.userarry[i].USER_INFO_ID == USER_INFO_ID) {
        this.userarry[i].USER_ACCESS = event;
        break;
      }
    } 
  }

  showusercontrol() {
    if (this.showuseraccess == "block") {
      this.showuseraccess = "none";
    } else {
      this.showuseraccess = "block";
    }
  }

  DeleteUser(index: any, USER_INFO_ID: any) {
 
    var index = this.userarry.findIndex(item => item.USER_INFO_ID == USER_INFO_ID);
    if (index > -1) {
      this.userarry.splice(index, 1);
    }
  }

  onClose() {
    let toast = this.toastCtrl.create({
      message: 'Thank You',
      duration: 2000
    })
    toast.present();
  }

  openFromCode() {
    this.selectComponent.open();
  }

  inserttask() {
    
    let task_insert_data = this.createtaskForm.value;
    task_insert_data.useraccesslist = JSON.stringify(this.userarry);
    task_insert_data.due_date = this.DueDate_change;
    //task_insert_data.created_by = this.user.UserInfoId;

    if (this.createtaskForm.value.assigned_user != '') {
        task_insert_data.status = 2;
    } else {
        task_insert_data.status = 1;
    }

    if (task_insert_data.created_by == null) {
        task_insert_data.created_by = this.user.UserInfoId;
    }

    if (task_insert_data.created_by != this.user.UserInfoId) {
        task_insert_data.org_task_creator_name = this.user.Surname;
    } else {
        task_insert_data.org_task_creator_name = null;
    }
    
    if(this.taskmodal != undefined){
        if(this.taskmodal[0].TASK_ID == 0){
            task_insert_data.parent_task_id = 0;
        }else if(this.taskmodal[0].TASK_ID == -1){
            task_insert_data.parent_task_id = 0;
        }else{
            task_insert_data.parent_task_id = this.taskmodal[0].TASK_ID;
        }
    }else{
        task_insert_data.parent_task_id = 0;
    }

    if(task_insert_data.assigned_user !='' && task_insert_data.assigned_user != undefined){
        let checkdata = this.userdetails.filter(x=>x.USER_INFO_ID == task_insert_data.assigned_user);
        if(checkdata[0].STATUS == 0){
            task_insert_data.mobile_num = checkdata[0].USER_MOBILE;
        }else{
            task_insert_data.mobile_num = 0;
        }
    }else{
      task_insert_data.mobile_num = 0;
    }

    if(this.taskmodal != undefined){
        if(this.taskmodal[0].TASK_ID == -1){ 
          console.log('Comments ID',this.taskmodal[0].COMMENTS_ID);
            task_insert_data.comments_id = this.taskmodal[0].COMMENTS_ID;
        }else{
            task_insert_data.comments_id = 0;
        }
    }else{
      task_insert_data.comments_id = 0;
    }

    if (this.createtaskForm.value.title == '' || this.createtaskForm.value.title == null) {      
      this.presentToast("Please enter title.");
    } else {
      this.presentLoadingDefault(true);
      this.authService.postData(task_insert_data, 'task/TaskInsertv1').then((result) => {
        this.presentLoadingDefault(false);     
        this.insertedValues = result;
       
        if (this.file_name.length > 0) {

          let task_id = this.insertedValues.taskinsertdata.p_task_id;
          task_insert_data.TASK_ID = task_id;
          task_insert_data.name = this.file_name;
          task_insert_data.size_data = this.size;
          task_insert_data.imageURI_data = this.imageURI;
          task_insert_data.modified_by = this.user.UserInfoId;

          this.authService.postData(task_insert_data, 'task/TaskInsertMultipleFile').then((result) => {
            this.presentLoadingDefault(false);     
            console.log(result);
          }, (err) => {
            this.presentLoadingDefault(false);
            this.presentToast(err);
          });
        }

        var app_platform: string = '';
        if (this.platform.is('ios')) {
          app_platform = 'ios';
        }

        if (this.platform.is('android')) {
          app_platform = 'android';
        }

        var taskcreator = this.userdetails.filter(item => item.USER_INFO_ID == task_insert_data.created_by);
        //console.log('taskcreator', taskcreator.USER_INFO_ID);
        let push_message = {} as any;
        push_message.title = taskcreator[0].USER_SURNAME
        push_message.message = 'Task No: ' + this.insertedValues.taskinsertdata.p_seq_text + '\n Title: ' + this.createtaskForm.value.title + '\n Comments: New task is Created.';
        push_message.app_platform = app_platform;
        push_message.task_assignee_id = this.createtaskForm.value.assigned_user;
        push_message.task_created_by = taskcreator[0].USER_INFO_ID;
        push_message.new_task = 'NewTask';
        push_message.loggedin_user_id = taskcreator[0].USER_INFO_ID;
        push_message.task_id = this.insertedValues.taskinsertdata.p_task_id;
        push_message.trans_type = 'TMS';

        this.authService.postData(push_message, 'pushnotification/pushnotificationsend').then((result) => {
          this.presentLoadingDefault(false);
          this.pushnotificationValues = result;

        }, (err) => {
          this.presentLoadingDefault(false);
          this.presentToast(err);
        });

        this.closeModal();
      }, err => {
        this.presentLoadingDefault(false);
        this.presentToast(err);
      });
    }
  }


  onSelectFile(event) {
    let file = event.target.files;
    for (var i = 0; i < file.length; i++) {
      this.file_name.push(file[i].name);
      this.size.push(file[i].size);
      let reader = new FileReader();
      reader.readAsDataURL(file[i]);
      reader.onloadend = (e) => {
        this.imageURI.push(reader.result);
      };
      reader.onerror = function (error) {
        console.log('Error: ', error);
      };
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
