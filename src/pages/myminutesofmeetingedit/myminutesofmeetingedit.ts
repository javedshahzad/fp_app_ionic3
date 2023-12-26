import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, AlertController, Platform, NavParams, Modal, ModalController, ModalOptions, ToastController, LoadingController, ViewController } from 'ionic-angular';
import { DashboardPage } from '../dashboard/dashboard';
import { RestProvider } from '../../providers/rest/rest';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SelectSearchableComponent } from 'ionic-select-searchable';
import { CalendarModalOptions } from "ion2-calendar";
import * as moment from 'moment';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

import * as EmailValidator from 'email-validator';

// import { File } from '@ionic-native/file';
// import { FileOpener } from '@ionic-native/file-opener';

@IonicPage()
@Component({
  selector: 'page-myminutesofmeetingedit',
  templateUrl: 'myminutesofmeetingedit.html'
})

export class MyMinutesOfMeetingEditPage {
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
  parant_or_not: any;
  online_offline = 'white';
  showActionPoints: boolean = true;
  actionpointarray = [] as any;
  arrpoint = [] as any;
  insertActionPointShow = 0;
  updateActionPointShow = 0;
  updatemomheaderdetails = 0;
  enteractionpoint = '';
  addenteractionpoint = '';
  add_selected_userid: any;
  notification_user = [] as any;
  attendees_array = [] as any;
  attendees = '';
  mom_attendees_user = [] as any;
  send_to_email_array = [] as any;
  heldOn: any;
  heldOnDate: any;
  nextmeeting: any;
  nextmeetingDate: any;
  pdfObj = null;
  pdfBufferContent: any;
  options: CalendarModalOptions = {
    title: 'BASIC',
  };

  calendarshow = 0;
  calendarshowheldon = 0;
  calendarshownextmeeting = 0;
  momListAll: any;
  momActionPointListAll: any;
  mom_title: any;
  meeting_date: any;
  organizer: any;
  mom_id: any;
  action_complete_date: any;
  action_point_id: any;
  mom_status: any;
  pointObject = {} as any;
  next_meeting_date: any;
  prepared_by: any;
  mom_created_on: any;
  user_email = '';
  emailto = '';
  updateemailto = '';
  taskmodal = this.navParams.get('data');
  user: any = localStorage.getItem('userData');
  momAttendeesAll: any;

  attendees_attendance: any;
  showEmailList = 0;
  groudetails: any;
  usergroupdetails: any;

  arr = [];
  arr1 = [];
  attendess = [];
  update_selected_groupid: any;
  email_array = [];
  emaillist:any;

