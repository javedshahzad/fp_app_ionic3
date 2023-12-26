import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, Platform, NavParams, ToastController, LoadingController, ViewController } from 'ionic-angular';
import { DashboardPage } from '../dashboard/dashboard';
import { RestProvider } from '../../providers/rest/rest';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SelectSearchableComponent } from 'ionic-select-searchable';
import { CalendarModalOptions } from "ion2-calendar";
import * as moment from 'moment';
import * as EmailValidator from 'email-validator';

@IonicPage()
@Component({
  selector: 'page-createusergroup',
  templateUrl: 'createusergroup.html'
})
export class CreateUserGroupPage {
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
  organizer_arr = [] as any;
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
  parant_or_not: any;
  online_offline = 'white';
  showActionPoints: boolean = true;
  actionpointarray = [] as any;
  arrpoint = [] as any;
  insertActionPointShow = 0;
  enteractionpoint = '';
  emailto = '';
  pointObject = {} as any;
  updateActionPointShow = 0;
  action_complete_date = '';

  updateenteractionpoint = '';
  update_selected_userid: any;
  update_action_complete_date = '';
  update_index: any;
  attendess_array = [] as any;

  heldOn: any;
  heldOnDate: any;
  nextmeeting: any;
  uptoDate: any;
  uptoRecurringDate: any;
  nextmeetingDate: any;
  options: CalendarModalOptions = {
    title: 'BASIC'
  };

  calendarshow = 0;
  calendarshowheldon = 0;
  calendarshownextmeeting = 0;
  calendarshowuptodate = 0;
  recurring_meeting: boolean = false;
  frequency: any;
  parent_mom_id = '';
  showrecurringmeeting = 0;
  showrecurringcheckbox = 0;
  tab_name = '';
  group_name = '';
  taskmodal = this.navParams.get('data');
  user: any = localStorage.getItem('userData');
  constructor(public platform: Platform, public navCtrl: NavController,
    public navParams: NavParams, private formBuilder: FormBuilder,
    public authService: RestProvider, public toastCtrl: ToastController,
    public loadingCtrl: LoadingController, public view: ViewController
  ) {
    this.customDayShortNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    this.useraccess = [
      { id: 1, control_name: 'Full Control', control_value: 'F' },
      { id: 2, control_name: 'View Only', control_value: 'V' }
    ];

    this.user = this.user ? JSON.parse(this.user) : {};
    //this.selected_userid = [this.user.UserInfoId];
    this.createtaskForm = this.formBuilder.group({
      group_name: ['', Validators.compose([Validators.required])],
    });


  }

  markDisabled = (date: Date) => {
    var current = new Date();
    return date < current;
  };

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
    this.organizer_arr = [];
    this.arrpoint = [];
    var today = new Date();
    var dayname = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var monthname = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var date = dayname[today.getDay()] + '  ' + today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
    this.localDate = date;
    this.heldOn = date;
    this.DueDate_change = today.getDate() + '-' + monthname[(today.getMonth())] + '-' + today.getFullYear();

