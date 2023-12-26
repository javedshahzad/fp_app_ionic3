import { Component} from '@angular/core';
import { IonicPage, NavController, Platform, LoadingController, ToastController, NavParams, ViewController, Modal, ModalController, ModalOptions} from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { CalendarViewEditPage } from '../calendarviewedit/calendarviewedit';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-roicalendarview',
  templateUrl: 'roicalendarview.html',
})

export class RoiCalendarView {

  modaltype       = this.navParams.get('data');
  user: any       = localStorage.getItem('userData');
  today_date      = new Date();
  header_name     = '';
  currentEvents   = [];
  currentEvents_1 = [];
  events: any;
  selectedDay = new Date();
  roidetails: any;
  customMonthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul','Aug','Sep','Oct','Nov','Dec'];
  thisMonth='';
  roiCalendarView:any;
  calendarViewFor:any;
  loginUserID:any;
  SelectedDate:any;
  show_insert_objective = 0;
  myModalData: any;
  TYPE:any;
  clickedDate:any;
  clickedMonth:any;
  clickedYear:any;
  now:any;
  start_of_week:any;
  end_of_week:any;
  show_edit_objective = 0;


  constructor(public platform: Platform, public navCtrl: NavController, public navParams: NavParams,
    public view: ViewController, public toastCtrl: ToastController, private modal: ModalController,
    public loadingCtrl: LoadingController, public authService: RestProvider,
    private datePipe: DatePipe
  ) {
    this.user = this.user ? JSON.parse(this.user) : {};      
    this.calendarViewFor = this.modaltype[0].user_info_id;  
    this.loginUserID = this.user.UserInfoId ? this.user.UserInfoId : null;
    this.events = [];
    

    if(this.modaltype[0].user_info_id == this.user.UserInfoId){
      this.header_name = this.user.ManagerName;
    }else{
      this.header_name     = "ROI Calendar View";
    }
  }

  ionViewDidLoad() {
    
    let selectedyear = this.selectedDay.getFullYear();
    let converted_date = new Date(this.selectedDay);
    let modified_date = this.datePipe.transform(converted_date, 'dd-MMM-yyyy');
    let modified_today_date  = this.datePipe.transform(this.today_date, 'dd-MMM-yyyy');

    if(modified_date >= modified_today_date){
      this.show_insert_objective = 1;
      this.show_edit_objective = 1;
    }else{
      this.show_insert_objective = 0;
      this.show_edit_objective = 0;
    }
    
    this.getCalendarView(this.selectedDay.getMonth()+1, selectedyear);
    this.getRoiDatils(modified_date);
  }

  onMonthSelect(event) {
    
    let thisMonth = parseInt(event.month)+1;
    this.getCalendarView(thisMonth,event.year);
  }

  onDaySelect(event) {    
    let selectedMonth  = event.month;
    this.thisMonth     = this.customMonthNames[selectedMonth];
    let selectedDate   = event.date+'-'+this.thisMonth+'-'+event.year;
    let converted_date = new Date(selectedDate);
    let modified_date  = this.datePipe.transform(converted_date, 'dd-MMM-yyyy');
    let modified_today_date  = this.datePipe.transform(this.today_date, 'dd-MMM-yyyy');

    if(modified_date >= modified_today_date){
      this.show_insert_objective = 1;
    }else{
      this.show_insert_objective = 0;
    }
    this.SelectedDate   = modified_date;

    this.now            = moment().format('DD-MMM-YYYY');
    console.log('now',this.now);

    let start_week     = moment(this.now).startOf('week').toDate();
    let end_week       = moment(this.now).endOf('week').toDate();
    this.start_of_week = moment(start_week).format('DD-MMM-YYYY');
    this.end_of_week   = moment(end_week).format('DD-MMM-YYYY');
    console.log('hi--->', this.start_of_week, this.end_of_week);

    if(modified_date >= this.start_of_week){
      this.show_edit_objective = 1;
    }else{
      this.show_edit_objective = 0;
    }
    this.clickedDate    = event.date;
    this.clickedMonth   = event.month;
    this.clickedYear    = event.year;

    this.getRoiDatils(modified_date);
  }

  
  closeModal() {
    this.view.dismiss();
  }

  getRoiDatils(selectedDate: any) {
    
    let params = {} as any;
    params.user_info_id = this.modaltype[0].user_info_id;
    params.selectedDate = selectedDate;

    this.authService.postData(params, 'task/getCalendarViewRoi').then((result) => {
      this.roidetails = result; 
         
    }, (err) => {
      console.log(err);
    });
  }

  getCalendarView(selectedMonth: any,selectedYear:any) {
    this.currentEvents = [];
    let params = {} as any;
    params.user_info_id  = this.modaltype[0].user_info_id;
    params.selectedMonth = selectedMonth;
    params.selectedYear  = selectedYear

    this.authService.postData(params, 'task/getCalendarView').then((result) => {
      this.roiCalendarView = result; 
      for(let i=0; i<this.roiCalendarView.length;i++){
        let viewdate = {} as any;
        viewdate['year']  = parseInt(this.roiCalendarView[i].CMT_YEAR);
        viewdate['month'] = parseInt(this.roiCalendarView[i].CMT_MONTH)-1;
        viewdate['date']  = parseInt(this.roiCalendarView[i].CMT_DATE);
        this.currentEvents[i] = viewdate;
        
      }

      this.events = this.currentEvents;
         
    }, (err) => {
      console.log(err);
    });
  }

  
  createNewObjective(){

    console.log(this.SelectedDate);

     const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };
    
    let myModalData = [{
      reporting_user_id: this.modaltype[0].user_info_id,
      selected_date: this.SelectedDate,
      label_type: 'UserObject',
      start_date: null,
      end_date: null
    }];

    let myModal: Modal = this.modal.create('CreateRoiObjectivePage', { data: myModalData }, myModalOptions);

    myModal.present();
    myModal.onDidDismiss((data) => {    
      
      this.getRoiDatils(this.SelectedDate);

    });
    myModal.onWillDismiss((data) => {
    });
  }

  openModalcomments() {

    let type = 'CalendarView';
  
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    this.myModalData = [{
        type:  type,
        selectedDate : this.SelectedDate
       }
    ]

    let myModal: Modal = this.modal.create(CalendarViewEditPage, { data: this.myModalData }, myModalOptions);
    myModal.present();
    myModal.onDidDismiss((data) => {        
    });
    myModal.onWillDismiss((data) => {
    });     
  }

}
