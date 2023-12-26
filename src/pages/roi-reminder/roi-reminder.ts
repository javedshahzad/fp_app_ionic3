import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, Platform, NavParams, ToastController, LoadingController, ViewController } from 'ionic-angular';
import { DashboardPage } from '../dashboard/dashboard';
import { RestProvider } from '../../providers/rest/rest';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SelectSearchableComponent } from 'ionic-select-searchable';
import { CalendarModalOptions } from "ion2-calendar";


@IonicPage()
@Component({
  selector: 'page-roi-reminder',
  templateUrl: 'roi-reminder.html',
})
export class RoiReminderPage {
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
  showuseraccess = 'none';
  reminderarry = [] as any;
  ReminderList: any;
  ReminderListSearch:any;
  modalData = this.navParams.get('data');
  user: any = localStorage.getItem('userData');
  btnName:any ='Add';
  header_name = '';
  dateMin:any;
  _ROI_REMINDER_ID:any;
  options: CalendarModalOptions = {
    title: 'BASIC',
  };
  calendarshow = 0;  
  localDate: any;

  constructor(public platform: Platform, public navCtrl: NavController, public navParams: NavParams,
    private formBuilder: FormBuilder, public authService: RestProvider,
    public toastCtrl: ToastController, public loadingCtrl: LoadingController,
    public view: ViewController
  ) {
    this.user = this.user ? JSON.parse(this.user) : {};
    this.header_name = this.modalData.name;
    this.createtaskForm = this.formBuilder.group({
      reminder_date: ['', Validators.compose([Validators.required])],
      reminder_hr: ['', Validators.compose([Validators.required])],
      COMMENTS: ['', Validators.compose([Validators.required])]
    });
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
    this.dateMin = new Date();
    this.showuseraccess = 'none';   
    var today = new Date();
    var dayname = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    //var monthname = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var date = dayname[today.getDay()] + '  ' + today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
    this.localDate = date;
   // this.getuser();
    this.GetReminderListAll();
  }

  getuser() {
    let myTitle = 'User Info';
    this.presentLoadingDefault(true);
    this.authService.getData({}, 'task/UserList/').then((result) => {
      this.userdetails = result;
      this.user_access_list = result;
      this.presentLoadingDefault(false);
      if (this.userdetails.length == 0) {
        this.presentToast(`No data found in ${myTitle}`);
      }
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });
  }