    this.getuser();
  }

  opencalendar() {
    if (this.calendarshow == 1) {
      this.calendarshow = 0;
    } else {
      this.calendarshow = 1;
    }
  }

  opencalendarheldon() {
    if (this.calendarshowheldon == 1) {
      this.calendarshowheldon = 0;
    } else {
      this.calendarshowheldon = 1;
    }
  }

  opencalendarnextmeetingshow() {
    if (this.calendarshownextmeeting == 1) {
      this.calendarshownextmeeting = 0;
    } else {
      this.calendarshownextmeeting = 1;
    }
  }


  opencalendaruptodateshow() {
    if (this.calendarshowuptodate == 1) {
      this.calendarshowuptodate = 0;
    } else {
      this.calendarshowuptodate = 1;
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

  heldOnChange(event) {
    var today = new Date(event._d);
    var dayname = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var monthname = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var date = dayname[today.getDay()] + '  ' + today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
    this.heldOn = date;
    this.heldOnDate = today.getDate() + '-' + monthname[(today.getMonth())] + '-' + today.getFullYear();
    if (this.calendarshowheldon == 1) {
      this.calendarshowheldon = 0;
    } else {
      this.calendarshowheldon = 1;
    }
  }

  nextmeetingonChange(event) {
    var today = new Date(event._d);
    var dayname = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var monthname = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var date = dayname[today.getDay()] + '  ' + today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
    this.nextmeeting = date;
    this.nextmeetingDate = today.getDate() + '-' + monthname[(today.getMonth())] + '-' + today.getFullYear();
    if (this.calendarshownextmeeting == 1) {
      this.calendarshownextmeeting = 0;
    } else {
      this.calendarshownextmeeting = 1;
    }
  }

  uptoDateonChange(event) {
    var today = new Date(event._d);
    var dayname = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var monthname = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var date = dayname[today.getDay()] + '  ' + today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
    this.uptoDate = date;
    this.uptoRecurringDate = today.getDate() + '-' + monthname[(today.getMonth())] + '-' + today.getFullYear();
    if (this.calendarshowuptodate == 1) {
      this.calendarshowuptodate = 0;
    } else {
      this.calendarshowuptodate = 1;
    }
  }

  getuser() {
    let time_bf = new Date();
    this.presentLoadingDefault(true);
    this.authService.getData({}, 'task/UserList/').then((result: any) => {

      this.userdetails = result;
      this.user_access_list = result;

      let time_af = new Date();
      let seconds = Math.round((time_af.getTime() - time_bf.getTime()) / 1000);
      console.log(' create mom Seconds:', seconds);

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
    let checkdata = this.userdetails.filter(x => x.USER_INFO_ID == event.value);
    if (checkdata[0].STATUS == 0) {
      this.online_offline = '#e36c6c';
    } else {
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


  addActionByUserAccess(event: { component: SelectSearchableComponent, value: any }) {
    console.log('Organizer selected -->', event.value);
    let arr = []
    for (var i = 0; i < event.value.length; i++) {
      var userDetailsFilter = this.userdetails.find(item => item.USER_INFO_ID == event.value[i]);
      userDetailsFilter.USER_ACCESS = this.createtaskForm.value.user_access;
      arr.push(userDetailsFilter)
    }
    this.organizer_arr = arr;
    console.log('Organizer array', this.organizer_arr);
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





  insertUserGroup() {

    console.log('User Group Start..', this.createtaskForm.value);
    console.log(this.userarry);

    if (this.userarry.length == 0) {
      this.presentToast('Please select one or more user.');
      return;
    }

    if (this.group_name != "" && this.group_name != null) {

      this.presentLoadingDefault(true);
      let task_insert_data = {
        group_name: this.group_name,
        created_by: this.user.UserInfoId,
        user_info_id: this.user.UserInfoId,
        COMMENTS: JSON.stringify(this.userarry)
      };

      this.authService.postData(task_insert_data, 'task/getInsertUserGroup').then((result) => {
        var group_id = result;
        console.log('new group id is:', group_id);
        this.presentLoadingDefault(false);
        this.closeModal();
      }, err => {
        this.presentLoadingDefault(false);
        this.presentToast(err);
      });

    } else {
      this.presentToast('Please enter group name.');
      return;
    }
  }


  getInsertMomAttendees(mom_id: any) {

    for (let j = 0; j < this.attendess_array.length; j++) {

      let action_by = parseInt(this.attendess_array[j]);

      let commentsData = {
        mom_id: mom_id,
        user_info_id: action_by,
        created_by: this.user.UserInfoId
      }

      console.log('Insert Mom Attendees', commentsData);
      this.presentLoadingDefault(true);
      this.authService.postData(commentsData, 'task/getInsertMomAttendees').then((result) => {
        this.presentLoadingDefault(false);
        console.log('result', result);

      }, (err) => {
        this.presentLoadingDefault(false);
        this.presentToast(err);
      });
    }
  }

  clicked() {
    this.showActionPoints = !this.showActionPoints;
  }

  addActionPoint() {
    this.insertActionPointShow = 1;
  }

  addpointarray() {

    if (this.userarry.length == 0) {
      this.presentToast('Please select action by.');
      return;
    }

    if (this.emailto != "" && this.emailto != null) {
      var emailto_array = this.emailto.split(',');
      for (let i = 0; i < emailto_array.length; i++) {
        let email_valid_flag = EmailValidator.validate(emailto_array[i]);
        if (!email_valid_flag) {
          this.presentToast('Please enter valid email address.');
          return;
        }
      }
    }


    this.pointObject = {
      action_point: this.enteractionpoint,
      action_complete_date: this.DueDate_change,
      emailto: this.emailto
    }

    console.log('pointObject', this.pointObject);

    var result_user_id = this.userarry.map(a => a.USER_INFO_ID);
    console.log(result_user_id);
    var user_id_list = this.arrayToString(result_user_id);
    console.log(user_id_list);
    this.pointObject.action_by_id = user_id_list;

    var result_user_name = this.userarry.map(a => a.USER_SURNAME);
    console.log(result_user_name);
    var user_name_list = this.arrayToString(result_user_name);
    console.log(user_name_list);
    this.pointObject.action_by_name = user_name_list;

    console.log('pointObject', this.pointObject);
    this.arrpoint.push(this.pointObject);
    this.actionpointarray = this.arrpoint;
    console.log(this.actionpointarray);

    this.enteractionpoint = "";
    this.selected_userid = "";

  }

  arrayToString(arr) {
    let str = '';
    arr.forEach(function (i, index) {
      str += i;
      if (index != (arr.length - 1)) {
        str += ',';
      };
    });
    return str;
  }

  canceladdActionpoint() {
    this.enteractionpoint = '';
    this.DueDate_change = '';
    this.userarry = [];
    this.insertActionPointShow = 0;
    this.updateActionPointShow = 0;
  }

  deletePointArray(index: any, action_point: any) {
    console.log(index, action_point);

    var index = this.actionpointarray.findIndex(item => item.action_point == action_point);
    if (index > -1) {
      this.actionpointarray.splice(index, 1);
    }

  }

  updateAddActionPoint(index: any, action_point: any, action_by_id: any, action_complete_date: any) {
    this.update_index = index;
    this.updateenteractionpoint = '';
    this.update_selected_userid = '';
    this.update_action_complete_date = '';

    let userSelect = [];
    var action_by_array = action_by_id.split(',');
    console.log('Action by array', action_by_array);
    for (let i = 0; i < action_by_array.length; i++) {
      userSelect.push(parseInt(action_by_array[i]));
    }

    this.updateenteractionpoint = action_point;
    this.update_action_complete_date = action_complete_date;
    this.update_selected_userid = userSelect;

    this.updateActionPointShow = 1;
    this.insertActionPointShow = 2;

  }

  editUserAccess(event: { component: SelectSearchableComponent, value: any }) {
    console.log(event.value);
    let arr = []
    for (var i = 0; i < event.value.length; i++) {
      var userDetailsFilter = this.userdetails.find(item => item.USER_INFO_ID == event.value[i]);
      arr.push(userDetailsFilter)
    }
    this.userarry = arr;
  }

  editpointarray() {

    var result_user_id = this.userarry.map(a => a.USER_INFO_ID);
    console.log(result_user_id);
    var user_id_list = this.arrayToString(result_user_id);
    console.log(user_id_list);
    let ACTION_BY = user_id_list;

    var result_user_name = this.userarry.map(a => a.USER_SURNAME);
    console.log(result_user_name);
    var user_name_list = this.arrayToString(result_user_name);
    console.log(user_name_list);
    let ACTION_BY_NAME = user_name_list;

    this.actionpointarray[this.update_index].action_point = this.updateenteractionpoint;
    this.actionpointarray[this.update_index].action_complete_date = this.update_action_complete_date;
    this.actionpointarray[this.update_index].action_by_id = ACTION_BY
    this.actionpointarray[this.update_index].action_by_name = ACTION_BY_NAME;
    this.updateActionPointShow = 0;
    this.insertActionPointShow = 1;
  }

  recurringmeeting() {
    console.log(this.recurring_meeting);
    if (this.showrecurringmeeting == 1) {
      this.showrecurringmeeting = 0;
    } else {
      this.showrecurringmeeting = 1;
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
    } else {
      loading.dismissAll();
      loading = null
    }
  }

}
