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
  selector: 'page-createminutesofmeeting',
  templateUrl: 'createminutesofmeeting.html'
})
export class CreateMomPage {
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
  update_selected_groupid:any;
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
  groudetails: any;
  selected_groupid: any;
  usergroupdetails:any;
  arr = [];
  arr1 = [];
  attendess = [];
  
  userattendaceflag: boolean = true;

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
      title: ['', Validators.compose([Validators.required])],
      date_of_meeting: ['', Validators.compose([Validators.required])],
      next_of_meeting: ['', Validators.compose([Validators.required])],
      organizer_selected: ['', Validators.compose([Validators.required])],
      recurring_meeting: ['', Validators.compose([Validators.required])],
      frequency: ['', Validators.compose([Validators.required])],
      upto_date: ['', Validators.compose([Validators.required])]
    });

    if (this.taskmodal != undefined) {
      this.parent_mom_id = this.taskmodal[0].parent_mom_id;

      // if(this.taskmodal[0].tab_name == 'confirm'){
      //   this.showrecurringmeeting  = 0;
      //   this.showrecurringcheckbox = 1;
      // }

      console.log('Parent mom id', this.parent_mom_id);
    } else {
      this.parent_mom_id = '';
    }

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
    //this.nextmeeting = date;
    this.DueDate_change = today.getDate() + '-' + monthname[(today.getMonth())] + '-' + today.getFullYear();
    this.getusergroup();
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

  getusergroup() {
    let time_bf = new Date();
    this.presentLoadingDefault(true);
    let params = {
      user_info_id: this.user.UserInfoId
    }
    this.authService.postData(params, 'task/UserGroupList').then((result: any) => {

      this.groudetails = result;

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
    this.arr = [];
    for (var i = 0; i < event.value.length; i++) {
      var userDetailsFilter = this.userdetails.find(item => item.USER_INFO_ID == event.value[i]);
      userDetailsFilter.USER_ACCESS = this.createtaskForm.value.user_access;
      userDetailsFilter.GROUP_ID = 0;
      userDetailsFilter.GROUP_NAME = "";
      this.arr.push(userDetailsFilter);
    }
    this.userarry = [...this.arr,...this.arr1];
    console.log(this.userarry);
  }

  addUserGroupAccess(event: { component: SelectSearchableComponent, value: any }) {
    console.log(event.value);
    console.log(event.component.items.filter(x=> x.ID == event.value));
    this.arr1 = [];
    let groupDetails = event.component.items.filter(x=> x.ID == event.value);

    let params = {
      group_id: event.value
    }
    this.presentLoadingDefault(true);
    this.authService.postData(params, 'task/UserGroupDetailList').then((result: any) => {

      this.usergroupdetails = result;
      for (var i = 0; i < this.usergroupdetails.length; i++) {
        var userDetailsFilter = this.userdetails.find(item => item.USER_INFO_ID == this.usergroupdetails[i].USER_INFO_ID);
        userDetailsFilter.GROUP_ID = event.value;
        userDetailsFilter.GROUP_NAME = groupDetails[0].GROUP_NAME;
        this.arr1.push(userDetailsFilter)
      }
      this.userarry = [...this.arr,...this.arr1];
      this.presentLoadingDefault(false);
      console.log(this.userarry);
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });

    
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



  getMomattendessarray(mom_id: any) {
    let length = 1;

    for (let i = 0; i < this.actionpointarray.length; i++) {

      var action_by_array = this.actionpointarray[i].action_by_id.split(',');
      console.log('Action by array', action_by_array);

      for (let j = 0; j < action_by_array.length; j++) {

        let action_by = parseInt(action_by_array[j]);

        if (this.attendess_array.indexOf(action_by) === -1) {
          this.attendess_array.push(action_by);
        }
      }

      if (this.actionpointarray.length == length) {
        this.attendess_array.push(this.user.UserInfoId);
        console.log('Attendees User', this.attendess_array);
        this.getInsertMomAttendees(mom_id);
      }
      length++;
    }
  }


  insertminutesofmeeting() {

    console.log('Meeting Insert start..', this.createtaskForm.value);

    let held_on = '';
    let next_meeting_date = '';
    let current_date = moment().format("DD-MM-YYYY");

    if(this.createtaskForm.value.date_of_meeting != "") {
        held_on = moment(this.createtaskForm.value.date_of_meeting).format("DD-MM-YYYY");
    } else {
        held_on = moment().format("DD-MM-YYYY");
    }

    if (this.createtaskForm.value.title != "" && this.createtaskForm.value.title != null) {

      if(this.createtaskForm.value.next_of_meeting != "" && this.createtaskForm.value.date_of_meeting != "") {
          next_meeting_date = moment(this.createtaskForm.value.next_of_meeting).format("DD-MM-YYYY");
          console.log(held_on, next_meeting_date);
          if (held_on > next_meeting_date) {
              this.presentToast('The next meeting date should be greater than held on.');
              return;
          }
      }

      if (current_date < held_on) {
        this.presentToast('Held on should not be future date.');
        return;
      }

      if (this.recurring_meeting) {

        if (this.createtaskForm.value.frequency == "" || this.createtaskForm.value.frequency == null || this.createtaskForm.value.frequency == undefined) {
          this.presentToast('Please select frequency.');
          return;
        }

        if (this.createtaskForm.value.upto_date == "" || this.createtaskForm.value.upto_date == null) {
          this.presentToast('Please select upto date.');
          return;
        }
      }

      this.presentLoadingDefault(true);
      let task_insert_data = this.createtaskForm.value;
      task_insert_data.created_by = this.user.UserInfoId;
      task_insert_data.user_info_id = this.user.UserInfoId;
      task_insert_data.COMMENTS = JSON.stringify(this.actionpointarray);
      //task_insert_data.attendees = JSON.stringify(this.attendess_array);
      task_insert_data.parent_mom_id = this.parent_mom_id;

      this.authService.postData(task_insert_data, 'task/getInsertMomv2').then((result) => {
        var mom_id = result;
        console.log('new mom id is:', mom_id);
        console.log('Action point array', this.actionpointarray)

        this.getMomattendessarray(mom_id);

        this.presentLoadingDefault(false);
        this.closeModal();
      }, err => {
        this.presentLoadingDefault(false);
        this.presentToast(err);
      });

    } else {
      this.presentToast('Please enter title.');
      return;
    }

  }


  getInsertMomAttendees(mom_id: any) {

        let userExist = this.attendess.filter(x=> x.USER_INFO_ID == this.user.UserInfoId);

        let param = {
            USER_INFO_ID: this.user.UserInfoId,
            USER_SURNAME: this.user.Surname,
            MARK_ATTENDANCE:'P',
            IS_CHECKED: true
        }
  
        if(userExist.length == 0){
          this.attendess.push(param);
        }


    for (let j = 0; j < this.attendess.length; j++) {

      let action_by = parseInt(this.attendess[j].USER_INFO_ID);
      let mark_attendance = this.attendess[j].MARK_ATTENDANCE;

      let commentsData = {
        mom_id: mom_id,
        user_info_id: action_by,
        created_by: this.user.UserInfoId,
        mark_attendance: mark_attendance
      }

      console.log('Insert Mom Attendees', commentsData);
      this.presentLoadingDefault(true);
      this.authService.postData(commentsData, 'task/getInsertMomAttendeesv2').then((result) => {
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

    for (let j = 0; j < this.userarry.length; j++) {

      let attendees_id = parseInt(this.userarry[j].USER_INFO_ID);
      let attendees_name = this.userarry[j].USER_SURNAME;

      let userExist = this.attendess.filter(x=> x.USER_INFO_ID == attendees_id);

      let param = {
        USER_INFO_ID: attendees_id,
        USER_SURNAME: attendees_name,
        MARK_ATTENDANCE:'P',
        IS_CHECKED: true
      }

      if(userExist.length == 0){
        this.attendess.push(param);
      }
      
    }


    console.log('Attendees Array-->',this.attendess);

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

    let nonGroupUser = this.userarry.filter(x=> x.GROUP_ID == 0);

    if(nonGroupUser.length >0){
        var non_group_user_id = nonGroupUser.map(a => a.USER_INFO_ID);
        console.log(non_group_user_id);
        var non_group_user_id_list = this.arrayToString(non_group_user_id);
        console.log(non_group_user_id_list);
        this.pointObject.non_group_by_id = non_group_user_id_list;
    }else{
      this.pointObject.non_group_by_id = "";
    }
    
    let groupUser = this.userarry.filter(x=> x.GROUP_ID > 0);

    if(groupUser.length >0){

        var group_user_id = groupUser.map(a => a.USER_INFO_ID);
        console.log(group_user_id);
        var group_user_id_list = this.arrayToString(group_user_id);
        console.log(group_user_id_list);
        this.pointObject.group_by_id = group_user_id_list;
    
        var group_user_name = groupUser.map(a => a.USER_SURNAME);
        console.log(group_user_name);
        var group_user_name_list = this.arrayToString(group_user_name);
        console.log(group_user_name_list);
        this.pointObject.group_by_name = group_user_name_list;
    
        this.pointObject.group_id = groupUser[0].GROUP_ID;
        this.pointObject.group_name = groupUser[0].GROUP_NAME;

    }else{
        
        this.pointObject.group_by_id = "";    
        this.pointObject.group_by_name = "";    
        this.pointObject.group_id = "";
        this.pointObject.group_name = "";
    }
    
    console.log('pointObject', this.pointObject);
    this.arrpoint.push(this.pointObject);
    this.actionpointarray = this.arrpoint;
    console.log(this.actionpointarray);

    this.enteractionpoint = "";
    this.selected_userid = "";
    this.selected_groupid = "";
    this.userarry = [];
    this.arr = [];
    this.arr1 = [];    

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
    this.selected_groupid = '';
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

    this.attendess = [];

    for (let i = 0; i < this.actionpointarray.length; i++) {

      var action_by_array = this.actionpointarray[i].action_by_id.split(',');
      console.log('Action by array', action_by_array);

      for (let j = 0; j < action_by_array.length; j++) {

        var userDetailsFilter = this.userdetails.find(item => item.USER_INFO_ID == action_by_array[j]);
        let attendees_id = parseInt(userDetailsFilter.USER_INFO_ID);
        let attendees_name = userDetailsFilter.USER_SURNAME;

        let userExist = this.attendess.filter(x=> x.USER_INFO_ID == attendees_id);

        let param = {
            USER_INFO_ID: attendees_id,
            USER_SURNAME: attendees_name,
            MARK_ATTENDANCE:'P',
            IS_CHECKED: true
        }
  
        if(userExist.length == 0){
          this.attendess.push(param);
        }

      }      
    }

  }

  updateAddActionPoint(index: any, action_point: any, action_by_id: any, action_complete_date: any, group_id:any,non_group_by_id:any,group_by_id:any,group_name:any) {
    this.update_index = index;
    this.updateenteractionpoint = '';
    this.update_selected_userid = '';
    this.update_action_complete_date = '';
    this.update_selected_groupid = '';

    let userSelect = [];
    this.arr = [];
    this.arr1 = [];
    let action_by_array = [];
    let group_by_array = [];

    if(non_group_by_id != "" && non_group_by_id != null){
      action_by_array = non_group_by_id.split(',');
      console.log('Action by array', action_by_array);
    }else{
      action_by_array = [];
    }

    if(group_by_id != "" && group_by_id != null){
      group_by_array = group_by_id.split(',');
      console.log('Action by array', group_by_array);
    }else{
      group_by_array = [];
    }
   
    for (let i = 0; i < action_by_array.length; i++) {
      userSelect.push(parseInt(action_by_array[i]));
      var userDetailsFilter = this.userdetails.find(item => item.USER_INFO_ID == action_by_array[i]);
      userDetailsFilter.USER_ACCESS = this.createtaskForm.value.user_access;
      userDetailsFilter.GROUP_ID = 0;
      userDetailsFilter.GROUP_NAME = "";
      this.arr.push(userDetailsFilter);
    }
    this.userarry = [...this.arr,...this.arr1]; 

    for (let i = 0; i < group_by_array.length; i++) {
      var userDetailsFilter = this.userdetails.find(item => item.USER_INFO_ID == group_by_array[i]);
      userDetailsFilter.GROUP_ID = group_id;
      userDetailsFilter.GROUP_NAME = group_name;
      this.arr1.push(userDetailsFilter);
    }

    this.userarry = [...this.arr,...this.arr1]; 

    this.updateenteractionpoint = action_point;
    this.update_action_complete_date = action_complete_date;
    this.update_selected_userid = userSelect;
    this.update_selected_groupid = group_id;

    this.updateActionPointShow = 1;
    this.insertActionPointShow = 2;

  }

  editUserAccess(event: { component: SelectSearchableComponent, value: any }) {
    console.log(event.value);
    this.arr = [];
    for (var i = 0; i < event.value.length; i++) {
      var userDetailsFilter = this.userdetails.find(item => item.USER_INFO_ID == event.value[i]);
      userDetailsFilter.USER_ACCESS = this.createtaskForm.value.user_access;
      userDetailsFilter.GROUP_ID = 0;
      userDetailsFilter.GROUP_NAME = "";
      this.arr.push(userDetailsFilter)
    }
    this.userarry = [...this.arr,...this.arr1];
  }


  editUserGroupAccess(event: { component: SelectSearchableComponent, value: any }) {
    console.log(event.value);
    console.log(event.component.items.filter(x=> x.ID == event.value));
    this.arr1 = [];
    let groupDetails = event.component.items.filter(x=> x.ID == event.value);

    let params = {
      group_id: event.value
    }
    this.presentLoadingDefault(true);
    this.authService.postData(params, 'task/UserGroupDetailList').then((result: any) => {

      this.usergroupdetails = result;
      for (var i = 0; i < this.usergroupdetails.length; i++) {
        var userDetailsFilter = this.userdetails.find(item => item.USER_INFO_ID == this.usergroupdetails[i].USER_INFO_ID);
        userDetailsFilter.GROUP_ID = event.value;
        userDetailsFilter.GROUP_NAME = groupDetails[0].GROUP_NAME;
        this.arr1.push(userDetailsFilter)
      }

      this.userarry = [...this.arr,...this.arr1];
      this.presentLoadingDefault(false);
      console.log(this.userarry);
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });

    
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

    let non_group_by_id = '';

    let nonGroupUser = this.userarry.filter(x=> x.GROUP_ID == 0);
    if(nonGroupUser.length>0){
      var non_group_user_id = nonGroupUser.map(a => a.USER_INFO_ID);
      console.log(non_group_user_id);
      var non_group_user_id_list = this.arrayToString(non_group_user_id);
      console.log(non_group_user_id_list);
      non_group_by_id = non_group_user_id_list;
    }else{
      non_group_by_id = '';
    }

    

    let group_id = 0;
    let group_name = "";
    let group_by_id = "";
    let group_by_name = "";

    let groupUser = this.userarry.filter(x=> x.GROUP_ID > 0);
    if(groupUser.length > 0){

      group_id = groupUser[0].GROUP_ID;
      group_name = groupUser[0].GROUP_NAME;

      var group_user_id = groupUser.map(a => a.USER_INFO_ID);
      console.log(group_user_id);
      var group_user_id_list = this.arrayToString(group_user_id);
      console.log(group_user_id_list);
      group_by_id = group_user_id_list;

      var group_user_name = groupUser.map(a => a.USER_SURNAME);
      console.log(group_user_name);
      var group_user_name_list = this.arrayToString(group_user_name);
      console.log(group_user_name_list);
      group_by_name = group_user_name_list;


    }else{
      group_id = 0;
      group_name = "";
      group_by_id = "";
      group_by_name = "";


    }
    

    this.actionpointarray[this.update_index].action_point = this.updateenteractionpoint;
    this.actionpointarray[this.update_index].action_complete_date = this.update_action_complete_date;
    this.actionpointarray[this.update_index].action_by_id = ACTION_BY
    this.actionpointarray[this.update_index].action_by_name = ACTION_BY_NAME;    
    this.actionpointarray[this.update_index].non_group_by_id = non_group_by_id;
    this.actionpointarray[this.update_index].group_by_id = group_by_id;
    this.actionpointarray[this.update_index].group_by_name = group_by_name;
    this.actionpointarray[this.update_index].group_id = group_id;
    this.actionpointarray[this.update_index].group_name = group_name;
    this.updateActionPointShow = 0;
    this.insertActionPointShow = 1;
   
    this.attendess = [];

    for (let i = 0; i < this.actionpointarray.length; i++) {

      var action_by_array = this.actionpointarray[i].action_by_id.split(',');
      console.log('Action by array', action_by_array);

      for (let j = 0; j < action_by_array.length; j++) {

        var userDetailsFilter = this.userdetails.find(item => item.USER_INFO_ID == action_by_array[j]);
        let attendees_id = parseInt(userDetailsFilter.USER_INFO_ID);
        let attendees_name = userDetailsFilter.USER_SURNAME;

        let userExist = this.attendess.filter(x=> x.USER_INFO_ID == attendees_id);

        let param = {
            USER_INFO_ID: attendees_id,
            USER_SURNAME: attendees_name,
            MARK_ATTENDANCE:'P',
            IS_CHECKED: true
        }
  
        if(userExist.length == 0){
          this.attendess.push(param);
        }

      }      
    }
  }

  recurringmeeting() {
    console.log(this.recurring_meeting);
    if (this.showrecurringmeeting == 1) {
      this.showrecurringmeeting = 0;
    } else {
      this.showrecurringmeeting = 1;
    }
  }

  getUpdateAttendance(event:any,i:any) {
    console.log(i,event.value);
    if(event.value){
      this.attendess[i].MARK_ATTENDANCE = 'P';
      this.attendess[i].IS_CHECKED = true;
    }else{
      this.attendess[i].MARK_ATTENDANCE = 'A';
      this.attendess[i].IS_CHECKED = false;
    }
    console.log(this.attendess[i]);
    
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
