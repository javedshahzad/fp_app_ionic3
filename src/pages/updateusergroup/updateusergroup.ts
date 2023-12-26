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
  selector: 'page-updateusergroup',
  templateUrl: 'updateusergroup.html'
})
export class UpdateUserGroupPage {
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
  selected_userid = [] as any;
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
  show_user_list_all = 0;
  group_name = '';

  constructor(public platform: Platform, public navCtrl: NavController,
    public navParams: NavParams, private formBuilder: FormBuilder,
    public authService: RestProvider, public toastCtrl: ToastController,
    public loadingCtrl: LoadingController, public view: ViewController
  ) {
    
    this.user = this.user ? JSON.parse(this.user) : {};
  
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
    this.group_name = this.taskmodal[0].group_name; 
    this.getusergroup();
    this.getuser();
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

    let userSelect = [];
    this.selected_userid = [];

    this.presentLoadingDefault(true);

    let params = {
      group_id: this.taskmodal[0].group_id
    }

    this.presentLoadingDefault(true);
    this.authService.postData(params, 'task/UserGroupDetailList').then((result: any) => {

      this.usergroupdetails = result;
      console.log(this.usergroupdetails);  

      for (let i = 0; i < this.usergroupdetails.length; i++) {        
          userSelect.push(parseInt(this.usergroupdetails[i].USER_INFO_ID));     
          this.usergroupdetails[i].IS_DELETED = 1      
      }

      this.selected_userid = userSelect;
      console.log(this.selected_userid);

      this.presentLoadingDefault(false);

    }, (err) => {
      this.presentLoadingDefault(false);
      this.presentToast(err);
    });
  }

  closeModal() {
    this.view.dismiss();
  }

  itemSelected(){
    this.show_user_list_all =1;
  }

  addUserAccess(event: { component: SelectSearchableComponent, value: any }) {
    console.log(event.value);

    for (let i = 0; i < this.usergroupdetails.length; i++) {
      this.usergroupdetails[i].IS_DELETED = 1      
    }
    
    for (var i = 0; i < event.value.length; i++) {

        var userDetailsFilter = this.userdetails.find(item => item.USER_INFO_ID == event.value[i]);

        let groupuser = this.usergroupdetails.filter(item => item.USER_INFO_ID == event.value[i]);

        if(groupuser.length == 0){
          let arr = {
            CREATED_BY: this.user.UserInfoId,
            CREATED_ON: null,
            GROUP_ID: this.taskmodal[0].group_id,
            ID: 0,
            IS_ACTIVE: 1,
            IS_DELETED: 0,
            MODIFIED_BY: this.user.UserInfoId,
            MODIFIED_ON: null,
            USER_INFO_ID: userDetailsFilter.USER_INFO_ID,
            USER_NAME: userDetailsFilter.USER_SURNAME
          };
          this.usergroupdetails.push(arr);
        }else{
          let index = this.usergroupdetails.findIndex(item => item.USER_INFO_ID == event.value[i]);
          this.usergroupdetails[index].IS_DELETED = 0
        }
        
    }

    console.log(this.usergroupdetails);
    
  }

  insertUpdateUserGroup() {
  
      this.presentLoadingDefault(true);
      let task_insert_data = {
        user_info_id: this.user.UserInfoId,
        COMMENTS: JSON.stringify(this.usergroupdetails),
        created_by: this.user.UserInfoId
      };

      this.authService.postData(task_insert_data, 'task/getInsertUpdateUserGroup').then((result) => {
        var group_id = result;
        console.log('new group id is:', group_id);
        this.presentLoadingDefault(false);
        this.ionViewDidLoad();
      }, err => {
        this.presentLoadingDefault(false);
        this.presentToast(err);
      });

    
  }


}