  GetReminderListAll() {    
    this.presentLoadingDefault(true);
   let url =`task/roi-comment-reminder/${this.modalData.child_id}`
    this.authService.getData({},url ).then((result) => {
      this.reminderarry = result;
      // if(this.reminderarry == 0){
      //   this.createtaskForm.controls['COMMENTS'].setValue(this.modalData.name);
      // }
      this.showuseraccess ='block';
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
 
  openFromCode() {
    this.selectComponent.open();
  }
 
  addreminder(){
    
    if(this.createtaskForm.value.reminder_date == '' || this.createtaskForm.value.reminder_date == null){
      this.presentToast("Please enter reminder date.");
      return;
    }

    if(this.createtaskForm.value.reminder_hr == '' || this.createtaskForm.value.reminder_hr == null){
      this.presentToast("Please enter time.");
      return;
    }

    if(this.createtaskForm.value.COMMENTS == '' || this.createtaskForm.value.COMMENTS == null){
      this.presentToast("Please enter comments.");
      return;
    }

    let ampm = "";
    let hrval = 0;
    var time = new Date(this.createtaskForm.value.reminder_date);
    console.log('local',  time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }));

    let task_insert_data = this.createtaskForm.value;
    var time_val = task_insert_data.reminder_hr.split(":", 2); 

    let arr2 = {ROI_REMINDER_ID:0,COMMENT_ID:"",REMINDER_DATE:"",HOURS:"",MINUTES:"",COMMENTS:"",REMINDER_HR:"",AMPM:"",HRVAL:0,INSERT_TYPE:""};

    // console.log(this.modalData.name);
    // console.log('Add',task_insert_data);
    // console.log('Add',time_val);
    // console.log('Add',time_val[0],time_val[1]);

    if(time_val[0] < 12){
      ampm = 'AM';
      hrval = time_val[0];
    }else{
      ampm = 'PM';
      hrval = parseInt(time_val[0]) - 12;
    }
    
   // console.log('ADD',hrval,ampm);
    if( this.btnName == 'Update'){
      for (var i in this.reminderarry) {
        if(this.reminderarry[i].ROI_REMINDER_ID == this._ROI_REMINDER_ID) {
          this.reminderarry[i].INSERT_TYPE = "Inserted";  
          this.reminderarry[i].REMINDER_DATE = this.createtaskForm.value.reminder_date;
          this.reminderarry[i].HOURS   = time_val[0];
          this.reminderarry[i].MINUTES  = time_val[1];
          this.reminderarry[i].COMMENTS  = this.createtaskForm.value.COMMENTS;
          this.reminderarry[i].REMINDER_HR  = this.createtaskForm.value.reminder_hr;
          this.reminderarry[i].AMPM  = ampm;
          this.reminderarry[i].HRVAL = hrval
          let obj = this.reminderarry[i]
          this.postData([obj]);
          break;
        }    
      }   
      this.btnName ='Add'
    } else {
      arr2.COMMENT_ID = this.modalData.child_id;
      arr2.REMINDER_DATE = this.createtaskForm.value.reminder_date;
      arr2.HOURS   = time_val[0];
      arr2.MINUTES  = time_val[1];
      arr2.COMMENTS  = this.createtaskForm.value.COMMENTS;
      arr2.REMINDER_HR  = this.createtaskForm.value.reminder_hr;
      arr2.AMPM  = ampm;
      arr2.HRVAL = hrval;
      arr2.INSERT_TYPE = 'New Insert';
      this.postData([arr2]);
      this.reminderarry.push(arr2);
    }
  //  console.log('array--',this.reminderarry);
    this.showuseraccess='block';
    this.createtaskForm.reset();

  }

  deleteReminder(index: any,ROI_REMINDER_ID:any) {
   // var index = this.reminderarry.findIndex(item => (item.COMMENT_ID == COMMENT_ID)&&(item.REMINDER_DATE == REMINDER_DATE)&&(item.REMINDER_HR == REMINDER_HR));
    for (var i in this.reminderarry) {
      if(i == index) {
        this.reminderarry[i].INSERT_TYPE = "Deleted";
        let obj = this.reminderarry[i]
        this.postData([obj]);
        break;
      }    
    }   
  }

  editReminder(index: any,reminder:any) {
    this.btnName ='Update'
    let hr = parseInt(reminder.HOURS);
    hr = hr == 12 ? 0 :hr;
    if(reminder.AMPM =='PM'){
      hr = hr + 12;
    }
    this._ROI_REMINDER_ID= reminder.ROI_REMINDER_ID
    let reminder_hr = `${hr}:${reminder.MINUTES}`;    
    // var index = this.reminderarry.findIndex(item => (item.COMMENT_ID == COMMENT_ID)&&(item.REMINDER_DATE == REMINDER_DATE)&&(item.REMINDER_HR == REMINDER_HR));
    this.createtaskForm.controls['reminder_date'].setValue(reminder.REMINDER_DATE);
    this.createtaskForm.controls['reminder_hr'].setValue(reminder_hr);
    this.createtaskForm.controls['COMMENTS'].setValue(reminder.COMMENTS);
     console.log(reminder);
   }

  inserttaskreminder() {
    let comment = this.isNonEmptyString(this.createtaskForm.value.COMMENTS);
    let hr =this.isNonEmptyString(this.createtaskForm.value.reminder_hr);
    let dt =this.isNonEmptyString(this.createtaskForm.value.reminder_date);
    if(comment || hr || dt){ 
      this.presentToast(`Please ${this.btnName} reminder details.`);      
    } else {
      if(this.reminderarry.length > 0){
       // this.postData();
      }else{
        this.presentToast("Please enter reminder details.");
        return;
      }   
    }
  }

  postData(array){
    console.log('Reminder Insert start..');
    this.presentLoadingDefault(true);
    let task_insert_data = this.createtaskForm.value;
    task_insert_data.created_by = this.user.UserInfoId;
    task_insert_data.user_reminder = JSON.stringify(array);
    task_insert_data.COMMENT_ID = this.modalData.child_id;
    task_insert_data.user_info_id = this.user.UserInfoId;

    this.authService.postData(task_insert_data, 'task/roi-comment-reminder/insert').then((result) => {
        this.presentLoadingDefault(false);
        this.GetReminderListAll();
    }, (err) => {
        this.presentLoadingDefault(false);
        this.presentToast(err);
    });
  }

  showusercontrol(){
    if(this.showuseraccess=="block"){
      this.showuseraccess="none";
    }else{
      this.showuseraccess="block";
    }
  }

  isNonEmptyString(str: any){
    str = str ? str.trim() : str;
    return  str && str.length > 0; // Or any other logic, removing whitespace, etc.
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
    //var monthname = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var date = dayname[today.getDay()] + '  ' + today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
    this.localDate = date;    
    if (this.calendarshow == 1) {
      this.calendarshow = 0;
    } else {
      this.calendarshow = 1;
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