  constructor(public platform: Platform, public navCtrl: NavController,
    public navParams: NavParams, public authService: RestProvider,
    public toastCtrl: ToastController, public loadingCtrl: LoadingController,
    public view: ViewController, public alertCtrl: AlertController, private formBuilder: FormBuilder,
    private modal: ModalController
  ) {

    this.customDayShortNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    this.user = this.user ? JSON.parse(this.user) : {};
    this.mom_title = this.taskmodal[0].title;
    this.meeting_date = this.taskmodal[0].meetinDate;
    this.organizer = this.taskmodal[0].organizer;
    this.mom_status = this.taskmodal[0].status;
    this.next_meeting_date = this.taskmodal[0].next_meeting_date;
    this.prepared_by = this.taskmodal[0].prepared_by;
    this.mom_created_on = this.taskmodal[0].created_on
    this.user_email = this.taskmodal[0].user_email;

    this.createtaskForm = this.formBuilder.group({
      title: ['', Validators.compose([Validators.required])],
      date_of_meeting: ['', Validators.compose([Validators.required])],
      next_of_meeting: ['', Validators.compose([Validators.required])]
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
    this.userarry = [];
    this.arrpoint = [];
    var today = new Date();
    var dayname = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var monthname = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var date = dayname[today.getDay()] + '  ' + today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
    this.localDate = date;
    this.DueDate_change = today.getDate() + '-' + monthname[(today.getMonth())] + '-' + today.getFullYear();
    this.mom_id = this.taskmodal[0].mom_id;
    this.getuser();
    this.getusergroup();
    this.getMomAttendeesAll(this.taskmodal[0].mom_id);
    this.getMeetingActionPointAll(this.taskmodal[0].mom_id);
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

      this.userdetails = result;
      this.user_access_list = result;
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
      userDetailsFilter.GROUP_ID = 0;
      userDetailsFilter.GROUP_NAME = "";
      this.arr.push(userDetailsFilter)
    }
    this.userarry = [...this.arr, ...this.arr1];
    console.log(this.userarry);
  }


  addUserGroupAccess(event: { component: SelectSearchableComponent, value: any }) {
    console.log(event.value);
    console.log(event.component.items.filter(x => x.ID == event.value));
    this.arr1 = [];
    let groupDetails = event.component.items.filter(x => x.ID == event.value);

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
      this.userarry = [...this.arr, ...this.arr1];
      this.presentLoadingDefault(false);
      console.log(this.userarry);
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });


  }


  editUserAccess(event: { component: SelectSearchableComponent, value: any }) {
    console.log(event.value);
    this.arr = [];
    for (var i = 0; i < event.value.length; i++) {
      var userDetailsFilter = this.userdetails.find(item => item.USER_INFO_ID == event.value[i]);
      userDetailsFilter.GROUP_ID = 0;
      userDetailsFilter.GROUP_NAME = "";
      this.arr.push(userDetailsFilter)
    }
    this.userarry = [...this.arr, ...this.arr1];
  }

  editUserGroupAccess(event: { component: SelectSearchableComponent, value: any }) {
    console.log(event.value);
    console.log(event.component.items.filter(x => x.ID == event.value));
    this.arr1 = [];
    let groupDetails = event.component.items.filter(x => x.ID == event.value);

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

      this.userarry = [...this.arr, ...this.arr1];
      this.presentLoadingDefault(false);
      console.log(this.userarry);
    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });


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

  insertminutesofmeeting() {

    console.log('Meeting Insert start..');
    this.presentLoadingDefault(true);
    let task_insert_data = this.createtaskForm.value;
    task_insert_data.created_by = this.user.UserInfoId;
    task_insert_data.user_info_id = this.user.UserInfoId;
    task_insert_data.COMMENTS = JSON.stringify(this.actionpointarray),

      this.authService.postData(task_insert_data, 'task/getInsertMinutesOfMeeting').then((result) => {
        this.presentLoadingDefault(false);
        this.closeModal();
      }, err => {
        this.presentLoadingDefault(false);
        this.presentToast(err);
      });
  }


  clicked() {
    this.showActionPoints = !this.showActionPoints;
  }

  updateActionPoint(ACTION_POINT_ID: any, ACTION_POINTS: any, TITLE: any, COMPLETED_DATE: any, ACTION_BY: any, ACTION_BY_NAME: any, TO_EMAIL: any, group_id: any, non_group_by_id: any, group_by_id: any, group_name: any) {

    let userSelect = [];
    var action_by_array = ACTION_BY.split(',');
    console.log('Action by array', action_by_array);
    this.arr = [];
    this.arr1 = [];
    let group_by_array = [];

    // if(non_group_by_id != "" && non_group_by_id != null){
    //   action_by_array = non_group_by_id.split(',');
    //   console.log('Action by array', action_by_array);
    // }else{
    //   action_by_array = [];
    // }

    if (group_by_id != "" && group_by_id != null && group_by_id != undefined) {
      group_by_array = group_by_id.split(',');
      console.log('Action by array', group_by_array);
    } else {
      group_by_array = [];
    }

    for (let i = 0; i < action_by_array.length; i++) {
      if (action_by_array[i] != "" && action_by_array[i] != null) {
        let user_id = parseInt(action_by_array[i]);
        if (user_id > 0) {
          userSelect.push(parseInt(action_by_array[i]));
          var userDetailsFilter = this.userdetails.find(item => item.USER_INFO_ID == user_id);
          this.arr.push(userDetailsFilter);
        }
      }
    }

    this.userarry = [...this.arr, ...this.arr1];

    for (let i = 0; i < group_by_array.length; i++) {
      var userDetailsFilter = this.userdetails.find(item => item.USER_INFO_ID == group_by_array[i]);
      userDetailsFilter.GROUP_ID = group_id;
      userDetailsFilter.GROUP_NAME = group_name;
      this.arr1.push(userDetailsFilter);
    }

    this.userarry = [...this.arr, ...this.arr1];

    this.updateActionPointShow = 1;
    this.insertActionPointShow = 2;

    this.action_point_id = '';
    this.enteractionpoint = '';
    this.selected_userid = '';
    this.action_complete_date = '';

    this.action_point_id = ACTION_POINT_ID;
    this.enteractionpoint = ACTION_POINTS;
    this.selected_userid = userSelect;
    this.updateemailto = TO_EMAIL;
    this.update_selected_groupid = group_id;

    var today = new Date(COMPLETED_DATE);
    var dayname = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var date = dayname[today.getDay()] + '  ' + today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
    this.localDate = date;
    console.log('Date display', this.localDate);

    this.action_complete_date = COMPLETED_DATE;


  }

  deleteActionPoint(ACTION_POINT_ID: any, ACTION_BY: any) {

    console.log('Meeting Delete start..');

    let task_insert_data = {
      action_point_id: ACTION_POINT_ID,
      user_info_id: this.user.UserInfoId
    }

    var action_by_array = ACTION_BY.split(',');
    console.log('Action by array', action_by_array);

    let listarray = this.momListAll.filter(x => x.ACTION_POINT_ID != ACTION_POINT_ID);
    let listarray1 = this.momListAll.filter(x => x.ACTION_POINT_ID == ACTION_POINT_ID);

    if (listarray1.length > 0) {
      for (let i = 0; i < listarray1.length; i++) {
        var action_by_array = listarray1[i].ACTION_BY.split(', ');
        console.log('Action by array', action_by_array);

        for (let j = 0; j < action_by_array.length; j++) {
          var index = this.momAttendeesAll.findIndex(item => item.USER_INFO_ID == action_by_array[j]);
          console.log(index);
          this.momAttendeesAll[index].IS_DELETED = 1;
        }
      }
    }

    if (listarray.length > 0) {

      for (let i = 0; i < listarray.length; i++) {

        var action_by_array = listarray[i].ACTION_BY.split(', ');
        console.log('Action by array', action_by_array);

        for (let j = 0; j < action_by_array.length; j++) {
          var index = this.momAttendeesAll.findIndex(item => item.USER_INFO_ID == action_by_array[j]);
          console.log(index);
          this.momAttendeesAll[index].IS_DELETED = 0;
        }
      }
    }
    console.log(this.momAttendeesAll)
    console.log('Before delete data', task_insert_data);
    this.presentLoadingDefault(true);
    this.authService.postData(task_insert_data, 'task/getDeleteMomActionPoints').then((result) => {
      this.presentLoadingDefault(false);
      this.getInsertMomAttendees();
      this.getMomAttendeesAll(this.taskmodal[0].mom_id);
      this.getMeetingActionPointAll(this.taskmodal[0].mom_id);
    }, err => {
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

    for (let i = 0; i < this.userarry.length; i++) {

      let attendees_exist = this.momAttendeesAll.filter(x => x.USER_INFO_ID == this.userarry[i].USER_INFO_ID);

      if (attendees_exist.length == 0) {

        let params = {
          ID: 0,
          MOM_ID: this.mom_id,
          USER_INFO_ID: this.userarry[i].USER_INFO_ID,
          MARK_ATTENDANCE: 'P',
          ATTENDEES_NAME: this.userarry[i].USER_SURNAME,
          IS_CHECKED: 1,
          IS_DELETED: 0
        }
        this.momAttendeesAll.push(params);
      }
    }

    if (this.updateemailto != "" && this.updateemailto != null) {
      var emailto_array = this.updateemailto.split(',');
      for (let i = 0; i < emailto_array.length; i++) {
        let email_valid_flag = EmailValidator.validate(emailto_array[i]);
        if (!email_valid_flag) {
          this.presentToast('Please enter valid email address.');
          return;
        }
      }
    }

    console.log('Meeting Update start..');
    this.presentLoadingDefault(true);
    let task_insert_data = {
      action_point_id: this.action_point_id,
      action_point: this.enteractionpoint,
      action_completed_date: this.action_complete_date,
      user_info_id: this.user.UserInfoId,
      action_by_id: ACTION_BY,
      action_by_name: ACTION_BY_NAME,
      emailto: this.updateemailto
    }

    console.log('Before update data', task_insert_data);
    this.authService.postData(task_insert_data, 'task/getUpdateMinutesOfMeetingv1').then((result) => {
      this.presentLoadingDefault(false);
      this.getInsertMomAttendees();
      //this.getMeetingActionPointAll(this.taskmodal[0].mom_id);
      this.closeModal();
    }, err => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });

  }

  arrayToString(arr) {
    let str = '';
    arr.forEach(function (i, index) {
      str += i;
      if (index != (arr.length - 1)) {
        str += ', ';
      };
    });
    return str;
  }

  canceladdActionpoint() {
    this.enteractionpoint = '';
    this.addenteractionpoint = '';
    this.DueDate_change = '';
    this.userarry = [];
    this.updateActionPointShow = 0;
    this.insertActionPointShow = 0;
  }

  getMeetingActionPointAll(mom_id: any) {

    let modalData = this.navParams.get('data');
    this.send_to_email_array = [];
    let status = 0;

    let params = {} as any;
    params.user_info_id = this.user.UserInfoId;
    params.status = status;
    params.mom_id = mom_id;

    if (modalData[0].status == 'archive') {

      this.authService.postData(params, 'task/getArchiveMomActionPointList').then((result) => {

        this.momActionPointListAll = result;
        this.momListAll = this.momActionPointListAll.filter(x => x.ACTION_POINTS != null);
        let length = 1;

        for (var i in this.momListAll) {
          this.momListAll[i].INSERT_TYPE = "Inserted";
        }

        for (let i = 0; i < this.momActionPointListAll.length; i++) {
          this.momActionPointListAll[i].INSERT_TYPE = "Inserted";

          if (this.momActionPointListAll[i].ACTION_BY_NAME != "" && this.momActionPointListAll[i].ACTION_BY_NAME != null) {
            var action_by_name_array = this.momActionPointListAll[i].ACTION_BY_NAME.split(',');
            for (let j = 0; j < action_by_name_array.length; j++) {
              if (this.attendees_array.indexOf(action_by_name_array[j]) === -1) {
                this.attendees_array.push(action_by_name_array[j]);
              }
            }
          }

          if (this.momActionPointListAll[i].TO_EMAIL != "" && this.momActionPointListAll[i].TO_EMAIL != null) {
            var email_to_array = this.momActionPointListAll[i].TO_EMAIL.split(',');
            for (let k = 0; k < email_to_array.length; k++) {
              if (this.attendees_array.indexOf(email_to_array[k]) === -1) {
                this.attendees_array.push(email_to_array[k]);
                this.send_to_email_array.push(email_to_array[k]);
              }
            }
          }

          if (this.momActionPointListAll.length == length) {
            let flag = this.attendees_array.includes(this.user.Surname);

            if (!flag) {
              this.attendees_array.push(this.user.Surname);
            }

            let flag_org = this.attendees_array.includes(this.taskmodal[0].organizer);

            if (!flag_org) {
              this.attendees_array.push(this.taskmodal[0].organizer);
            }
            console.log(this.attendees_array);
            this.attendees = this.arrayToString(this.attendees_array);
          }
          length++;
        }

        if (this.momActionPointListAll.length == 0) {
          this.attendees = '--'
        }

      }, (err) => {
        console.log(err);
      });

    } else {

      this.authService.postData(params, 'task/getMomActionPointList').then((result) => {

        this.momActionPointListAll = result;
        this.momListAll = this.momActionPointListAll.filter(x => x.ACTION_POINTS != null);
        console.log(this.momListAll);
        let length = 1;

        for (var i in this.momListAll) {
          this.momListAll[i].INSERT_TYPE = "Inserted";
        }

        for (let i = 0; i < this.momActionPointListAll.length; i++) {

          this.momActionPointListAll[i].INSERT_TYPE = "Inserted";

          if(this.mom_status !='pending'){
            if (this.momActionPointListAll[i].ATTENDEES_NAME != "" && this.momActionPointListAll[i].ATTENDEES_NAME != null) {
              var action_by_name_array = this.momActionPointListAll[i].ATTENDEES_NAME.split(',');
              for (let j = 0; j < action_by_name_array.length; j++) {
                if (this.attendees_array.indexOf(action_by_name_array[j]) === -1) {
                  this.attendees_array.push(action_by_name_array[j]);
                }
              }
            }
          }
          
          if (this.momActionPointListAll[i].TO_EMAIL != "" && this.momActionPointListAll[i].TO_EMAIL != null) {

            var email_to_array = this.momActionPointListAll[i].TO_EMAIL.split(',');

            for (let k = 0; k < email_to_array.length; k++) {
              if (this.email_array.indexOf(email_to_array[k]) === -1) {
                this.email_array.push(email_to_array[k]);
                this.send_to_email_array.push(email_to_array[k]);
              }
            }
          }

          if (this.momActionPointListAll.length == length) {

            let flag = this.attendees_array.includes(this.user.Surname+'P');

            if (!flag) {
              this.attendees_array.push(this.user.Surname);
            }

            let flag_org = this.attendees_array.includes(this.taskmodal[0].organizer+'P');

            if (!flag_org) {
              this.attendees_array.push(this.taskmodal[0].organizer);
            }
            console.log(this.attendees_array);

            this.attendees = this.arrayToString(this.attendees_array);
            this.emaillist = this.arrayToString(this.email_array);

            if (this.email_array.length > 0) {
              this.showEmailList = 1;
            }
          }

          length++;
        }

        if (this.momActionPointListAll.length == 0) {
          this.attendees = '--'
        }

      }, (err) => {
        console.log(err);
      });
    }

  }

  getMomAttendeesAll(mom_id: any) {
    let params = {} as any;
    params.user_info_id = this.user.UserInfoId;
    params.mom_id = mom_id;

    this.authService.postData(params, 'task/getMomAttendeesList').then((result) => {
      this.momAttendeesAll = result;
      console.log(this.momAttendeesAll);
    });
  }

  addNewPoints() {
    this.insertActionPointShow = 1;
    this.updateActionPointShow = 0;
  }

  confirmMom() {

    console.log('Confirm Clicked.');
    let email_to = '';

    if (this.send_to_email_array.length > 0) {
      email_to = JSON.stringify(this.send_to_email_array);
    } else {
      email_to = '';
    }

    this.presentLoadingDefault(true);
    let task_insert_data = {
      mom_id: this.taskmodal[0].mom_id,
      user_info_id: this.user.UserInfoId,
      login_user_name: this.user.Surname,
      title: this.mom_title,
      meeting_date: this.meeting_date,
      organizer: this.organizer,
      prepared_by: this.prepared_by,
      to_email: email_to,
      user_email: this.user_email
    }

    console.log('Before confirm data', task_insert_data);
    this.authService.postData(task_insert_data, 'task/getConfirmMomActionPoints').then((result) => {
      this.presentLoadingDefault(false);
      this.inserttaskComments();
      this.getInsertMomAttendees();
      this.closeModal();
    }, err => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });
  }

  inserttaskComments() {
    this.notification_user = [];
    this.mom_attendees_user = [];
    let length = 1;
    for (let i = 0; i < this.momListAll.length; i++) {

      let actionpointarray = [];
      actionpointarray.push(this.momListAll[i]);
      var action_by_array = this.momListAll[i].ACTION_BY.split(',');
      console.log('Action by array', action_by_array);


      for (let j = 0; j < action_by_array.length; j++) {

        let action_by = parseInt(action_by_array[j]);

        if (this.notification_user.indexOf(action_by) === -1) {
          this.notification_user.push(action_by);
          this.mom_attendees_user.push(action_by);
          console.log('Notification User', this.notification_user);
        }

        let commentsData = {
          created_by: action_by,
          modified_by: action_by,
          insert_type: 'Current',
          COMMENTS: JSON.stringify(actionpointarray),
          comments_type: 'O',
          login_user_id: this.user.UserInfoId,
          label_type: 'Current',
          start_date: null,
          end_date: null,
          selected_date: null,
          mom_id: this.taskmodal[0].mom_id
        }

        console.log('Insert Objective', commentsData);
        this.presentLoadingDefault(true);
        this.authService.postData(commentsData, 'task/getInsertRoiObjectivesFromMom').then((result) => {
          this.presentLoadingDefault(false);
          console.log('result', result);

        }, (err) => {
          this.presentLoadingDefault(false);
          this.presentToast(err);
        });

      }

      if (this.momListAll.length == length) {
        console.log('Notification Start....')
        this.sendNotificationForMom();

      }
      length++;
    }
  }

  sendNotificationForMom() {
    let meeting_date = moment(this.meeting_date).format("DD-MM-YYYY");

    var app_platform: string = '';
    if (this.platform.is('ios')) {
      app_platform = 'ios';
    }

    if (this.platform.is('android')) {
      app_platform = 'android';
    }

    for (let j = 0; j < this.notification_user.length; j++) {

      let action_by = parseInt(this.notification_user[j]);

      if (action_by != this.user.UserInfoId) {

        let push_message = {} as any;
        push_message.title = 'MOM';
        push_message.content = 'Minutes Of Meeting ';
        push_message.message = this.mom_title + ' - ' + meeting_date;
        push_message.app_platform = app_platform;
        push_message.user_info_id = action_by;
        push_message.loggedin_user_id = this.user.UserInfoId;
        push_message.trans_type = 'Mom';

        this.authService.postData(push_message, 'pushnotification/pushnotificationsinglechat').then((result) => {
          console.log('Notification is sent', result);
        }, (err) => {
          this.presentToast(err);
        });
      }

    }
  }

  getInsertMomAttendees() {

    console.log(this.momAttendeesAll);

    for (let j = 0; j < this.momAttendeesAll.length; j++) {

      let action_by = parseInt(this.momAttendeesAll[j].USER_INFO_ID);

      let commentsData = {
        mom_attendees_id: this.momAttendeesAll[j].ID,
        mom_id: this.taskmodal[0].mom_id,
        user_info_id: action_by,
        created_by: this.user.UserInfoId,
        mark_attendance: this.momAttendeesAll[j].MARK_ATTENDANCE,
        is_deleted: this.momAttendeesAll[j].IS_DELETED
      }

      console.log('Insert Mom Attendees', commentsData);
      this.presentLoadingDefault(true);
      this.authService.postData(commentsData, 'task/getInsertAndUpdateMomAttendees').then((result) => {
        this.presentLoadingDefault(false);
        console.log('result', result);

      }, (err) => {
        this.presentLoadingDefault(false);
        this.presentToast(err);
      });
    }

  }


  addpointarray() {
    console.log(this.addenteractionpoint);
    console.log(this.DueDate_change);
    console.log(this.userarry);
    console.log(this.taskmodal[0]);

    this.pointObject = {
      ACTION_POINTS: this.addenteractionpoint,
      ACTION_POINT_ID: 0,
      ACTION_POINT_MODIFIED_ON: null,
      COMPLETED_DATE: this.DueDate_change,
      CREATED_BY: this.user.UserInfoId,
      CREATED_ON: null,
      ID: this.taskmodal[0].mom_id,
      INSERT_TYPE: "Not Inserted",
      IS_ACTIVE: 1,
      IS_DELETED: 0,
      MEETING_DATE: this.taskmodal[0].meetinDate,
      MODIFIED_BY: this.user.UserInfoId,
      MODIFIED_ON: null,
      MOM_CREATOR_NAME: null,
      NAME: this.addenteractionpoint,
      NEXT_MEETING_DATE: null,
      STATUS: 1,
      TITLE: this.taskmodal[0].title
    }

    var result_user_id = this.userarry.map(a => a.USER_INFO_ID);
    console.log(result_user_id);
    var user_id_list = this.arrayToString(result_user_id);
    console.log(user_id_list);
    this.pointObject.ACTION_BY = user_id_list;

    var result_user_name = this.userarry.map(a => a.USER_SURNAME);
    console.log(result_user_name);
    var user_name_list = this.arrayToString(result_user_name);
    console.log(user_name_list);
    this.pointObject.ACTION_BY_NAME = user_name_list;

    console.log('pointObject', this.pointObject);
    this.momListAll.push(this.pointObject);
    console.log(this.momListAll);

    let nonGroupUser = this.userarry.filter(x => x.GROUP_ID == 0);

    if (nonGroupUser.length > 0) {
      var non_group_user_id = nonGroupUser.map(a => a.USER_INFO_ID);
      console.log(non_group_user_id);
      var non_group_user_id_list = this.arrayToString(non_group_user_id);
      console.log(non_group_user_id_list);
      this.pointObject.non_group_by_id = non_group_user_id_list;
    } else {
      this.pointObject.non_group_by_id = "";
    }

    let groupUser = this.userarry.filter(x => x.GROUP_ID > 0);

    if (groupUser.length > 0) {

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

    } else {

      this.pointObject.group_by_id = "";
      this.pointObject.group_by_name = "";
      this.pointObject.group_id = "";
      this.pointObject.group_name = "";
    }


    for (let i = 0; i < this.userarry.length; i++) {

      let attendees_exist = this.momAttendeesAll.filter(x => x.USER_INFO_ID == this.userarry[i].USER_INFO_ID);

      if (attendees_exist.length == 0) {

        let params = {
          ID: 0,
          MOM_ID: this.mom_id,
          USER_INFO_ID: this.userarry[i].USER_INFO_ID,
          MARK_ATTENDANCE: 'P',
          ATTENDEES_NAME: this.userarry[i].USER_SURNAME,
          IS_CHECKED: 1,
          IS_DELETED: 0
        }
        this.momAttendeesAll.push(params);
      }
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

    console.log('Meeting Update start..');

    this.presentLoadingDefault(true);
    let task_insert_data = {
      mom_id: this.taskmodal[0].mom_id,
      action_point: this.addenteractionpoint,
      action_by_id: user_id_list,
      action_by_name: user_name_list,
      action_complete_date: this.DueDate_change,
      user_info_id: this.user.UserInfoId,
      emailto: this.emailto
    }
    console.log('Before update data', task_insert_data);
    this.authService.postData(task_insert_data, 'task/getUpdateInsertActionPointsv1').then((result) => {
      this.presentLoadingDefault(false);
      this.getInsertMomAttendees();
      //this.getMeetingActionPointAll(this.taskmodal[0].mom_id);
      this.closeModal();
    }, err => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });


  }

  updateMomSubject(subject: any, meeting_date: any, next_meeting_date: any) {
    console.log('Old Subject', subject);
    this.updatemomheaderdetails = 1;
    this.updateActionPointShow = 2;
    this.insertActionPointShow = 2;

    var heldOn_Date = new Date(this.meeting_date);
    var heldon_dayname = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var heldon_monthname = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var held_on_date = heldon_dayname[heldOn_Date.getDay()] + '  ' + heldOn_Date.getDate() + '-' + (heldOn_Date.getMonth() + 1) + '-' + heldOn_Date.getFullYear();
    this.heldOn = held_on_date;
    this.heldOnDate = heldOn_Date.getDate() + '-' + heldon_monthname[(heldOn_Date.getMonth())] + '-' + heldOn_Date.getFullYear();

    if (this.next_meeting_date != "" && this.next_meeting_date != null) {
      var today = new Date(this.next_meeting_date);
      var dayname = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      var monthname = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      var date = dayname[today.getDay()] + '  ' + today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
      this.nextmeeting = date;
      this.nextmeetingDate = today.getDate() + '-' + monthname[(today.getMonth())] + '-' + today.getFullYear();
    }

    this.createtaskForm = this.formBuilder.group({
      title: [subject, Validators.compose([Validators.required])],
      date_of_meeting: [this.meeting_date, Validators.compose([Validators.required])],
      next_of_meeting: [this.next_meeting_date, Validators.compose([Validators.required])]
    });

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

  cancelMomUpdate() {
    this.updatemomheaderdetails = 0;
    this.updateActionPointShow = 0;
    this.insertActionPointShow = 0;
  }

  updateminutesofmeeting() {

    console.log('Meeting Insert start..', this.createtaskForm.value);

    let held_on = '';
    let next_meeting_date = '';
    let current_date = moment().format("DD-MM-YYYY");

    if (this.createtaskForm.value.date_of_meeting != "") {
      held_on = moment(this.createtaskForm.value.date_of_meeting).format("DD-MM-YYYY");
    } else {
      held_on = moment().format("DD-MM-YYYY");
    }

    if (this.createtaskForm.value.title != "" && this.createtaskForm.value.title != null) {

      this.mom_title = this.createtaskForm.value.title;
      this.meeting_date = this.createtaskForm.value.date_of_meeting;

      if (this.createtaskForm.value.next_of_meeting != "" && this.createtaskForm.value.date_of_meeting != "") {
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

      this.presentLoadingDefault(true);
      let task_insert_data = this.createtaskForm.value;
      task_insert_data.created_by = this.user.UserInfoId;
      task_insert_data.user_info_id = this.user.UserInfoId;
      task_insert_data.mom_id = this.taskmodal[0].mom_id;

      this.authService.postData(task_insert_data, 'task/getUpdateMomSubject').then((result) => {
        this.presentLoadingDefault(false);
        this.cancelMomUpdate();
      }, err => {
        this.presentLoadingDefault(false);
        this.presentToast(err);
      });
    } else {
      this.presentToast('Please enter title.');
      return;
    }
  }

  convertPdf(mom_id: any) {

    let next_meeting_date = '';
    let meeting_date = moment(this.meeting_date).format("DD-MM-YYYY");
    let created_on = moment(this.mom_created_on).format("DD-MM-YYYY hh:mm A")

    if (this.next_meeting_date != '' && this.next_meeting_date != null) {
      next_meeting_date = moment(this.next_meeting_date).format("DD-MM-YYYY")
    } else {
      next_meeting_date = '-';
    }
    let status = 2;

    let params = {} as any;
    params.user_info_id = this.user.UserInfoId;
    params.status = status;
    params.mom_id = mom_id;

    this.authService.postData(params, 'task/getMomPdfActionPointList').then((result) => {
      this.momActionPointListAll = result;
      console.log('Action Points list', this.momActionPointListAll);

      for (var i = 0; i < this.momActionPointListAll.length; i++) {
        let completed_date = '';

        if (this.momActionPointListAll[i].COMPLETED_DATE != null) {
          completed_date = moment(this.momActionPointListAll[i].COMPLETED_DATE).format("DD-MM-YYYY")
        } else {
          completed_date = '';
        }

        this.momActionPointListAll[i].COMPLETED_DATE = completed_date;
      }


      var docDefinition = {
        content: [
          { text: 'Minutes of the Meeting', style: 'header', decoration: 'underline' },
          '                                                  ',
          '                                                  ',
          {
            style: 'tableExample',
            table: {
              widths: [125, '*'],
              heights: ['auto', 'auto', 'auto', 'auto'],
              body: [
                [{ text: 'Date of Meeting', bold: true }, { text: meeting_date, bold: true }],
                [{ text: 'Purpose', bold: true }, { text: this.mom_title, bold: true }],
                [{ text: 'Attendees', bold: true }, { text: this.attendees, bold: true }],
                [{ text: 'Next Meeting', bold: true }, { text: next_meeting_date, bold: true }]
              ]
            }
          },
          { text: 'Organizer: ' + this.organizer, bold: true },
          { text: 'Prepared by: ' + this.prepared_by, bold: true },
          { text: 'Created On: ' + created_on, bold: true },
          '                                                         ',
          '                                                         ',
          this.table(this.momActionPointListAll, ['ROW_NUMBER', 'ACTION_POINTS', 'ACTION_BY_NAME', 'COMPLETED_DATE'], ['S.No', 'Action Points', 'Action By', 'When'])

        ],
        styles: {
          header: {
            fontSize: 18,
            bold: true,
            alignment: 'center'
          },
          tableHeader: {
            bold: true,
            fontSize: 13,
            color: 'black'
          },
          subheader: {
            fontSize: 14,
            bold: true,
            margin: [0, 15, 0, 0]
          },
          story: {
            italic: true,
            alignment: 'center',
            width: '50%',
          },
          itemsTableHeader: {
            bold: true,
            fontSize: 13,
            color: 'black'
          },
          tableExample: {
            margin: [0, 5, 0, 15]
          }
        }
      }
      this.pdfObj = pdfMake.createPdf(docDefinition);


      const pdfDocGenerator = pdfMake.createPdf(docDefinition);
      pdfDocGenerator.getBuffer((buffer) => {
        this.pdfBufferContent = buffer;
      });

    }, (err) => {
      console.log(err);
    });
  }


  table(data, columns, display) {
    return {
      table: {
        headerRows: 1,
        body: this.buildTableBody(data, columns, display)
      }
    };
  }

  buildTableBody(data, columns, display) {
    var body = [];

    body.push(display);

    data.forEach(function (row) {
      var dataRow = [];

      columns.forEach(function (column) {
        dataRow.push(row[column]);
      })

      body.push(dataRow);
    });

    return body;
  }

  uploadAudio(mom_id: any, mom_action_point_id: any, action_by_id: any) {

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    let myModalData = [{
      mom_id: mom_id,
      mom_action_point_id: mom_action_point_id,
      action_by_id: action_by_id
    }]

    let modelpage = '';
    modelpage = 'AudioPage';

    let myModal: Modal = this.modal.create(modelpage, { data: myModalData }, myModalOptions);

    myModal.present();
    myModal.onDidDismiss((data) => {
    });
    myModal.onWillDismiss((data) => {
    });


  }

  uploadAudioNewComment() {

    console.log('New audio');
    console.log(this.addenteractionpoint);
    console.log(this.DueDate_change);
    console.log(this.userarry);
    console.log(this.taskmodal[0]);

    if (this.userarry.length == 0) {
      this.presentToast('Please select action by.');
      return;
    }

    this.pointObject = {
      ACTION_POINTS: this.addenteractionpoint,
      ACTION_POINT_ID: 0,
      ACTION_POINT_MODIFIED_ON: null,
      COMPLETED_DATE: this.DueDate_change,
      CREATED_BY: this.user.UserInfoId,
      CREATED_ON: null,
      ID: this.taskmodal[0].mom_id,
      INSERT_TYPE: "Not Inserted",
      IS_ACTIVE: 1,
      IS_DELETED: 0,
      MEETING_DATE: this.taskmodal[0].meetinDate,
      MODIFIED_BY: this.user.UserInfoId,
      MODIFIED_ON: null,
      MOM_CREATOR_NAME: null,
      NAME: this.addenteractionpoint,
      NEXT_MEETING_DATE: null,
      STATUS: 1,
      TITLE: this.taskmodal[0].title
    }

    var result_user_id = this.userarry.map(a => a.USER_INFO_ID);
    console.log(result_user_id);
    var user_id_list = this.arrayToString(result_user_id);
    console.log(user_id_list);
    this.pointObject.ACTION_BY = user_id_list;

    var result_user_name = this.userarry.map(a => a.USER_SURNAME);
    console.log(result_user_name);
    var user_name_list = this.arrayToString(result_user_name);
    console.log(user_name_list);
    this.pointObject.ACTION_BY_NAME = user_name_list;

    console.log('pointObject', this.pointObject);
    this.momListAll.push(this.pointObject);
    console.log(this.momListAll);

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

    console.log('Meeting Update start..');

    this.presentLoadingDefault(true);
    let task_insert_data = {
      mom_id: this.taskmodal[0].mom_id,
      action_point: 'Recording',
      action_by_id: user_id_list,
      action_by_name: user_name_list,
      action_complete_date: this.DueDate_change,
      user_info_id: this.user.UserInfoId,
      emailto: this.emailto
    }

    console.log('Before update data', task_insert_data);
    this.authService.postData(task_insert_data, 'task/getInsertMomPointWhileAudioRecording').then((result) => {
      console.log(result);
      this.presentLoadingDefault(false);

      const myModalOptions: ModalOptions = {
        enableBackdropDismiss: false
      };

      let myModalData = [{
        mom_id: this.taskmodal[0].mom_id,
        mom_action_point_id: result
      }]

      let modelpage = '';
      modelpage = 'AudioPage';

      let myModal: Modal = this.modal.create(modelpage, { data: myModalData }, myModalOptions);

      myModal.present();
      myModal.onDidDismiss((data) => {
        this.getMeetingActionPointAll(this.taskmodal[0].mom_id);
        //this.closeModal();
      });
      myModal.onWillDismiss((data) => {
      });

    }, err => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
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
    } else {
      loading.dismissAll();
      loading = null
    }
  }

  getUpdateAttendance(event: any, i: any) {
    console.log(i, event.value);
    if (event.value) {
      this.momAttendeesAll[i].MARK_ATTENDANCE = 'P';
      this.momAttendeesAll[i].IS_CHECKED = true;
    } else {
      this.momAttendeesAll[i].MARK_ATTENDANCE = 'A';
      this.momAttendeesAll[i].IS_CHECKED = false;
    }
    console.log(this.momAttendeesAll[i]);

  }

}
